import ColorCircle from "../color/ColorCircle";


function MeasurementCard({ measurement, groupBy }) {
    return (
        <article className="measurement__card" >
            <h3>{groupBy === 'byDate' ? new Date(measurement.date).toLocaleDateString("es-ES") : measurement.parameter}</h3>
            <section className="measurement__values">
                {measurement.measurements.map((singleMeasurement) => {
                    const date = new Date(singleMeasurement.date).toLocaleDateString("es-ES");
                    return (
                        <article className="measurement__info" key={singleMeasurement._id}>
                            {groupBy === 'byParameter' ? <p className="measurement__date measurement__label">{date}</p> : <p className="measurement__parameter measurement__label">{singleMeasurement.parameter}</p>}
                            <section className="measurement__value__container">
                                {(singleMeasurement.hasColor || measurement.hasColor) && < ColorCircle color={singleMeasurement.color} />}
                                <p className="measurement__value">{singleMeasurement.value}</p>
                            </section>
                        </article>
                    )
                })}
            </section>
        </article>
    )
};

export default MeasurementCard