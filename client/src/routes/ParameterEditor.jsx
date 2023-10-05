import { useState, useRef, useEffect } from 'react'
import Parameter from '../parameter';
import Color from '../color';
import ColorPicker from '../ColorPicker';
import Value from '../components/Value';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SuggestedInput from './SuggestedInput';
import ColorPickShow from '../components/colorPickShow';
import ColorGradient from '../components/ColorGradient';
import '../styles/Parameters.scss'
import { FaArrowsRotate, FaFloppyDisk, FaEraser, FaTrash } from 'react-icons/fa6';
import HorizontalSelector from '../components/HorizontalSelector';
import { getParameters, getParameter,saveParameter,deleteParameter } from '../utils/fetchParameter';

function ParameterEditor() {

  const [count, setCount] = useState(0)
  const [isPickingWhite, setIsPickingWhite] = useState(false);
  const [whiteColor, setWhiteColor] = useState(new Color(255, 255, 255, 255));
  const [parameter, setParameter] = useState(null);
  const [values, SetValues] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [parameterName, setParameterName] = useState(useParams().parameterName || "");
  const [parameterHasColorScale, setParameterHasColorScale] = useState(true);
  const [focusColor, setFocusColor] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setParameterName(params.parameterName || "");

  }, [params.parameterName]);

  useEffect(() => {
    if (parameter) {
      if (parameter.isColor !== undefined) {
        setParameterHasColorScale(parameter.isColor);
        console.log("color parameter", parameter)
        SetValues(parameter.values);
      }
    }
    else {
      setParameter(new Parameter(parameterName, new Color(255, 255, 255, 255), []));
    }
  }, [parameter]);

  useEffect(() => {

    getParametersApi();
    getParameterApi();
  }, [parameterName]);

  const checkAuth = (code) => {
    if (code === 401) {
      navigate('/login');
    }
  }
  const changeValue = (value, newValue) => {
    setFocusColor(value.color);
    parameter.setValue(value.color, newValue);
    SetValues(parameter.values);
    setParameter(parameter);
    setCount(count + 1);
  }
  const deleteValue = (value) => {
    parameter.deleteValue(value.color);
    SetValues(parameter.values);
    setParameter(parameter);
    setCount(count + 1);
  }

  const handleClick = (color) => {


    if (isPickingWhite) {
      setWhiteColor(color.toString());
      setIsPickingWhite(false);
      parameter.setWhite(color);

      return;
    }
    parameter.addValue(color, 0)
    setParameter(parameter);
    setCount(count + 1);
  }

  
  const getParametersApi = async () => {
    const response = await getParameters();
    const { data, error, code } = response;
    const newParameters = data;
    console.log("response", response)
    if (error !== null) {
      console.log("error", error)
      checkAuth(code);
    }
    else {
      console.log("newParameters", newParameters)
      setParameters(newParameters);
    }
  }

  

  const getParameterApi = async (saveToState = true) => {
    if (parameterName === "") {
      setParameter(new Parameter("", new Color(255, 255, 255, 255), []));
      return null;
    }
    const response = await getParameter(parameterName);
    const { data, error, code } = response;
    console.log("response", response)
    if (error !== null) {
      console.log("error", error)
      checkAuth(code);
    }
    else {
      const newParameters = Parameter.loadParametersFromJSON([data]);
      const newParameter = newParameters.find(p => p.name === parameterName);
      if (!saveToState) {
        return newParameter;
      }
      if (newParameter) {
        setParameter(newParameter);
      }
      return newParameter;
    }
    
  }
  const saveParameterApi = async () => {
    if (parameter.name === null || parameter.name === undefined) {
      alert("Parameter name cannot be empty");
      return;
    }
    const response = await saveParameter(parameter.name,parameter.getValues(),parameterHasColorScale);
    const { data, error, code } = response;
    console.log("response", response)
    if (error !== null) {
      console.log("error", error)
      checkAuth(code);
    }
    else {
      alert(`Parameter '${parameter.name}' saved`);
      getParameterApi();
    }
  }

  const deleteParameterApi = async() => {
    /* delete parameter from API*/
    if (!confirm(`Are you sure you want to delete '${parameter.name}'?`)) {
      return;
    }
    const response = await deleteParameter(parameter.name);
    const { data, error, code } = response;
    console.log("response", response)
    if (error !== null) {
      console.log("error", error)
      checkAuth(code);
    }
    else {
      alert(`Parameter '${parameter.name}' deleted`);
      setParameter(new Parameter("", new Color(255, 255, 255, 255), []));
      setParameterName("");
      navigate(`/parameter/`);
    }
  }
  

  const changeParameterName = (e) => {
    parameter.name = e.target.value.toLowerCase();
    setParameter(parameter);
    setParameterName(e.target.value);
    navigate(`/parameter/${e.target.value}`);
  }
  const loadParameter = (parameterName) => {
    navigate(`/parameter/${parameterName}`);
  }
  return (
    <>
      {parameter !== null ? (
        <>
          <h2>Parameters</h2>

          <HorizontalSelector
            values={parameters.map(p => p.name)}
            selectedValue={parameterName}
            onClick={loadParameter}
          />
          <section className="parameterEditor">
            <h2>Edit parameter</h2>
            <label htmlFor="parameterName">Parameter name</label>
            <SuggestedInput
              //suggested={parameters.filter(p => p.name.includes(parameterName)).map(p => p.name)}
              suggested={[]}
              value={parameter.name}
              onChange={changeParameterName}
            />
            <section className="colorScaleSection">
              <label htmlFor="hasColorScale">Has color scale</label>
              <input type="checkbox" checked={parameterHasColorScale} onChange={(e) => setParameterHasColorScale(e.target.checked)} />
            </section>
            <section className="buttonSection">
              <FaArrowsRotate className="icon" onClick={getParameterApi} />
              <FaFloppyDisk className="icon" onClick={saveParameterApi} />
              <FaEraser className="icon" onClick={() => setParameter(new Parameter(parameter.name, parameter.white, []))} />
              <FaTrash className="icon" onClick={deleteParameterApi} />
            </section>
            {parameterHasColorScale &&
              <section className="colorSelector">
                <ColorPicker onClick={handleClick} isPicking={true} />
                <ColorPickShow
                  isPickingWhite={isPickingWhite}
                  setIsPickingWhite={setIsPickingWhite}
                  whiteColor={whiteColor}
                  pickedColor={parameter.values.length !== 0 ? parameter.values[parameter.values.length - 1].color : new Color(255, 255, 255, 255)}
                />
                {values &&
                  <ColorGradient colors={values} />
                }
              </section>
            }
            <section className="parameter-values">
              {parameter.getValues().map((value, index) => {
                return <Value
                  value={value}
                  key={value.color.toString() + index}
                  onValueChange={changeValue}
                  onValueDelete={deleteValue}
                  autoFocus={focusColor === value.color}
                />
              }
              )}
            </section>
          </section>








        </>)
        : <h1>Parameter not found</h1>
      }
    </>
  )
}

export default ParameterEditor
