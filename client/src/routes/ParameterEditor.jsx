import { useState, useRef, useEffect,useContext } from 'react'
import Parameter from '../parameter';
import Color from '../color';
import ColorPicker from '../ColorPicker';
import Value from '../components/Value';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SuggestedInput from './SuggestedInput';
import ColorPickShow from '../components/colorPickShow';
import ColorGradient from '../components/ColorGradient';
import ParametersContext from '../context/parametersContext';
import '../styles/Parameters.scss'
import { FaArrowsRotate, FaFloppyDisk, FaEraser, FaTrash } from 'react-icons/fa6';
import HorizontalSelector from '../components/HorizontalSelector';
import {saveParameter,deleteParameter } from '../utils/fetchParameter';


function ParameterEditor() {

  const [count, setCount] = useState(0)
  const [isPickingWhite, setIsPickingWhite] = useState(false);
  const [whiteColor, setWhiteColor] = useState(new Color(255, 255, 255, 255));
  const [parameter, setParameter] = useState(null);
  const [values, setValues] = useState([]);
  const {parameters, getParameters} = useContext(ParametersContext);
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
        
        setValues(parameter.values);
      }
    }
    else {
      setParameter(new Parameter(parameterName, new Color(255, 255, 255, 255), []));
    }
  }, [parameter]);

  useEffect(() => {
    getParameterFromContext();
  }, [parameterName,parameters]);

  const checkAuth = (code) => {
    if (code === 401) {
      navigate('/login');
    }
  }
  const changeValue = (value, newValue) => {
    setFocusColor(value.color);
    parameter.setValue(value.color, newValue);
    setValues(parameter.values);
    setParameter(parameter);
    setCount(count + 1);
  }

  const changeColor = (value, color) => {
    parameter.setColor(value.color,color );
    setValues(parameter.values);
    setParameter(parameter);
    setCount(count + 1);
  }
  const deleteValue = (value) => {
    parameter.deleteValue(value.color);
    setValues(parameter.values);
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
 

  const getParameterFromContext = async (saveToState = true) => {
    console.log("getting parameter from context",parameterName)
    if (parameterName === "") {
      setParameter(new Parameter("", new Color(255, 255, 255, 255), []));
      return null;
    }
    const selectedParam = parameters.find(p => p.name === parameterName);
    console.log("selected param",selectedParam)
    if (selectedParam) {
      setParameter(selectedParam);
      setParameterName(selectedParam.name);

      setValues(selectedParam.values);
      return selectedParam;
    }
    setParameter(new Parameter("", new Color(255, 255, 255, 255), []));
    return null;  
    
  }
  const saveParameterApi = async () => {
    console.log("saving parameter",parameter)
    if (parameterName === null || parameterName === undefined) {
      alert("Parameter name cannot be empty");
      return;
    }
    const response = await saveParameter(parameterName,parameter.getValues(),parameterHasColorScale);
    const { data, error, code } = response;
    
    if (error !== null) {
      
      checkAuth(code);
    }
    else {
      alert(`Parameter '${parameterName}' saved`);
      getParameters();
      getParameterFromContext();
    }
  }

  const deleteParameterApi = async() => {
    /* delete parameter from API*/
    if (!confirm(`Are you sure you want to delete '${parameterName}'?`)) {
      return;
    }
    const response = await deleteParameter(parameterName);
    const { data, error, code } = response;
    
    if (error !== null) {
      
      checkAuth(code);
    }
    else {
      alert(`Parameter '${parameterName}' deleted`);
      setParameter(new Parameter("", new Color(255, 255, 255, 255), []));
      setParameterName("");
      navigate(`/parameter/`);
    }
  }
  

  const changeParameterName = (e) => {
    setParameterName(e.target.value.toLowerCase());
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
              value={parameterName}
              onChange={changeParameterName}
            />
            
            <section className="colorScaleSection">
              <label htmlFor="hasColorScale">Has color scale</label>
              <input type="checkbox" checked={parameterHasColorScale} onChange={(e) => setParameterHasColorScale(e.target.checked)} />
            </section>
            <section className="buttonSection">
              <FaArrowsRotate className="icon" onClick={getParameterFromContext} />
              <FaFloppyDisk className="icon" onClick={saveParameterApi} />
              <FaEraser className="icon" onClick={() => setParameter(new Parameter(parameterName, parameter.white, []))} />
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
                  onColorChange={changeColor}
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
