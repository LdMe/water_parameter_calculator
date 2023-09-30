import { useState, useRef, useEffect } from 'react'
import Parameter from '../parameter';
import Color from '../color';
import ColorPicker from '../ColorPicker';
import Value from '../Value';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';


function ParameterEditor() {

  const [count, setCount] = useState(0)
  const [isPickingWhite, setIsPickingWhite] = useState(false);
  const [whiteColor, setWhiteColor] = useState(new Color(255, 255, 255, 255));
  const [parameter, setParameter] = useState(null);
  const [parameterName, setParameterName] = useState(useParams().parameterName || "");
  const [parameterHasColorScale, setParameterHasColorScale] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getParameterApi();
  }, []);

  useEffect(() => {
    if (parameter) {
      console.log("parameter",parameter)
      setParameterHasColorScale(parameter.isColor);
    }
  }, [parameter]);



  const loadParameterFromLocalStorage = () => {
    const localStorageParameters = localStorage.getItem("parameters");
    if (!localStorageParameters) {
      localStorage.setItem("parameters", JSON.stringify([]));
    }
    const parameters = Parameter.loadParametersFromJSON(JSON.parse(localStorage.getItem("parameters")));
    const newParameter = parameters.find(p => p.name === parameterName);
    if (newParameter) {
      setParameter(newParameter);
    }
    else {
      setParameter(new Parameter(parameterName, new Color(255, 255, 255, 255), []));
    }
  }



  const changeValue = (value, newValue) => {
    parameter.setValue(value.color, newValue);
    setParameter(parameter);
  }
  const deleteValue = (value) => {
    parameter.deleteValue(value.color);
    setParameter(parameter);
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
      else {
        setParameter(new Parameter(parameterName, new Color(255, 255, 255, 255), []));
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
    const parameters = JSON.parse(localStorage.getItem("parameters"));
    if (parameters) {
      if (parameters.find(p => p.name === parameter.name)) {
        if (!confirm(`Are you sure you want to delete the parameter '${parameter.name}'?`)) {
          return;
        };
        const index = parameters.findIndex(p => p.name === parameter.name);
        parameters.splice(index, 1);
        localStorage.setItem("parameters", JSON.stringify(parameters));
        return;
      }
    }
  }
  const changeParameterName = (e) => {
    parameter.name = e.target.value.toLowerCase();
    setParameter(parameter);
    setParameterName(e.target.value);
    navigate(`/parameter/${e.target.value}`);
  }
  return (
    <>
      {parameter !== null ? (
        <>
          <p>Click on the image to get the mean rgb value of the area clicked</p>
          <ColorPicker onClick={handleClick} isPicking={true}
          />
          <input type="text" value={parameter.name} onChange={changeParameterName} />
          <button
            onClick={setIsPickingWhite}>
            {
              isPickingWhite ? "Picking" : "Pick white color"
            }
          </button>
          <span style={{ backgroundColor: whiteColor.toString(), padding: "10px 15px", marginLeft: "10px", border: "1px solid black" }}></span>
          <label htmlFor="hasColorScale">Has color scale</label>
          <input type="checkbox" checked={parameterHasColorScale} onChange={(e) => setParameterHasColorScale(e.target.checked)} />
          <button onClick={saveParameter}>Save</button>
          <button onClick={getParameterApi}>Reset</button>
          <button onClick={() => setParameter(new Parameter(parameter.name, parameter.white, []))}>New</button>
          <button onClick={deleteParameter}>Delete</button>

          {parameter.getValues().map((value, index) => {
            return <Value
              value={value}
              key={value.color.toString() + index}
              onValueChange={changeValue}
              onValueDelete={deleteValue}
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
