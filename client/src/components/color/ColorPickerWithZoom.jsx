import React, { useRef, useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa6';
import { useCanvasImage } from '../../hooks/useCanvasImage';
import TextWithInfo from '../generic/text/TextWithInfo';
import './ColorPickerWithZoom.scss';

function ColorPickerWithZoom({ onClick, isPicking = false }) {
  const canvas = useRef(null);
  const fileInput = useRef(null);
  const [mousePosition, setMousePosition] = useState(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  
  const {
    imageSet,
    handleImageLoad,
    handleImageClick
  } = useCanvasImage(canvas);

  useEffect(() => {
    if (canvas.current) {
      canvas.current.width = 500;
      canvas.current.height = 500;
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageLoad(file);
      setMousePosition(null);
    }
  };

  // Función auxiliar para obtener las coordenadas correctas
  const getCanvasCoordinates = (e) => {
    const rect = canvas.current.getBoundingClientRect();
    const scaleX = canvas.current.width / rect.width;
    const scaleY = canvas.current.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      displayX: e.clientX - rect.left,
      displayY: e.clientY - rect.top,
      scale: { x: scaleX, y: scaleY }
    };
  };

  const handleCanvasClick = (e) => {
    if (!isPicking) return;
    
    const coords = getCanvasCoordinates(e);
    setMousePosition({ 
      x: coords.displayX, 
      y: coords.displayY,
      realX: coords.x,
      realY: coords.y 
    });
    
    handleImageClick(e, isPicking, onClick);
  };

  const handleMouseMove = (e) => {
    if (!isPicking || !imageSet || !canvas.current) return;

    const coords = getCanvasCoordinates(e);
    const rect = canvas.current.getBoundingClientRect();

    // Verificamos si el ratón está dentro del canvas
    if (coords.displayX >= 0 && coords.displayX <= rect.width && 
        coords.displayY >= 0 && coords.displayY <= rect.height) {
      setShowMagnifier(true);
      setMousePosition({
        x: coords.displayX,
        y: coords.displayY,
        realX: coords.x,
        realY: coords.y,
        scale: coords.scale
      });
    } else {
      setShowMagnifier(false);
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const getMagnifierStyle = () => {
    if (!mousePosition || !canvas.current) return {};

    const magnificationFactor = 2;
    const magnifierSize = 120;
    
    // Calculamos la posición del fondo basándonos en las coordenadas reales
    const backgroundX = -(mousePosition.realX * magnificationFactor - magnifierSize/2);
    const backgroundY = -(mousePosition.realY * magnificationFactor - magnifierSize/2);

    // Posicionamos la lupa relativa a la posición del ratón
    let lupaX = mousePosition.x + 20;
    let lupaY = mousePosition.y - magnifierSize - 10;

    // Ajustamos la posición si se sale de los bordes
    const rect = canvas.current.getBoundingClientRect();
    if (lupaX + magnifierSize > rect.width) {
      lupaX = mousePosition.x - magnifierSize - 20;
    }
    if (lupaY < 0) {
      lupaY = mousePosition.y + 20;
    }

    return {
      left: lupaX,
      top: lupaY,
      backgroundImage: `url(${canvas.current.toDataURL()})`,
      backgroundPosition: `${backgroundX}px ${backgroundY}px`,
      backgroundSize: `${canvas.current.width * magnificationFactor}px ${canvas.current.height * magnificationFactor}px`,
    };
  };

  return (
    <div className="color-picker">
      <header className="color-picker__header">
        <TextWithInfo
          text="Selecciona una imagen"
          autoCloseTime={null}
        >
          <div className="color-picker__help">
            <p>Mueve el cursor sobre la imagen para usar la lupa y seleccionar el color con más precisión.</p>
            <ol>
              <li>Toma una foto clara y bien iluminada</li>
              <li>Usa la lupa para encontrar el punto exacto</li>
              <li>Haz clic para seleccionar el color</li>
            </ol>
          </div>
        </TextWithInfo>

        <label htmlFor="imageInput" className="image-input-label">
          <FaCamera className="icon big" />
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInput}
          />
        </label>
      </header>

      <section className="canvas-section">
        <div className="canvas-container">
          <canvas
            ref={canvas}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
          
          {showMagnifier && (
            <div 
              className="magnifier"
              style={getMagnifierStyle()}
            >
              <div className="magnifier__crosshair"/>
            </div>
          )}
          
          {mousePosition && isPicking && (
            <div 
              className="selection-indicator"
              style={{
                left: `${mousePosition.x - 5}px`,
                top: `${mousePosition.y - 5}px`
              }}
            />
          )}
        </div>
        
        {!imageSet && (
          <div className="empty-state">
            <p>Selecciona una imagen para comenzar</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default ColorPickerWithZoom;