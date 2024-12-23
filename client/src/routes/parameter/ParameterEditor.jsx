import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParameterTypeChooser from './ParameterTypeChooser';
import ParameterNameChooser from './ParameterNameChooser';
import ParameterColorEditor from './ParameterColorEditor';

import { saveParameter,getParameter } from '../../utils/fetchParameter';
import './ParameterEditor.scss';
import { Link } from 'react-router-dom';

function ParameterEditor() {
    const [step, setStep] = useState(1);
    const [parameter, setParameter] = useState({
        name: "",
        values: [],
        hasColor: true
    });
    const navigate = useNavigate();
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
    function handleUpdateValues(values) {
        setParameter({
            ...parameter,
            values
        })
    }
    async function handleSaveParameter() {
        const oldParameter = await getParameter(parameter.name);
        if(oldParameter.data !== null && !confirm(`Ya existe un parámetro de nombre '${parameter.name}', ¿quieres sobreescribirlo?`)) {
            return;
        }
        const result = await saveParameter(parameter.name, parameter.values, parameter.hasColor,oldParameter.data);
        if (result.error !== null) {
            alert(result.error);
            return;
        }
        alert(`Parámetro '${parameter.name}' guardado`);
        navigate('/parameter');
    }
    switch (step) {
        case 1:
            return (
                <div className="parameter-editor">
                    <h1>Crear nuevo parámetro</h1>
                    <ParameterTypeChooser
                        selectedIndex={parameter.hasColor ? 0 : 1}
                        onClick={handleSelectHasColor}
                    />
                    <section className="parameter-editor__buttons">
                        <Link to="/parameter">
                        <button >Cancelar</button>

                        </Link>
                        <button onClick={() => setStep(2)}>Siguiente</button>
                    </section>
                </div>
            )
        case 2:
            return (
                <div className="parameter-editor">
                    <h1>Nombre</h1>
                    <ParameterNameChooser
                        value={parameter.name}
                        onChange={handleChangeName}
                    />
                    <section className="parameter-editor__buttons">
                        <button onClick={() => setStep(1)}>Anterior</button>
                        <button disabled={!parameter.name} onClick={() => setStep(3)}>Siguiente</button>
                    </section>
                </div>
            )
        case 3:
            return (
                <div className="parameter-editor">
                    <h1>Valores</h1>
                    <ParameterColorEditor
                        defaultValues={parameter.values}
                        onUpdateColorValues={handleUpdateValues}
                    />
                    <section className="parameter-editor__buttons">
                        <button onClick={() => setStep(2)}>Anterior</button>
                        <button onClick={handleSaveParameter}>Guardar</button>
                    </section>
                </div>
            )
    }
    return (
        <div className="parameter-editor">
            <h1>Parameter editor</h1>
        </div>
    )
}

export default ParameterEditor