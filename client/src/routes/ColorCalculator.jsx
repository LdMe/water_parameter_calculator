import { useState, useRef, useEffect } from 'react'
import Parameter from '../parameter';
import Color from '../color';
import ColorPicker from '../ColorPicker';
import Value from '../Value';
import { API_URL } from '../config';
/* 
* ColorCalculator that takes a picture and displays it on the screen, then it shows the mean rgb value of the area clicked
*
*/


function ColorCalculator() {

    const [count, setCount] = useState(0)
    const [isPickingWhite, setIsPickingWhite] = useState(false);
    const [whiteColor, setWhiteColor] = useState(new Color(255, 255, 255));
    const [parameters, setParameters] = useState([]);
    const [selectedParameter, setSelectedParameter] = useState(null);
    const [testParameter, setTestParameter] = useState(new Parameter("nitrate", new Color(255, 255, 255)));
    const [pickedColor, setPickedColor] = useState(new Color(0,0,0,0));
    const [value, setValue] = useState(0);
    const canvas = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        loadParameters();
    }, []);
    useEffect(() => {
        setSelectedParameter(parameters[0]);
    }, [parameters]);
    useEffect(() => {
        if (selectedParameter) {
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

    const loadParameters = async() => {
        /* load parameters from api */
        const newParameters = [];
        try{
            const response = await fetch(API_URL + "parameters",{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            console.log("response",response)
            const json = await response.json();
            console.log("json",json);
            json.forEach((parameter) => {
                console.log(parameter)
                const newParam  = new Parameter(parameter.name);
                newParam.addValues(parameter.values ? parameter.values : parameter.colors);
                newParameters.push(newParam);
            });
            setParameters(newParameters);
            return newParameters;
        }
        catch(err){
            console.log(err);
            setParameters([]);
            return [];
        }
    }



    return (
        <>
            <h1>Color value calculator</h1>
            <div className="ColorCalculator">
                <ColorPicker onClick={handleClick} isPicking={ true} />
                <label htmlFor="selectParameter">
                    parameter
                </label>
                <select  id="selectParameter" onChange={(e) => setSelectedParameter(parameters.find(p => p.name === e.target.value))}>
                    {parameters.map((parameter) => {
                        return <option key={parameter.name} value={parameter.name}>{parameter.name}</option>
                    })}
                </select>
                <button onClick={() => setIsPickingWhite(true)} >
                    {isPickingWhite ? "Picking" : "Pick white color"}
                </button>
                <span style={{ backgroundColor: whiteColor.toString(), padding: "10px 15px", marginLeft: "10px" }}></span>
                <span style={{ backgroundColor: pickedColor.toString(), padding: "10px 15px", marginLeft: "10px" }}></span>
                <div className="values">
                    <input type="number" value={value} onChange={(e) => setValue(e.target.value)}/>
                    </div>
            </div>

        </>
    )
}

export default ColorCalculator
