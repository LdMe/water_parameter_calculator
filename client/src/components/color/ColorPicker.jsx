import { useRef, useEffect } from 'react';
import { FaCamera, FaImage } from 'react-icons/fa6';
import { useCanvasImage } from '../../hooks/useCanvasImage';

import './ColorPicker.scss';

function ColorPicker({ onClick, isPicking = false }) {
  const canvas = useRef(null);
  const fileInput = useRef(null);
  
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
    }
  };

  return (
    <div className="color-picker">
      <label htmlFor="imageInput">
        <span>selecciona una imagen</span> <FaCamera className="icon big" />
      </label>
      
      <input 
        style={{ display: "none" }}
        ref={fileInput}
        id="imageInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <section className="canvas-section">
        <canvas
          ref={canvas}
          onClick={(e) => handleImageClick(e, isPicking, onClick)}
        />
      </section>
    </div>
  );
}

export default ColorPicker;