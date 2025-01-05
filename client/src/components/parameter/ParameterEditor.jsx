import { useState, useEffect } from 'react';

import ParameterTypeChooser from './ParameterTypeChooser';
import ParameterNameChooser from './ParameterNameChooser';
import ParameterColorEditor from './ParameterColorEditor';

import { saveParameter, getParameter, updateParameter } from '../../utils/fetchParameter';
import './ParameterEditor.scss';

const defaultParameter = {
    name: "",
    colors: [],
    hasColor: true
}
function ParameterEditor({ defaultValues, onSave, onCancel }) {
    const [parameter, setParameter] = useState(defaultValues || defaultParameter);

    function handleSelectHasColor(value) {
        setParameter({
            ...parameter,
            hasColor: value
        })
    }
    function handleChangeName(value) {
        setParameter({
            ...parameter,
            name: value
        })
    }
    function handleUpdateValues(colors) {
        setParameter({
            ...parameter,
            colors
        })
    }
    async function handleSaveParameter() {
        console.log("saving parameter", parameter)
        const oldParameter = await getParameter(parameter._id || parameter.name);
        if (oldParameter.data !== null) {
            if (!confirm(`Ya existe un parámetro de nombre '${parameter.name}', ¿quieres sobreescribirlo?`)) {
                return;
            }
            const parameterData = {
                name: parameter.name,
                colors: parameter.colors,
                hasColor: parameter.hasColor,
                _id: parameter._id
            }
            const result = await updateParameter(parameterData);
            if (result.error !== null) {
                alert(result.error);
                return;
            }
            alert(`Parámetro '${parameter.name}' guardado`);
            onSave && onSave(parameter);
            return;

        }
        const result = await saveParameter(parameter.name, parameter.colors, parameter.hasColor, oldParameter.data);
        if (result.error !== null) {
            alert(result.error);
            return;
        }
        alert(`Parámetro '${parameter.name}' guardado`);
        onSave && onSave(parameter);
    }
    if (!parameter) return null;
    return (
        <div className="parameter-editor">
            <h1>
                {parameter._id ? "Editar parámetro" : "Crear parámetro"}
            </h1>
            <section className="parameter-name">
                <h2>Nombre</h2>
                <ParameterNameChooser
                    value={parameter.name}
                    onChange={handleChangeName}
                />
            </section>
            <section className="parameter-type">

                <ParameterTypeChooser
                    selectedIndex={parameter.hasColor ? 0 : 1}
                    onClick={handleSelectHasColor}
                />
            </section>
            {parameter.hasColor && (
                <section className="parameter-value">
                    <h2>Valores</h2>
                    <ParameterColorEditor
                        defaultValues={parameter.colors}
                        onUpdateColorValues={handleUpdateValues}
                    />
                </section>

            )}
            <section className="parameter-editor__buttons">
                <button onClick={onCancel}>Cancelar</button>
                <button disabled={parameter.name === "" || parameter.hasColor && parameter.colors.length === 0} className="primary" onClick={handleSaveParameter}>Guardar</button>
            </section>

        </div>
    )

}

export default ParameterEditor