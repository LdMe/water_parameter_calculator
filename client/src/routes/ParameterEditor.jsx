import { useState, useRef, useEffect } from 'react'
import Parameter from '../parameter';
import Color from '../color';
import ColorPicker from '../ColorPicker';
import Value from '../components/Value';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';
import SuggestedInput from './SuggestedInput';
import ColorPickShow from '../components/colorPickShow';
import '../styles/Parameters.scss'

function ParameterEditor() {

  const [count, setCount] = useState(0)
  const [isPickingWhite, setIsPickingWhite] = useState(false);
  const [whiteColor, setWhiteColor] = useState(new Color(255, 255, 255, 255));
  const [parameter, setParameter] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [parameterName, setParameterName] = useState(useParams().parameterName || "");
  const [parameterHasColorScale, setParameterHasColorScale] = useState(true);
  const [focusColor, setFocusColor] = useState(null);
  const webLocation = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setParameterName(params.parameterName || "");

  }, [params.parameterName]);

  useEffect(() => {
    if (parameter) {
      console.log("parameter", parameter)
      if(parameter.isColor !== undefined){
        setParameterHasColorScale(parameter.isColor);
      }
    }
  }, [parameter]);

  useEffect(() => {

    getParametersApi();
    getParameterApi();
  }, [parameterName]);


  const changeValue = (value, newValue) => {
    setFocusColor(value.color);
    parameter.setValue(value.color, newValue);
    setParameter(parameter);
    setCount(count + 1);
  }
  const deleteValue = (value) => {
    parameter.deleteValue(value.color);
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

  const saveParameter = () => {
    /* if (parameter.name === "" || parameter.name === null || parameter.name === undefined) {
      alert("Parameter name cannot be empty");
      return;
    }
    const parameters = JSON.parse(localStorage.getItem("parameters"));
    if (parameters) {
      if (parameters.find(p => p.name === parameter.name)) {
        if (!confirm(`A parameter with thes name '${parameter.name}' already exists, do you want to overwrite it?`)) {
          return;
        };
        const index = parameters.findIndex(p => p.name === parameter.name);
        parameters[index] = parameter;
        localStorage.setItem("parameters", JSON.stringify(parameters));
        setCount(count + 1);

        alert(`Parameter '${parameter.name}' saved`);
        return;
      }
      parameters.push(parameter);

      localStorage.setItem("parameters", JSON.stringify(parameters));
    } else {
      localStorage.setItem("parameters", JSON.stringify([parameter]));
    }
    setCount(count + 1);
    alert("Parameter saved"); */
    saveParameterApi();
  }
  const getParametersApi = async () => {
    try {
      const response = await fetch(API_URL + "parameters", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message);
      }
      const newParameters = Parameter.loadParametersFromJSON(json);
      setParameters(newParameters);
      return newParameters;
    }
    catch (err) {
      console.log(err);
      return null;
    }
  }
  const getParameterApi = async (saveToState = true) => {
    if (parameterName === "") {
      setParameter(new Parameter("", new Color(255, 255, 255, 255), []));
      return null;
    }
    try {
      const response = await fetch(API_URL + "parameters/" + parameterName, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message);
      }

      const newParameters = Parameter.loadParametersFromJSON([json]);

      const newParameter = newParameters.find(p => p.name === parameterName);
      if (!saveToState) {
        return newParameter;
      }
      if (newParameter) {
        setParameter(newParameter);
      }
      return newParameter;
    }
    catch (err) {
      console.log(err);
      return null;
    }
  }
  const saveParameterApi = async () => {
    if (parameter.name === null || parameter.name === undefined) {
      alert("Parameter name cannot be empty");
      return;
    }
    try {
      const oldParameter = await getParameterApi(false);
      if (oldParameter) {
        if (!confirm(`A parameter with the name '${parameter.name}' already exists, do you want to overwrite it?`)) {
          return;
        };
        const data = {
          name: parameter.name,
          colors: parameter.getValues(),
          isColor: parameterHasColorScale
        }
        const response = await fetch(API_URL + "parameters/" + parameterName, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(data),
        });
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.message);
        }
        alert(`Parameter '${parameter.name}' saved`);
        getParameterApi();
        return;
      }
      const data = {
        name: parameter.name,
        colors: parameter.getValues(),
        isColor: parameterHasColorScale
      }
      const response = await fetch(API_URL + "parameters/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message);
      }
      alert(`Parameter '${parameter.name}' saved`);
    }
    catch (err) {
      console.log(err);
    }
  }


  const deleteParameter = () => {
    /* delete parameter from API*/
    if (!confirm(`Are you sure you want to delete '${parameter.name}'?`)) {
      return;
    }
    deleteParameterApi();
  }
  const deleteParameterApi = async () => {
    try {
      const response = await fetch(API_URL + "parameters/" + parameterName, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      });
      const json = await response.json();
      console.log(json);
      if (!response.ok) {
        throw new Error(json.message);
      }
      alert(`Parameter '${parameter.name}' deleted`);
      setParameter(new Parameter("", new Color(255, 255, 255, 255), []));
      setParameterName("");
      navigate(`/parameter/`);
    }
    catch (err) {
      console.log(err);
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
          <h1>Parameters</h1>
          <section className="parameterList">
            {parameters.map(p => {
              return <article key={p.name}><button onClick={() => loadParameter(p.name)}>{p.name}</button></article>
            }
            )}
          </section>
          <h2>Edit parameter</h2>
          <label htmlFor="parameterName">Parameter name</label>
          <SuggestedInput
            //suggested={parameters.filter(p => p.name.includes(parameterName)).map(p => p.name)}
            suggested={[]}
            value={parameter.name}
            onChange={changeParameterName}
          />

          <button onClick={getParameterApi}>Reset</button>
          <button onClick={saveParameter}>Save</button>
          <button onClick={() => setParameter(new Parameter(parameter.name, parameter.white, []))}>New</button>
          <button onClick={deleteParameter}>Delete</button>
          <label htmlFor="hasColorScale">Has color scale</label>
          <input type="checkbox" checked={parameterHasColorScale} onChange={(e) => setParameterHasColorScale(e.target.checked)} />
          {parameterHasColorScale &&
            <section className="colorSelector">
              <ColorPicker onClick={handleClick} isPicking={true} />
              <ColorPickShow
                        isPickingWhite={isPickingWhite}
                        setIsPickingWhite={setIsPickingWhite}
                        whiteColor={whiteColor}
                        pickedColor={parameter.values.length !== 0 ? parameter.values[parameter.values.length -1].color : new Color(255,255,255,255)}
                         />
            </section>
          }




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



        </>)
        : <h1>Parameter not found</h1>
      }
    </>
  )
}

export default ParameterEditor
