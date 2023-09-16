import { useState, useRef, useEffect } from 'react'
import Parameter from '../parameter';
import Color from '../color';
import ColorPicker from '../ColorPicker';
import Value from '../Value';
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
        setParameters(loadParameters());
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
        console.log("rfsdfd")
        console.log(rgb)
        if (isPickingWhite) {
            setWhiteColor(rgb);
            setIsPickingWhite(false);
            return;
        }
        selectedParameter.setWhite(whiteColor);

        setPickedColor(selectedParameter.correctWhite(rgb));
        console.log("rgb: ", rgb)
        const calculatedValue = selectedParameter.calculateValue(rgb);


        console.log("calculatedValue: ", calculatedValue)
        setValue(calculatedValue);
    }

    const loadParameters = () => {
        console.log("loading parameters")
        let parameters = JSON.parse(localStorage.getItem("parameters"));
        parameters = parameters.map((parameter) => {
            console.log("parameter: ", parameter)
            const newParameter = new Parameter(parameter.name, new Color(parameter.white.r, parameter.white.g, parameter.white.b));

            newParameter.addValues(parameter.values, false);

            return newParameter;
        })
        console.log("parameters: ")
        console.log(parameters)
        return parameters;
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
                    {value}
                    </div>
            </div>

        </>
    )
}

export default ColorCalculator
