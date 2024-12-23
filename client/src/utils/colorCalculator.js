export const resizeImageToCanvas = (img, canvas, zoom = 1) => {
    const context = canvas.getContext('2d');
    const imageAspectRatio = img.width / img.height;
    const canvasAspectRatio = canvas.width / canvas.height;
    
    let renderableHeight, renderableWidth, xStart, yStart;
    
    if (imageAspectRatio < canvasAspectRatio) {
      renderableHeight = canvas.height;
      renderableWidth = img.width * (renderableHeight / img.height);
      xStart = (canvas.width - renderableWidth) / 2;
      yStart = 0;
    } else if (imageAspectRatio > canvasAspectRatio) {
      renderableWidth = canvas.width;
      renderableHeight = img.height * (renderableWidth / img.width);
      xStart = 0;
      yStart = (canvas.height - renderableHeight) / 2;
    } else {
      renderableHeight = canvas.height;
      renderableWidth = canvas.width;
      xStart = 0;
      yStart = 0;
    }
  
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(zoom, zoom);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
  };
  
  
  export const calculateMeanColor = (context, x, y, size) => {
    try {
      const imageData = context.getImageData(x, y, size, size);
      const data = imageData.data;
      let r = 0, g = 0, b = 0;
      const total = data.length / 4;  // cada pixel tiene 4 valores (r,g,b,a)
      
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      
      return {
        r: Math.floor(r / total),
        g: Math.floor(g / total),
        b: Math.floor(b / total)
      };
    } catch (error) {
      console.error('Error calculando el color medio:', error);
      return { r: 0, g: 0, b: 0 };
    }
  };
  
  export const getClickedSquareCoordinates = (e, canvas, zoom, cellSize = 10) => {
    const originalImageWidth = canvas.width;
    const originalImageHeight = canvas.height;
    const canvasWidth = canvas.getBoundingClientRect().width;
    const canvasHeight = canvas.getBoundingClientRect().height;
  
    const offsetX = (originalImageWidth / canvasWidth);
    const offsetY = (originalImageHeight / canvasHeight);
    
    const mouseX = e.nativeEvent.offsetX * offsetX;
    const mouseY = e.nativeEvent.offsetY * offsetY;
    
    const mouseZoomX = e.nativeEvent.offsetX * offsetX / zoom;
    const mouseZoomY = e.nativeEvent.offsetY * offsetY / zoom;
  
    return {
      original: {
        x: Math.floor(mouseX / cellSize),
        y: Math.floor(mouseY / cellSize)
      },
      zoomed: {
        x: Math.floor(mouseZoomX / cellSize),
        y: Math.floor(mouseZoomY / cellSize)
      }
    };
  };
  // imageUtils.js


  
  export const drawSelectionSquare = (context, x, y, size, color) => {
    // Dibuja el cuadrado con el color promedio
    context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    context.fillRect(x, y, size, size);
    
    // Dibuja el borde del cuadrado
    context.strokeStyle = 'black';
    context.strokeRect(x, y, size, size);
  };