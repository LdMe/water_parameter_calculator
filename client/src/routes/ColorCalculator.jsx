import { useState, useRef, useEffect, useContext } from 'react'
import Parameter from '../parameter';
import Color from '../color';
import ColorPicker from '../ColorPicker';
import Value from '../components/Value';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import locationsContext from '../context/locationsContext';
import parametersContext from '../context/parametersContext';
import ColorPickShow from '../components/colorPickShow';

import '../styles/ColorCalculator.scss'

/* 
* ColorCalculator that takes a picture and displays it on the screen, then it shows the mean rgb value of the area clicked
*
*/


function ColorCalculator() {

    const [count, setCount] = useState(0)
    const [isPickingWhite, setIsPickingWhite] = useState(false);
    const [whiteColor, setWhiteColor] = useState(new Color(255, 255, 255));
    const [selectedParameter, setSelectedParameter] = useState(null);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [testParameter, setTestParameter] = useState(new Parameter("nitrate", new Color(255, 255, 255)));
    const [pickedColor, setPickedColor] = useState(new Color(0, 0, 0, 0));
    const [value, setValue] = useState(0);
    const canvas = useRef(null);
    const imageRef = useRef(null);
    const navigate = useNavigate();
    const locationsCtx = useContext(locationsContext);
    const parametersCtx = useContext(parametersContext);

    useEffect(() => {
        loadParameters();
        loadLocations();
    }, []);
    useEffect(() => {
        setSelectedParameter(parametersCtx.parameters[0]);

    }, [parametersCtx.parameters]);
    useEffect(() => {
        setSelectedLocation(locations[0]);
    }, [locations]);
    useEffect(() => {
        if (selectedParameter) {
            console.log("selectedParameter", selectedParameter)
            testParameter.name = selectedParameter.name;
        }
    }, [selectedParameter]);

    const resizeImageAndDraw = (img) => {
        const context = canvas.current.getContext('2d');
        const imageAspectRatio = img.width / img.height;
        const canvasAspectRatio = canvas.current.width / canvas.current.height;
        let renderableHeight, renderableWidth, xStart, yStart;
        if (imageAspectRatio < canvasAspectRatio) {
            renderableHeight = canvas.current.height;
            renderableWidth = img.width * (renderableHeight / img.height);
            xStart = (canvas.current.width - renderableWidth) / 2;
            yStart = 0;
        } else if (imageAspectRatio > canvasAspectRatio) {
            renderableWidth = canvas.current.width
            renderableHeight = img.height * (renderableWidth / img.width);
            xStart = 0;
            yStart = (canvas.current.height - renderableHeight) / 2;
        } else {
            renderableHeight = canvas.current.height;
            renderableWidth = canvas.current.width;
            xStart = 0;
            yStart = 0;
        }
        context.clearRect(0, 0, canvas.current.width, canvas.current.height);
        context.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
    }
    const handleImageUpload = (e) => {
        const context = canvas.current.getContext('2d');
        const img = new Image();

        img.onload = () => {
            /* resize the image to fit the canvas */
            resizeImageAndDraw(img)

        }
        img.src = URL.createObjectURL(e.target.files[0]);
        imageRef.current = img;
    }
    const getMeanColor = (imgData) => {
        const data = imgData.data;
        /* get the mean color of the area clicked */
        let r = 0;
        let g = 0;
        let b = 0;
        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
        }
        r = Math.floor(r / (data.length / 4));
        g = Math.floor(g / (data.length / 4));
        b = Math.floor(b / (data.length / 4));
        return new Color(r, g, b)
    }
    const changeValue = (value, newValue) => {
        testParameter.setValue(value.color, newValue);
    }
    const deleteValue = (value) => {
        testParameter.deleteValue(value.color);
        setCount(count + 1);
    }

    const handleClick = (rgb) => {
        if (isPickingWhite) {
            setWhiteColor(rgb);
            setIsPickingWhite(false);
            return;
        }
        selectedParameter.setWhite(whiteColor);
        setPickedColor(selectedParameter.correctWhite(rgb));
        const calculatedValue = selectedParameter.calculateValue(rgb);
        setValue(Math.round(calculatedValue * 1000 + Number.EPSILON) / 1000);
    }

    const handleSave = async (e) => {
        try {
            e.preventDefault();
            const data = {
                value: value,
                parameterName: selectedParameter.name,
                locationName: selectedLocation.name,
            };
            if (selectedParameter && selectedParameter.isColor) {
                data.color = pickedColor;
            }

            const response = await fetch(API_URL + "measurements/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data),
            });
            const json = await response.json();
            alert("Value added");
            console.log(json);
        }
        catch (err) {
            console.log(err);
        }
    }

    const loadParameters = async () => {
        /* load parameters from api */

        try {
            const response = await fetch(API_URL + "parameters", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            console.log("response", response)
            const json = await response.json();
            console.log("json", json);
            const newParameters = Parameter.loadParametersFromJSON(json);
            console.log("newParameters", newParameters);
            parametersCtx.setParameters(newParameters);
            return newParameters;
        }
        catch (err) {
            console.log(err);
            parametersCtx.setParameters([]);
            return [];
        }
    }

    const loadLocations = async () => {
        /* load locations from api */
        try {
            const response = await fetch(API_URL + "locations", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            const json = await response.json();

            setLocations(json);
        }
        catch (err) {
            console.log(err);
            setLocations([]);
            return [];
        }
    }



    return (
        <>
            <h1>Color value calculator</h1>
            <div className="ColorCalculator">
                <section className="selectors">

                    <section className="selectors__parameter">
                        <label htmlFor="selectParameter">
                            parameter
                        </label>
                        <select id="selectParameter" onChange={(e) => setSelectedParameter(parametersCtx.parameters.find(p => p.name === e.target.value))}>
                            {parametersCtx.parameters.map((parameter) => {
                                return <option key={parameter.name} value={parameter.name}>{parameter.name}</option>
                            })}
                        </select>
                    </section>
                    <section className="selectors__location">
                        <label htmlFor="selectLocation">
                            location
                        </label>
                        <select id="selectLocation" onChange={(e) => setSelectedLocation(locations.find(p => p.name === e.target.value))}>
                            {locations.map((location) => {
                                return <option key={location.name} value={location.name}>{location.name}</option>
                            })}
                        </select>
                    </section>
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
                    </section>
                }
                <div className="values">
                    <input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
                    <button onClick={handleSave}>Add</button>
                </div>
            </div>

        </>
    )
}

export default ColorCalculator
