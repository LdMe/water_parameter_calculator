import { useState, useRef, useEffect } from 'react'
import Color from './color';
import './styles/ColorPicker.scss';
import { FaImage } from 'react-icons/fa6';
/* 
* ColorCalculator that takes a picture and displays it on the screen, then it shows the mean rgb value of the area clicked
*
*/


function ColorCalculator({ onClick, isPicking = false }) {

    const [imageSet, setImageSet] = useState(false);
    const canvas = useRef(null);
    const imageRef = useRef(null);
    const [zoom,setZoom] = useState(1);
    const uploadFile = useRef(null);


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
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(zoom,zoom);
        context.clearRect(0, 0, canvas.current.width, canvas.current.height);
        context.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
    }
    const handleImageUpload = (e) => {
        const img = new Image();

        img.onload = () => {
            /* resize the image to fit the canvas */
            resizeImageAndDraw(img)

        }
        const file = uploadFile.current.files[0];
        img.src = URL.createObjectURL(file);
        imageRef.current = img;
        setImageSet(true);
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

    const handleClick = (e) => {
        if (!isPicking) return;
        const cellSize = 10;
        const originalImageWidth = canvas.current.width;
        const originalImageHeight = canvas.current.height;
        const canvasWidth = canvas.current.getBoundingClientRect().width;
        const canvasHeight = canvas.current.getBoundingClientRect().height;

        const offsetX = (originalImageWidth / canvasWidth) ;
        const offsetY = (originalImageHeight / canvasHeight) ;
        const mouseX = e.nativeEvent.offsetX * offsetX;
        const mouseY = e.nativeEvent.offsetY * offsetY;
        const mouseZoomX = e.nativeEvent.offsetX * offsetX / zoom;
        const mouseZoomY = e.nativeEvent.offsetY * offsetY / zoom;

        const squareX = Math.floor(mouseX / cellSize);
        const squareY = Math.floor(mouseY / cellSize);
        const squareZoomX = Math.floor(mouseZoomX / cellSize);
        const squareZoomY = Math.floor(mouseZoomY / cellSize);

        const context = canvas.current.getContext('2d');
        resizeImageAndDraw(imageRef.current);
        const imgData = context.getImageData(squareX * cellSize, squareY * cellSize, cellSize, cellSize);
        const rgb = getMeanColor(imgData)
        resizeImageAndDraw(imageRef.current);
        context.fillStyle = rgb.toString();
        context.fillRect(squareZoomX * cellSize, squareZoomY * cellSize, cellSize, cellSize);
        context.strokeStyle = 'black';
        context.strokeRect(squareZoomX * cellSize, squareZoomY * cellSize, cellSize, cellSize);
        onClick(rgb);
    }

    const handleZoomIn = () => {
    }


    return (
        <>

            <div className="ColorCalculator">
                <label htmlFor="imageInput">
                    <FaImage className="icon big" > </FaImage>
                </label>
                <input style={{display: "none"}} ref={uploadFile} id="imageInput" type="file" accept="image/*" onChange={handleImageUpload} />
                {imageSet &&
                    <section className="canvas-section">
                        <canvas ref={canvas} id="canvas" width="500" height="500" onClick={handleClick}> </canvas>
                    </section>
                }

            </div>

        </>
    )
}

export default ColorCalculator
