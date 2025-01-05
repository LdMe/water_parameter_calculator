

import './Modal.scss'
function Modal({ children, trigger, isOpen, onClose, onOpen }) {
    
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
                {trigger || <button>Open Modal</button>}
            </div>
            {isOpen && <div className="modal" onClick={handleBackgroundClick} >
                <div className="modal-body">
                    <div className="modal-content" >
                        {children}
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default Modal