import { useState, useRef, useEffect } from 'react'
import Color from './color';
/* 
* ColorCalculator that takes a picture and displays it on the screen, then it shows the mean rgb value of the area clicked
*
*/


function ColorCalculator({onClick, isPicking=false}) {

   
    const canvas = useRef(null);
    const imageRef = useRef(null);


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
   
    const handleClick = (e) => {
        if (!isPicking) return;
        const cellSize = 10;
        const mouseX = e.nativeEvent.offsetX;
        const mouseY = e.nativeEvent.offsetY;
        const squareX = Math.floor(mouseX / cellSize);
        const squareY = Math.floor(mouseY / cellSize);

        const context = canvas.current.getContext('2d');
        resizeImageAndDraw(imageRef.current);
        const imgData = context.getImageData(squareX * cellSize, squareY * cellSize, cellSize, cellSize);
        const rgb = getMeanColor(imgData)
        resizeImageAndDraw(imageRef.current);
        context.fillStyle = rgb.toString();
        context.fillRect(squareX * cellSize, squareY * cellSize, cellSize, cellSize);
        context.strokeStyle = 'black';
        context.strokeRect(squareX * cellSize, squareY * cellSize, cellSize, cellSize);
        onClick(rgb);
    }

    


    return (
        <>
            
            <div className="ColorCalculator">
                <canvas ref={canvas} id="canvas" width="500" height="500" onClick={handleClick}> </canvas>
                <label htmlFor="imageInput">
                    image
                </label>
                <input id="imageInput" type="file" accept="image/*" onChange={handleImageUpload} />

            </div>

        </>
    )
}

export default ColorCalculator
