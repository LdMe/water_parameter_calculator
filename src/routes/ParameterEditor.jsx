import { useState, useRef, useEffect } from 'react'
import Parameter from '../parameter';
import Color from '../color';
import ColorPicker from '../ColorPicker';
import Value from '../Value';
import {useParams} from 'react-router-dom';



function ParameterEditor() {

  const [count, setCount] = useState(0)
  const [isPickingWhite, setIsPickingWhite] = useState(false);
  const [whiteColor, setWhiteColor] = useState(new Color(255,255,255,255));
  const [parameter, setParameter] = useState(null);
  const [isPicking, setIsPicking] = useState(false);
  const [paramName, setParamName] = useState(useParams().parameterName || "");


  useEffect(() => {
    const localStorageParameters = localStorage.getItem("parameters");
    if (!localStorageParameters) {
      localStorage.setItem("parameters", JSON.stringify([]));
    }
    const parameters = Parameter.loadParametersFromJSON(JSON.parse(localStorage.getItem("parameters")));
    console.log(parameters)
    const newParameter = parameters.find(p => p.name === paramName);
    console.log(newParameter)
    if (newParameter) {
      setParameter(newParameter);
    }
    else {
      setParameter(new Parameter(paramName, new Color(255, 255, 255, 255), []));
    }

    

  }, []);
  
  
  const changeValue = (value, newValue) => {
    parameter.setValue(value.color, newValue);
  }
  const deleteValue = (value) => {
    parameter.deleteValue(value.color);
    setCount(count + 1);
  }

  const handleClick = (color) => {
    if (!isPicking && !isPickingWhite) return;

    setIsPicking(false);
    if (isPickingWhite) {
      setWhiteColor(color.toString());
      setIsPickingWhite(false);
      parameter.setWhite(color);
      
      return;
    }
    parameter.addValue(color, 0)
    console.log(parameter.getValues())

    console.log(color)
  }

  const saveParameter = () => {
    const parameters = JSON.parse(localStorage.getItem("parameters"));
    if (parameters) {
      if (parameters.find(p => p.name === parameter.name)) {
        if (!confirm(`A parameter with thes name '${parameter.name}' already exists, do you want to overwrite it?`)) {
          return;
        };
        const index = parameters.findIndex(p => p.name === parameter.name);
        parameters[index] = parameter;
        localStorage.setItem("parameters", JSON.stringify(parameters));
        return;
      }
      parameters.push(parameter);
      localStorage.setItem("parameters", JSON.stringify(parameters));
    } else {
      localStorage.setItem("parameters", JSON.stringify([parameter]));
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
  return (
    <>
    { parameter !== null ? (
      <>
      <h1>Click on the image to get the mean rgb value of the area clicked</h1>
      <ColorPicker onClick={handleClick} isPicking={ isPicking || isPickingWhite}
        />
      <input type="text" value={parameter.name} onChange={(e) => setParameter(new Parameter(e.target.value, parameter.white, parameter.values))} />
      <button 
      onClick={setIsPickingWhite}>
        {
          isPickingWhite ? "Picking" : "Pick white color"
        }
      </button>
      <span style={{ backgroundColor: whiteColor.toString(), padding: "10px 15px", marginLeft: "10px", border: "1px solid black" }}></span>
      <button onClick={() => setIsPicking(true)} > {isPicking ? "Picking" : "Pick color"}</button>
      <button onClick={saveParameter}>Save</button>
      <button onClick={() => setParameter(new Parameter(parameter.name, parameter.white, []))}>New</button>
      <button onClick={deleteParameter}>Delete</button>

      {parameter.getValues(true).map((value, index) => {
        return <Value
          value={value}
          key={index}
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
