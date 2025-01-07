import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import Measurements from "../../components/measurement/Measurement";
import Modal from "../../components/generic/modal/Modal";
import LocationOptions from "../../components/location/LocationOptions";
import { FaGear, FaPlus } from "react-icons/fa6";
import NewMeasurementModal from "../../components/measurement/NewMeasurementModal";

import './Location.scss'

function LocationComponent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const location = useLoaderData();
    const navigate = useNavigate();
    const {locations, onUpdateLocation,onDeleteLocation } = useOutletContext();

    async function handleLocationUpdate(location) {
        console.log("location", location)
        await onUpdateLocation(location._id, location.name);
        navigate(`/location/${location.name}`);
        setIsModalOpen(false);

    }
    async function handleDeleteLocation(locationId) {
       onDeleteLocation(locationId);
    }
    function handleSaveMeasurement() {
        setReload(!reload);
        setIsModalOpen(false);
    }
    return (
        <section className="location">
            <div className="location__header">

                <NewMeasurementModal
                    location={location}
                    onSave={handleSaveMeasurement}
                />
                <Modal
                    trigger={<button className="modal__button"><FaGear />Opciones</button>}
                    onClose={() => setIsModalOpen(false)}
                    onOpen={() => setIsModalOpen(true)}
                    isOpen={isModalOpen}
                >
                    <LocationOptions
                        location={location}
                        onSubmit={handleLocationUpdate}
                        onDelete={handleDeleteLocation}
                    />
                </Modal>
            </div>
            <Measurements location={location} key={reload} />
        </section>
    )
}

export default LocationComponent