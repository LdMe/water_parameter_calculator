// useCanvasImage.js
import { useState, useCallback } from 'react';
import { resizeImageToCanvas, calculateMeanColor, drawSelectionSquare } from '../utils/colorCalculator';
import Color from '../utils/classes/color';


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

  // const handleImageClick = useCallback((e, isPicking = false, onColorPicked = () => {}) => {
  //   if (!isPicking || !imageSet || !canvasRef.current || !currentImage) return;

  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext('2d');
  //   const rect = canvas.getBoundingClientRect();
    
  //   // Calcula las coordenadas reales en el canvas
  //   const scaleX = canvas.width / rect.width;
  //   const scaleY = canvas.height / rect.height;
    
  //   const CELL_SIZE = 10;  // Tamaño del cuadrado de selección
    
  //   // Obtiene las coordenadas ajustadas a la escala
  //   const x = Math.floor(((e.clientX - rect.left) * scaleX) / CELL_SIZE) * CELL_SIZE;
  //   const y = Math.floor(((e.clientY - rect.top) * scaleY) / CELL_SIZE) * CELL_SIZE;

  //   // Redibujar la imagen original para limpiar selecciones anteriores
  //   resizeImageToCanvas(currentImage, canvas, 1);

  //   // Calcula el color promedio del área seleccionada
  //   const meanColor = calculateMeanColor(context, x, y, CELL_SIZE);
    
  //   // Dibuja el cuadrado de selección
  //   drawSelectionSquare(context, x, y, CELL_SIZE, meanColor);

  //   // Notifica del color seleccionado
  //   onColorPicked(new Color(meanColor.r, meanColor.g, meanColor.b));
  // }, [imageSet, currentImage]);
  const handleImageClick = useCallback((e, isPicking = false, onColorPicked = () => {}) => {
    if (!isPicking || !imageSet || !canvasRef.current || !currentImage) return;
  
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    resizeImageToCanvas(currentImage, canvas, 1);
    // Calculamos las coordenadas exactas en el canvas teniendo en cuenta la escala
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Obtenemos el punto central exacto del clic, usando round para evitar decimales
    const centerX = Math.round((e.clientX - rect.left) * scaleX);
    const centerY = Math.round((e.clientY - rect.top) * scaleY);
    
    // Definimos un área más pequeña (3x3) centrada en el punto de clic
    const SAMPLE_SIZE = 3;
    const offset = Math.floor(SAMPLE_SIZE / 2);
    
    // Obtenemos los datos de la imagen para el área seleccionada
    const imageData = context.getImageData(
      centerX - offset,
      centerY - offset,
      SAMPLE_SIZE,
      SAMPLE_SIZE
    );
    const data = imageData.data;
    
    // Calculamos el promedio ponderado, dando más peso al píxel central
    let totalR = 0, totalG = 0, totalB = 0;
    let totalWeight = 0;
    
    for (let y = 0; y < SAMPLE_SIZE; y++) {
      for (let x = 0; x < SAMPLE_SIZE; x++) {
        const i = (y * SAMPLE_SIZE + x) * 4;
        // El píxel central tiene peso 4, los adyacentes peso 1
        const weight = (x === offset && y === offset) ? 4 : 1;
        
        totalR += data[i] * weight;
        totalG += data[i + 1] * weight;
        totalB += data[i + 2] * weight;
        totalWeight += weight;
      }
    }
    
    const finalColor = {
      r: Math.round(totalR / totalWeight),
      g: Math.round(totalG / totalWeight),
      b: Math.round(totalB / totalWeight)
    };
  
    
    // Dibujamos un indicador más preciso de la selección
    drawSelectionIndicator(context, centerX, centerY, finalColor);
    
    // Notificamos del color seleccionado
    onColorPicked(new Color(finalColor.r, finalColor.g, finalColor.b));
  }, [imageSet, currentImage]);
  
  // Función auxiliar para dibujar un indicador visual mejorado
  const drawSelectionIndicator = (context, x, y, color) => {
    const indicatorSize = 7;
    
    // Círculo exterior blanco para contraste
    context.beginPath();
    context.arc(x, y, indicatorSize, 0, Math.PI * 2);
    context.strokeStyle = 'white';
    context.lineWidth = 3;
    context.stroke();
    
    // Círculo interior con el color seleccionado
    context.beginPath();
    context.arc(x, y, indicatorSize - 2, 0, Math.PI * 2);
    context.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    context.lineWidth = 2;
    context.stroke();
    
    // Líneas de referencia para mejor precisión
    context.beginPath();
    context.moveTo(x - indicatorSize * 2, y);
    context.lineTo(x + indicatorSize * 2, y);
    context.moveTo(x, y - indicatorSize * 2);
    context.lineTo(x, y + indicatorSize * 2);
    context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    context.lineWidth = 1;
    context.stroke();
  };

  return {
    imageSet,
    handleImageLoad,
    handleImageClick
  };
};