// ParameterColorEditor.js
import React from 'react';
import ColorCalculator from './ColorCalculator';
import ColorCircle from '../../components/color/ColorCircle';
import { useParameterColor } from '../../hooks/useParameterColor';

function ParameterColorEditor({ defaultValues, onUpdateColorValues }) {
    const [
        {
            selectedColor,
            selectedWhite,
            selectingWhite,
            selectedValue,
            values
        },
        {
            handleSelectColor,
            handleToggleWhiteSelection,
            handleSetValue,
            handleAddColorValue,
            handleDeleteColorValue,
            handleResetWhite
        }
    ] = useParameterColor(defaultValues);
    function handleAddValue() {
        handleAddColorValue();
        onUpdateColorValues([...values, { color: selectedColor, value: selectedValue }].sort((a, b) => a.value - b.value));
    }
    return (
        <section className="parameter-color-editor">
            

            <ColorCalculator onClick={handleSelectColor} isPicking={true} />

            <section className="whiteColorPicker">
                <ColorCircle
                    color={selectedWhite}
                    className="parameter-color-white"
                />
                <button onClick={handleToggleWhiteSelection}>
                    {selectingWhite ? "Seleccionando" : "Selecciona un punto blanco"}
                </button>
                <button onClick={handleResetWhite}>
                    Limpiar
                </button>
            </section>

            <section className="parameter-color-results">
                <ColorCircle
                    color={selectedColor}
                    className="parameter-color-editor__color"
                />
                <label htmlFor="value">Valor</label>
                <input
                    type="number"
                    step="0.01"
                    lang="en"
                    value={selectedValue}
                    onChange={(e) => handleSetValue(e.target.value)}
                />
                <button
                    onClick={handleAddValue}
                    disabled={!selectedColor}
                >
                    Agregar
                </button>
            </section>

            <section className="parameter-color-values">
                {values.map((value) => (
                    <div className="parameter-color-value" key={value.value + value.color.toString()}>
                        <button onClick={() => handleDeleteColorValue(value)}>
                            Eliminar
                        </button>
                        <ColorCircle
                            color={value.color}
                            className="parameter-color-value__color"
                        />
                        <p>{value.value}</p>
                    </div>
                ))}
            </section>
        </section>
    );
}

export default ParameterColorEditor;