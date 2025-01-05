import { useState, useEffect, useContext } from 'react';

import ParameterTypeChooser from './ParameterTypeChooser';
import ParameterNameChooser from './ParameterNameChooser';
import ParameterColorEditor from './ParameterColorEditor';

import MessageContext from '../../context/messageContext';

import { saveParameter, getParameter, updateParameter, getParameterByName } from '../../utils/fetchParameter';
import './ParameterEditor.scss';

const defaultParameter = {
    name: "",
    colors: [],
    hasColor: true
}
function ParameterEditor({ defaultValues, onSave, onCancel }) {
    const [parameter, setParameter] = useState(defaultValues || defaultParameter);
    const { setMessage, setError } = useContext(MessageContext);

    function handleSelectHasColor(value) {
        setParameter({
            ...parameter,
            hasColor: value
        })
    }
    async function handleChangeName(value) {
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
        const oldParameter = await getParameterByName(parameter.name);
        console.log("oldParameter", oldParameter)
        if (oldParameter.data !== null && oldParameter.data._id !== parameter._id) {
            setError(`Ya existe un parámetro de nombre '${parameter.name}'. Por favor elige otro nombre.`);
            return;
        }
        const result = await saveParameter(parameter);

        if (result.error !== null) {
            setError(result.error);
            return;
        }
        const newParameter = result.data;
        console.log("newParameter", newParameter)
        setMessage(`Parámetro '${newParameter.name}' guardado`);
        onSave && onSave(newParameter);
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