import  { useState, useEffect, useCallback } from 'react';

import './TextWithInfo.scss';
const InfoIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    width="20" 
    height="20" 
    stroke="currentColor" 
    fill="none" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const TextWithInfo = ({ text, children, autoCloseTime = 3000 }) => {
  const [showPopup, setShowPopup] = useState(false);
  
  const handleClose = useCallback(() => {
    setShowPopup(false);
  }, []);
  
  useEffect(() => {
    let timeoutId;
    if (showPopup && autoCloseTime) {
      timeoutId = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showPopup, autoCloseTime, handleClose]);

  return (
    <div className="text-with-info">
      <span className="text-with-info__text">{text}</span>
      <button 
        className="text-with-info__icon"
        onClick={() => setShowPopup(true)}
        aria-label="Mostrar información adicional"
      >
        <InfoIcon />
      </button>
      
      {showPopup && (
        <div className="text-with-info__popup-overlay" onClick={handleClose}>
          <div 
            className="text-with-info__popup"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
            <button 
              className="text-with-info__close"
              onClick={handleClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextWithInfo;