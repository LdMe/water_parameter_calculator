// ParameterColorEditor.js
import {useRef} from 'react';
import ColorCircle from '../color/ColorCircle';
import { useParameterColor } from '../../hooks/useParameterColor';
import ColorCalculator from '../color/ColorCalculator';

function ParameterColorEditor({ defaultValues, onUpdateColorValues }) {
    const inputRef = useRef(null);
    const [
        {
            selectedColor,
            selectedValue,
            values
        },
        {
            handleSelectColor,
            handleSetValue,
            handleAddColorValue,
            handleDeleteColorValue,
        }
    ] = useParameterColor(defaultValues);

    function handleColor(color) {
        handleSelectColor(color);
        inputRef.current.focus();
    }
    function handleAddValue(e) {
        e.preventDefault();
        handleAddColorValue();
        onUpdateColorValues([...values, { color: selectedColor, value: selectedValue }].sort((a, b) => a.value - b.value));
    }
    return (
        <section className="parameter-color-editor">
            

            <ColorCalculator onSelectColor={handleColor} />

            <section className="parameter-color-results">
                <ColorCircle
                    color={selectedColor}
                    className="parameter-color-editor__color"
                />
                <form onSubmit={handleAddValue} >
                <input
                    type="number"
                    ref={inputRef}
                    step="0.01"
                    lang="en"
                    value={selectedValue}
                    onChange={(e) => handleSetValue(e.target.value)}
                />
                <button
                    disabled={!selectedColor}
                >
                    Agregar
                </button>
                </form>
            </section>

            <section className="parameter-color-values">
                {values.map((value) => (
                    <div className="parameter-color-value" key={value.value + JSON.stringify(value.color)}>
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