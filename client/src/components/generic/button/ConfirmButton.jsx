import { useState } from "react";
import Modal from "..//modal/Modal";

import './ConfirmButton.scss';
function ConfirmButton({ text,children, onConfirm }) {
    const [isOpen, setIsOpen] = useState(false);
    function handleConfirm() {
        setIsOpen(false);
        onConfirm();
    }
    return (
        <>
            <button className="confirm-button" onClick={() => setIsOpen(true)}>{text}</button>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onOpen={() => setIsOpen(true)}
                size="auto"
            >
                <div className="confirm-modal">
                    <p>{children}</p>
                    <div className="confirm-modal__buttons">
                        <button className="confirm-modal__buttons--confirm" onClick={handleConfirm}>Confirmar</button>
                        <button className="confirm-modal__buttons--cancel"onClick={() => setIsOpen(false)}>Cancelar</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default ConfirmButton;