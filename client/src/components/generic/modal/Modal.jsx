import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.scss'
function Modal({ children, trigger, isOpen, onClose, onOpen, size="lg" }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    },[isOpen])
    function handleBackgroundClick(e) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }
    function handleTogggleModal(isOpen = true) {
        if (isOpen) {
            onOpen && onOpen();
        } else {
            onClose && onClose();
        }
    }
    return (
        <div className="modal-container">
            <div className="modal-trigger" onClick={() => handleTogggleModal(true)}>
                {trigger}
            </div>
            {isOpen && createPortal(
                (<div className="modal" onClick={handleBackgroundClick} >
                    <div className={"modal-body "+size}>
                        <div className="modal-content" >
                            {children}
                        </div>
                    </div>
                </div>),
                document.body
            )}
        </div>
    )
}

export default Modal