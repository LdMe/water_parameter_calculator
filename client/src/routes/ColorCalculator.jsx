import { useState, useRef, useEffect, useContext } from 'react'
import Parameter from '../parameter';
import Color from '../color';
import ColorPicker from '../ColorPicker';
import { useNavigate } from 'react-router-dom';
import locationsContext from '../context/locationsContext';
import parametersContext from '../context/parametersContext';
import ColorPickShow from '../components/colorPickShow';
import ColorGradient from '../components/ColorGradient';
import HorizontalSelector from '../components/HorizontalSelector';
import { getParameters } from '../utils/fetchParameter';
import { getLocations } from '../utils/fetchLocation';
import { createMeasurement } from '../utils/fetchMeasurement';

import '../styles/ColorCalculator.scss'
import { FaFloppyDisk } from 'react-icons/fa6';

function ColorCalculator() {

    const [isPickingWhite, setIsPickingWhite] = useState(false);
    const [whiteColor, setWhiteColor] = useState(new Color(255, 255, 255));
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [pickedColor, setPickedColor] = useState(new Color(0, 0, 0, 0));
    const [selectedColors, setSelectedColors] = useState(null);
    const [value, setValue] = useState(0);
    const {locations, setLocations} = useContext(locationsContext);
    const parametersCtx = useContext(parametersContext);
    const [selectedParameter, setSelectedParameter] = useState(parametersCtx.parameters[0]);
    const navigate = useNavigate();

    
    useEffect(() => {
        setSelectedParameter(parametersCtx.parameters[0]);

    }, [parametersCtx.parameters]);
    useEffect(() => {
        setSelectedLocation(locations[0]);
    }, [locations]);
    useEffect(() => {
        if (selectedParameter) {
            console.log("selectedParameter", selectedParameter)
            if (selectedParameter.values) {
                console.log(selectedParameter.values);
                setSelectedColors(selectedParameter.values);
            }
            else if(selectedParameter.colors) {
                console.log(selectedParameter.colors);
                setSelectedColors(selectedParameter.colors);
            }
        }
    }, [selectedParameter]);

    const checkAuth = (code) => {
        if (code === 401) {
            navigate('/login');
        }
    }
    
    const handleClick = (rgb) => {
        if (isPickingWhite) {
            setWhiteColor(rgb);
            setIsPickingWhite(false);
            return;
        }
        console.log(selectedParameter);
        selectedParameter.setWhite(whiteColor);
        setPickedColor(selectedParameter.correctWhite(rgb));
        const calculatedValue = selectedParameter.calculateValue(rgb);
        setValue(Math.round(calculatedValue * 1000 + Number.EPSILON) / 1000);
    }

    const handleSave = async (e) => {
        const color = selectedParameter && selectedParameter.isColor ? pickedColor : null;
        const response = await createMeasurement(value, selectedParameter.name, selectedLocation.name, pickedColor);
        const { data, error, code } = response;
        if (error !== null) {
            console.log("error", error)
            checkAuth(code);
        }
        else {
            alert("Value added");
        }
    }

    const loadParameters = async () => {
        /* load parameters from api */
        const response = await getParameters();
        const { data, error, code } = response;
        if (error !== null) {
            console.log("error", error)
            checkAuth(code);
        }
        else {
            const newParameters = Parameter.loadParametersFromJSON(data);
            console.log("newParameters", newParameters)
            parametersCtx.setParameters(newParameters);
            return newParameters;
        }
    }

    const loadLocations = async () => {
        /* load locations from api */
        const response = await getLocations();
        const { data, error, code } = response;
        console.log("respuestaaa", response)
        if (error !== null) {
            console.log("error", error)
            checkAuth(code);
            setLocations([]);
            return [];
        }
        else {
            console.log("data", data)
            setLocations(data);
            return data;
        }

    }
    const handleColorChange = (e) => {
        console.log(e.target.value);
        const color = Color.fromHex(e.target.value);
        setPickedColor(color);
        console.log("color",color)
        const calculatedValue = selectedParameter.calculateValue(color,false);
        console.log("calculatedValue",calculatedValue)
        console.log("Math.round(calculatedValue * 1000 + Number.EPSILON) / 1000",Math.round(calculatedValue * 1000 + Number.EPSILON) / 1000)
        setValue(Math.round(calculatedValue * 1000 + Number.EPSILON) / 1000);
    }

    return (
        <>
            <h2>Color value calculator</h2>
            <div className="ColorCalculator">
                <section className="selectors">
                    <h4>Location</h4>
                    {selectedLocation &&
                        <HorizontalSelector
                            values={locations.map(p => p.name)}
                            selectedValue={selectedLocation.name}
                            onClick={(value) => setSelectedLocation(locations.find(p => p.name === value))}
                            colorScale='grey'
                        />
                    }
                    <h4>Parameter</h4>
                    {selectedParameter &&
                        <HorizontalSelector
                            values={parametersCtx.parameters.map(p => p.name)}
                            selectedValue={selectedParameter.name}
                            onClick={(value) => setSelectedParameter(parametersCtx.parameters.find(p => p.name === value))}
                        />
                    }

                </section>
                {selectedParameter && selectedParameter.isColor &&
                    <section className="colorPicker">
                        <ColorPicker onClick={handleClick} isPicking={true} />
                        <ColorPickShow
                            isPickingWhite={isPickingWhite}
                            setIsPickingWhite={setIsPickingWhite}
                            whiteColor={whiteColor}
                            pickedColor={pickedColor}
                        />
                        {selectedColors &&
                            <ColorGradient colors={selectedColors} />
                        }
                    </section>
                }
                <div className="values">
                    <input type="color" value={pickedColor.toHex()} onChange={handleColorChange}/>
                    <input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
                    <FaFloppyDisk className="icon" onClick={handleSave} />
                </div>
            </div>

        </>
    )
}

export default ColorCalculator
