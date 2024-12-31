import {useState,useEffect} from "react";

import { getMeasurementsByLocation } from "../../utils/fetchMeasurement";
import MeasurementCard from "./MeasurementCard";

import './Measurement.scss';

function Measurement({location}) {

    const [measurements, setMeasurements] = useState([]);
    const [groupBy, setGroupBy] = useState('byDate');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMeasurementsByLocation(location._id).then((data) => {
            console.log("data",data)
            setMeasurements(data.data);
            setLoading(false);
        });
    }, [location]);

    useEffect(() => {
        if (measurements.length > 0) {
            const location = measurements[0].location;
        }
    }, [measurements]);

    function toggleGroupBy() {
        setGroupBy(groupBy === 'byParameter' ? 'byDate' : 'byParameter');
    }

    return (
        <div className="measurement">
            <h2>{location.name}</h2>
            {loading ? <p>Cargando...</p> : (
                <section className="measurement__list">
                    <button onClick={toggleGroupBy}>Agrupar por {groupBy === 'byParameter' ? 'Fecha' : 'Parametro'}</button>
                    <h3>Total de mediciones: {measurements[groupBy].length}</h3>
                    {measurements[groupBy].map((measurement) => {
                        return (
                            <MeasurementCard key={measurement.parameter || measurement.date} measurement={measurement} groupBy={groupBy} />
                        )
                    })}
                </section>
            )}
        </div>
    );
}

export default Measurement