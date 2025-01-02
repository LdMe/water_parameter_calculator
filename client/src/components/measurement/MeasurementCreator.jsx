import { useState, useEffect } from "react";
import { getParameters } from "../../utils/fetchParameter";
import { createMeasurement } from "../../utils/fetchMeasurement";
import ColorCalculator from "../color/ColorCalculator";
import ColorCircle from "../color/ColorCircle";
import MeasurementCalculator from "./MeasurementCalculator";
function MeasurementCreator({ location,onSave }) {
    const [step, setStep] = useState(1);
    const [parameters, setParameters] = useState([]);
    const [measurement, setMeasurement] = useState({
        location: location._id,
        date: new Date().toISOString().split('T')[0],
        parameter: null,
        color: null,
        value: null
    });
    useEffect(() => {
        getParameters().then((data) => {
            setParameters(data.data);
        });
    }, []);

    function handleSelectParameter(parameter) {
        setMeasurement(measurement => {
            return {
                ...measurement,
                parameter: parameter
            }
        });
        setStep(2);
    }
    function handleSelectColor(color) {
        setMeasurement({
            ...measurement,
            color: color
        });
        setStep(3);
    }
    function handleSave(measurement) {
        createMeasurement(measurement).then((data) => {
            onSave(data.data);
        });
    }
    if (step === 1) {
        return (
            <div className="measurement-creator">
                <h2>Selecciona un parámetro</h2>
                <div className="measurement-creator__parameters">
                    {parameters.map((parameter) => (
                        <div key={parameter._id} className="measurement-creator__parameter" onClick={() => handleSelectParameter(parameter)}>
                            <span className="measurement-creator__parameter__color" style={{ backgroundColor: parameter.color }}></span>
                            <h3 className="measurement-creator__parameter__name">{parameter.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    return (
        <div className="measurement-creator">
            <ColorCalculator isPicking={true} onSelectColor={handleSelectColor} />
            <ColorCircle color={measurement.color} />
            {measurement.parameter && measurement.color && (
                <>
                <MeasurementCalculator parameter={measurement.parameter} color={measurement.color} />
                <button onClick={() => setStep(1)}>Volver</button>
                <button onClick={() => {handleSave(measurement)}}>Guardar</button>
                </>

            )}
        </div>
    )
}
export default MeasurementCreator