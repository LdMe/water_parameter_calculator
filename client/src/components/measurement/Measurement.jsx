import {useState,useEffect} from "react";

import { getMeasurementsByLocation, deleteMeasurement } from "../../utils/fetchMeasurement";
import MeasurementCard from "./MeasurementCard";

import './Measurement.scss';

function Measurement({location}) {
    const [measurements, setMeasurements] = useState([]);
    const [groupBy, setGroupBy] = useState('byDate');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMeasurementsByLocation(location._id).then((data) => {
            setMeasurements(data.data);
            setLoading(false);
        });
    }, [location]);

    function toggleGroupBy() {
        setGroupBy(groupBy === 'byParameter' ? 'byDate' : 'byParameter');
    }

    async function handleDeleteMeasurement(measurement) {
        await deleteMeasurement(measurement._id);
        getMeasurementsByLocation(location._id).then((data) => {
            setMeasurements(data.data);
        });
    }

    if (loading) {
        return (
            <div className="measurement">
                <h2>{location.name}</h2>
                <div className="measurement__loading">
                    <p>Cargando mediciones...</p>
                </div>
            </div>
        );
    }

    if (measurements[groupBy]?.length === 0) {
        return (
            <div className="measurement">
                <h2>{location.name}</h2>
                <div className="measurement__empty">
                    <p>No hay mediciones registradas</p>
                </div>
            </div>
        );
    }

    return (
        <div className="measurement">
            <h2>{location.name}</h2>
            <section className="measurement__list">
                <button onClick={toggleGroupBy}>
                    Agrupar por {groupBy === 'byParameter' ? 'Fecha' : 'Parámetro'}
                </button>
                <h3>Total de mediciones: {measurements[groupBy].length}</h3>
                {measurements[groupBy].map((measurement) => (
                    <MeasurementCard 
                        key={measurement.parameter || measurement.date} 
                        measurement={measurement} 
                        groupBy={groupBy} 
                        onDelete={handleDeleteMeasurement}
                    />
                ))}
            </section>
        </div>
    );
}

export default Measurement