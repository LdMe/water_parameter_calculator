import { createPortal } from 'react-dom';
import { useEffect ,useState} from 'react';

import './PopUp.scss'

function PopUp({className="",onClose, children, autoCloseTime = 5000}) {
    const [showPopup, setShowPopup] = useState(true);
    useEffect(() => {
        let timeoutId;
        if (showPopup && autoCloseTime) {
          timeoutId = setTimeout(() => {
            onClose();
          }, autoCloseTime);
        }
        return () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        };
      }, [showPopup, autoCloseTime, onClose]);
      function handleClose(){
        setShowPopup(false);
        onClose();
    }
    return (
        showPopup && createPortal(
            (
                <div className="popup-overlay" onClick={handleClose}>
                    <div
                        className={"popup " + className}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}
                        <button
                            className="popup__close"
                            onClick={handleClose}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            ),
            document.body
        )
    )
}

export default PopUp