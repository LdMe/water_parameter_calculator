import { useState, useEffect } from "react";
import { getParameters } from "../../utils/fetchParameter";
import { createMeasurement } from "../../utils/fetchMeasurement";
import ColorCalculator from "../color/ColorCalculator";
import ColorCircle from "../color/ColorCircle";
import MeasurementCalculator from "./MeasurementCalculator";
import Parameter from "../../parameter";
import TextWithInfo from "../text/TextWithInfo";
function MeasurementCreator({ location, onSave, onCancel }) {
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
        createMeasurement(measurement.value, measurement.parameter.name, location.name, measurement.color).then((data) => {
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
                    <div className="measurement-creator__value__title">
                        <h3>Resultado</h3>
                        <TextWithInfo
                            autoCloseTime={3000}
                        >
                            {measurement.parameter.hasColor ? (
                                <>
                                    <p>Haz click en un punto de la imágen para calcular el color y el valor asociado.</p>
                                    <p>El valor se puede modificar a mano en caso de que no sea suficientemente preciso.</p>
                                    <p>Recuerda corregir el color en caso de que sea necesario.</p>
                                </>
                            ) : (

                                <p>Intruduce el valor del parámetro en la unidad adecuada.</p>

                            )
                            }
                        </TextWithInfo>
                    </div>
                    <p>{measurement.parameter.name}: </p>
                    {measurement.parameter.hasColor &&
                        <section className="measurement-creator__color">
                            <ColorCircle color={measurement.color} />
                        </section>
                    }
                    <input type="number" step="0.001" value={measurement.value} onChange={(e) => setMeasurement(measurement => { return { ...measurement, value: e.target.value } })} />
                </section>

            )}
            <section className="measurement-creator__actions">
                <button className="measurement-creator__button" onClick={onCancel}>Cancelar</button>
                <button className="measurement-creator__button" disabled={!isReadyToSave()} onClick={() => { handleSave(measurement) }}>Guardar</button>
            </section>


        </div>
    )
}
export default MeasurementCreator