// useCanvasImage.js
import { useState, useCallback } from 'react';
import { resizeImageToCanvas, calculateMeanColor, drawSelectionSquare } from '../utils/colorCalculator';
import Color from '../utils/color';


export const useCanvasImage = (canvasRef, initialZoom = 1) => {
  const [imageSet, setImageSet] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const handleImageLoad = useCallback((file) => {
    if (!canvasRef.current) {
      console.error('Canvas no disponible');
      return;
    }

    const img = new Image();

    img.onload = () => {
      if (!canvasRef.current) return;
      
      try {
        resizeImageToCanvas(img, canvasRef.current, 1);
        setCurrentImage(img);
        setImageSet(true);
      } catch (err) {
        console.error('Error dibujando:', err);
      }
    };

    const url = URL.createObjectURL(file);
    img.src = url;
  }, [canvasRef]);

  const handleImageClick = useCallback((e, isPicking = false, onColorPicked = () => {}) => {
    if (!isPicking || !imageSet || !canvasRef.current || !currentImage) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Calcula las coordenadas reales en el canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const CELL_SIZE = 10;  // Tamaño del cuadrado de selección
    
    // Obtiene las coordenadas ajustadas a la escala
    const x = Math.floor(((e.clientX - rect.left) * scaleX) / CELL_SIZE) * CELL_SIZE;
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / CELL_SIZE) * CELL_SIZE;

    // Redibujar la imagen original para limpiar selecciones anteriores
    resizeImageToCanvas(currentImage, canvas, 1);

    // Calcula el color promedio del área seleccionada
    const meanColor = calculateMeanColor(context, x, y, CELL_SIZE);
    
    // Dibuja el cuadrado de selección
    drawSelectionSquare(context, x, y, CELL_SIZE, meanColor);

    // Notifica del color seleccionado
    onColorPicked(new Color(meanColor.r, meanColor.g, meanColor.b));
  }, [imageSet, currentImage]);

  return {
    imageSet,
    handleImageLoad,
    handleImageClick
  };
};