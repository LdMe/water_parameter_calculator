import { FaTrash } from "react-icons/fa6";
import ColorCircle from "../color/ColorCircle";
import ConfirmButton from "../generic/button/ConfirmButton";

function MeasurementCard({ measurement, groupBy, onDelete }) {
    return (
        <article className="measurement__card">
            <h3>{groupBy === 'byDate' ? 
                new Date(measurement.date).toLocaleDateString("es-ES") : 
                measurement.parameter}
            </h3>
            <section className="measurement__values">
                {measurement.measurements.map((singleMeasurement) => {
                    const date = new Date(singleMeasurement.date).toLocaleDateString("es-ES");
                    return (
                        <article className="measurement__info" key={singleMeasurement._id}>
                            <p className="measurement__label">
                                {groupBy === 'byParameter' ? date : singleMeasurement.parameter}
                            </p>
                            <section className="measurement__value-container">
                                {(singleMeasurement.hasColor || measurement.hasColor) ? 
                                    <ColorCircle color={singleMeasurement.color} />
                                    : <div style={{ width: '2rem', height: '2rem' }}></div>
                                }
                                <p className="measurement__value">{singleMeasurement.value}</p>
                                <ConfirmButton 
                                    text={<FaTrash />} 
                                    onConfirm={() => onDelete(singleMeasurement)}
                                >
                                    ¿Estás seguro de que quieres borrar esta medición?
                                </ConfirmButton>
                            </section>
                        </article>
                    )
                })}
            </section>
        </article>
    )
}

export default MeasurementCard