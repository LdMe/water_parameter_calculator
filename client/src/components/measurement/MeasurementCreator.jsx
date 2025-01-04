import { useState, useEffect } from "react";
import { getParameters } from "../../utils/fetchParameter";
import { createMeasurement } from "../../utils/fetchMeasurement";
import ColorCalculator from "../color/ColorCalculator";
import ColorCircle from "../color/ColorCircle";
import MeasurementCalculator from "./MeasurementCalculator";
import Parameter from "../../parameter";
function MeasurementCreator({ location, onSave }) {
    const [step, setStep] = useState(1);
    const [parameters, setParameters] = useState([]);
    const [measurement, setMeasurement] = useState({
        location: location._id,
        date: new Date().toISOString().split('T')[0],
        parameter: null,
        color: null,
        value: 0
    });
    useEffect(() => {
        getParameters().then((data) => {
            setParameters(data.data);
        });
    }, []);

    function handleSelectParameter(parameter) {
        setMeasurement({
            location: location._id,
            date: new Date().toISOString().split('T')[0],
            color: null,
            value: 0,
            parameter: parameter
        });
    }
    function handleSelectColor(color) {
        const newParameter = new Parameter(measurement.parameter.name, measurement.parameter.colors);
        const value = Math.round(1000 * newParameter.calculateValue(color)) / 1000;
        setMeasurement({
            ...measurement,
            color,
            value
        });
        setStep(3);
    }
    function handleSave(measurement) {
        createMeasurement(measurement.value,measurement.parameter.name,location.name,measurement.color).then((data) => {
            onSave(data.data);
        });
    }
    function isReadyToSave() {
        return measurement.parameter && (!measurement.parameter.hasColor || measurement.color) && measurement.value !== null;
    }
    return (

        <div className="measurement-creator">
            <h2>Selecciona un parámetro</h2>
            <div className="measurement-creator__parameters">
                {parameters.map((parameter) => (
                    <div key={parameter._id} className={"measurement-creator__parameter " + (measurement.parameter && measurement.parameter._id === parameter._id ? "selected" : "")} onClick={() => handleSelectParameter(parameter)}>
                        <span className="measurement-creator__parameter__color" style={{ backgroundColor: parameter.color }}></span>
                        <h3 className="measurement-creator__parameter__name">{parameter.name}</h3>
                    </div>
                ))}
            </div>
            {measurement.parameter?.hasColor && (
                <>
                    <ColorCalculator isPicking={true} onSelectColor={handleSelectColor} />
                </>

            )}
            {measurement.parameter && (
                <section className="measurement-creator__value">
                    {measurement.parameter.hasColor && <ColorCircle color={measurement.color} />}
                    <p>{measurement.parameter.name}: </p>
                    <input type="number" step="0.001" value={measurement.value} onChange={(e) => setMeasurement(measurement => { return { ...measurement, value: e.target.value } })} />
                </section>

            )}
            <button className="measurement-creator__button" disabled={!isReadyToSave()} onClick={() => { handleSave(measurement) }}>Guardar</button>

        </div>
    )
}
export default MeasurementCreator