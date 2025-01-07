import { useState } from "react";
import Modal from "../generic/modal/Modal";
import MeasurementCreator from "./MeasurementCreator";
import { FaPlus } from "react-icons/fa6";

function NewMeasurementModal({ location, onSave, onCancel }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    function handleSaveMeasurement() {
        setIsModalOpen(false);
        onSave();
    }
    function handleCancel() {
        setIsModalOpen(false);
        console.log("closing modal");
    }
    return (
        <Modal
            trigger={<button className="modal__button"><FaPlus />Nueva medición</button>}
            onClose={() => setIsModalOpen(false)}
            onOpen={() => setIsModalOpen(true)}
            isOpen={isModalOpen}
        >
            <MeasurementCreator
                location={location}
                onSave={handleSaveMeasurement}
                onCancel={handleCancel}
            />
        </Modal>
    );
}

export default NewMeasurementModal