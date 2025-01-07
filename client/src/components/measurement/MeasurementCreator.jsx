// MeasurementCreator.jsx
import { useState, useEffect } from "react";
import { getParameters } from "../../utils/fetchParameter";
import { createMeasurement } from "../../utils/fetchMeasurement";
import ColorCalculator from "../color/ColorCalculator";
import ColorCircle from "../color/ColorCircle";
import Parameter from "../../utils/classes/parameter";
import TextWithInfo from "../generic/text/TextWithInfo";
import { FaCamera, FaXmark, FaCheck } from 'react-icons/fa6';
import './MeasurementCreator.scss';

function MeasurementCreator({ location, onSave, onCancel }) {
    const [parameters, setParameters] = useState([]);
    const [measurements, setMeasurements] = useState([]);
    const [selectedParameter, setSelectedParameter] = useState(null);
    const [imageSet, setImageSet] = useState(false);
    
    useEffect(() => {
        getParameters().then((data) => {
            setParameters(data.data);
        });
    }, []);

    const handleSelectParameter = (parameter) => {
        setSelectedParameter(parameter);
        if(!parameter.hasColor) {
           const newMeasurement = {
               parameter,
               color: null,
               value: 0
           }
           setMeasurements([...measurements, newMeasurement]);
        }
    };

    const handleSelectColor = (color) => {
        if (!selectedParameter) return;

        const newParameter = new Parameter(selectedParameter.name, selectedParameter.colors);
        const value = Math.round(1000 * newParameter.calculateValue(color)) / 1000;

        const newMeasurement = {
            parameter: selectedParameter,
            color,
            value,
        };

        // Reemplazar si ya existe una medición para este parámetro
        const existingIndex = measurements.findIndex(m => m.parameter._id === selectedParameter._id);
        if (existingIndex !== -1) {
            const updatedMeasurements = [...measurements];
            updatedMeasurements[existingIndex] = newMeasurement;
            setMeasurements(updatedMeasurements);
        } else {
            setMeasurements([ newMeasurement,...measurements]);
        }
    };

    const handleUpdateValue = (paramId, newValue) => {
        const updatedMeasurements = measurements.map(m => {
            if (m.parameter._id === paramId) {
                return { ...m, value: newValue };
            }
            return m;
        });
        setMeasurements(updatedMeasurements);
    };

    const handleDeleteMeasurement = (paramId) => {
        setMeasurements(measurements.filter(m => m.parameter._id !== paramId));
        if (selectedParameter?._id === paramId) {
            setSelectedParameter(null);
        }
    };

    const handleSaveAll = async () => {
        try {
            const savedMeasurements = await Promise.all(
                measurements.map(m => 
                    createMeasurement(
                        m.value,
                        m.parameter.name,
                        location.name,
                        m.color
                    )
                )
            );
            onSave(savedMeasurements);
        } catch (error) {
            console.error('Error saving measurements:', error);
        }
    };

    return (
        <div className="measurement-creator">
            <div className="measurement-creator__main">
                <section className="image-section">
                    <ColorCalculator
                        isPicking={!!selectedParameter?.hasColor}
                        onSelectColor={handleSelectColor}
                        onImageSet={() => setImageSet(true)}
                    />
                </section>

                <section className="parameters-section">
                    <div className="parameters-list">
                        <h3>Parámetros disponibles</h3>
                        <div className="parameters-grid">
                            {parameters.map((param) => (
                                <button
                                    key={param._id}
                                    className={`parameter-button ${selectedParameter?._id === param._id ? 'selected' : ''}`}
                                    onClick={() => handleSelectParameter(param)}
                                >
                                    <span className="parameter-name">{param.name}</span>
                                    {measurements.find(m => m.parameter._id === param._id) && (
                                        <span className="parameter-measured">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {measurements.length > 0 && (
                        <div className="measurements-list">
                            <h3>Mediciones realizadas</h3>
                            {measurements.map((measurement) => (
                                <div key={measurement.parameter._id} className="measurement-item">
                                    <div className="measurement-info">
                                        <span>{measurement.parameter.name}</span>
                                        {measurement.color && (
                                            <ColorCircle color={measurement.color} />
                                        )}
                                    </div>
                                    <div className="measurement-controls">
                                        <input
                                            type="number"
                                            step="0.001"
                                            value={measurement.value}
                                            onChange={(e) => handleUpdateValue(
                                                measurement.parameter._id,
                                                parseFloat(e.target.value)
                                            )}
                                        />
                                        <button 
                                            className="delete-button"
                                            onClick={() => handleDeleteMeasurement(measurement.parameter._id)}
                                        >
                                            <FaXmark />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <footer className="measurement-creator__footer">
                <button className="cancel-button" onClick={onCancel}>
                    Cancelar
                </button>
                <button 
                    className="save-button"
                    onClick={handleSaveAll}
                    disabled={measurements.length === 0}
                >
                    <FaCheck />
                    Guardar {measurements.length} mediciones
                </button>
            </footer>

            {selectedParameter && (
                <div className="selected-parameter-info">
                    <p>
                        {selectedParameter.hasColor 
                            ? "Haz click en la imagen para medir el color" 
                            : "Introduce el valor manualmente"}
                    </p>
                </div>
            )}
        </div>
    );
}

export default MeasurementCreator;