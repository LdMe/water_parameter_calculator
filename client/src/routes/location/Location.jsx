import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import Measurements from "../../components/measurement/Measurement";
import Modal from "../../components/modal/Modal";
import LocationOptions from "../../components/location/LocationOptions";
import MeasurementCreator from "../../components/measurement/MeasurementCreator";
import { FaGear, FaPlus } from "react-icons/fa6";

function LocationComponent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const location = useLoaderData();
    const navigate = useNavigate();
    const { onUpdateLocation } = useOutletContext();

    async function handleLocationUpdate(location) {
        console.log("location", location)
        await onUpdateLocation(location._id, location.name);
        navigate(`/location/${location.name}`);

    }
    function handleSaveMeasurement() {
        setReload(!reload);
        setIsModalOpen(false);
    }
    return (
        <section className="location">
            <Modal
                trigger={<button className="location__button"><FaGear />Opciones</button>}
            >
                <LocationOptions
                    location={location}
                    onSubmit={handleLocationUpdate}
                />
            </Modal>
            <Modal
                trigger={<button className="location__button"><FaPlus />Nueva medición</button>}
                onClose={() => setIsModalOpen(false)}
                onOpen={() => setIsModalOpen(true)}
                isOpen={isModalOpen}
            >
                <MeasurementCreator location={location} onSave={handleSaveMeasurement} />
            </Modal>
            <Measurements location={location} key={reload} />
        </section>
    )
}

export default LocationComponent