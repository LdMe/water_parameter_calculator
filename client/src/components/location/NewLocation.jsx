import { useState } from "react";
import Modal from "../generic/modal/Modal";
import { FaPlus } from "react-icons/fa6";
import { createLocation } from "../../utils/fetchLocation";


function NewLocation({ onCreate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");

    async function handleCreateLocation() {
        await createLocation(name);
        setIsOpen(false);
        onCreate(name);
        setName("");
    }
    return (
        <Modal
            trigger={<button className="modal__button"><FaPlus />Nueva ubicación</button>}
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            isOpen={isOpen}
        >
            <div className="new-location">
                <h2>Crear nueva ubicación</h2>
                <input
                    type="text"
                    placeholder="Nombre de la ubicación"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <section className="new-location__buttons">
                    <button className="cancel-button" onClick={() => setIsOpen(false)}>Cancelar</button>
                    <button onClick={handleCreateLocation}>Crear</button>
                </section>
            </div>
        </Modal>
    )
}

export default NewLocation