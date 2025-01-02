import {useState} from 'react';

import './Modal.scss'
function Modal({children,trigger,isOpen,onClose,onOpen}) {
    const [showModal, setShowModal] = useState(isOpen);
    function handleBackgroundClick(e) {
        if (e.target === e.currentTarget) {
            setShowModal(false);
        }
    }
    function handleTogggleModal(isOpen= true) {
        if (isOpen) {
            setShowModal(true);
            onOpen && onOpen();
        } else {
            setShowModal(false);
            onClose && onClose();
        }
    }
    return (
        <div>
            <div className="modal__trigger"  onClick={() => handleTogggleModal(true)}>
            {trigger || <button>Open Modal</button>}
            </div>
            {showModal && <div className="modal"  onClick={handleBackgroundClick}>
                <div className="modal__content" >
                    {children}
                    <button onClick={() => handleTogggleModal(false)}>Close</button>
                </div>
            </div>}
        </div>
    )
}

export default Modal