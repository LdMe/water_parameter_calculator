import { useState, useEffect, useContext } from "react";
import { getParameters, deleteParameter } from "../../utils/fetchParameter";
import MessageContext from "../../context/messageContext";
import ColorCircle from "../../components/color/ColorCircle";
import Modal from "../../components/generic/modal/Modal";
import ParameterEditor from "../../components/parameter/ParameterEditor";
import TextWithInfo from "../../components/generic/text/TextWithInfo";
import { FaPlus, FaPencil, FaTrash } from "react-icons/fa6";

import './Parameter.scss'
import ConfirmButton from "../../components/generic/button/ConfirmButton";

function Parameter() {
    const [parameters, setParameters] = useState([]);
    const [selectedParameter, setSelectedParameter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setMessage, setError } = useContext(MessageContext);

    useEffect(() => {
        const fetchParameters = async () => {
            const parameters = await getParameters();
            setParameters(parameters.data || []);
        };
        fetchParameters();
    }, []);

    async function handleDeleteParameter(parameter) {
        if (!confirm(`¿Estás seguro de que quieres eliminar el parámetro '${parameter.name}'?`)) {
            return;
        }
        const response = await deleteParameter(parameter._id);
        const { error } = response;
        
        if (error !== null) {
            setError(error.message);
            return;
        }
        
        setMessage(`Parámetro '${parameter.name}' eliminado correctamente`);
        setParameters(parameters.filter(p => p._id !== parameter._id));
    }

    function handleEditParameter(parameter) {
        setSelectedParameter(parameter);
        setIsModalOpen(true);
    }

    function handleCreateParameter() {
        setSelectedParameter(null);
        setIsModalOpen(true);
    }

    function handleSaveParameter(parameter) {
        setParameters(oldParameters => {
            const parameterIndex = oldParameters.findIndex(p => p._id === parameter._id);
            if (parameterIndex === -1) {
                return [...oldParameters, parameter];
            }
            return [
                ...oldParameters.slice(0, parameterIndex),
                parameter,
                ...oldParameters.slice(parameterIndex + 1)
            ];
        });
        setIsModalOpen(false);
    }

    return (
        <div className="parameter-container">
            <div className="parameter-header">
                <h1>Parámetros</h1>
                <TextWithInfo>
                    <p>Los parámetros permiten guardar y clasificar las mediciones de tus muestras.</p>
                    <p>Para resultados colorimétricos, puedes guardar un parámetro basado en color.</p>
                    <p>Para resultados numéricos, puedes guardar un parámetro basado en un valor numérico.</p>
                </TextWithInfo>
            </div>

            <div className="parameter-actions">
                <Modal
                    trigger={
                        <button onClick={handleCreateParameter}>
                            <FaPlus /> Nuevo Parámetro
                        </button>
                    }
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <ParameterEditor
                        defaultValues={selectedParameter}
                        onSave={handleSaveParameter}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            </div>

            <div className="parameter-grid">
                {parameters.map((parameter) => (
                    <div key={parameter._id} className="parameter-card">
                        <div className="parameter-card__header">
                            <h2>{parameter.name}</h2>
                            <div className="parameter-card__actions">
                                <button 
                                    className="edit"
                                    onClick={() => handleEditParameter(parameter)}
                                    aria-label="Editar parámetro"
                                >
                                    <FaPencil />
                                </button>
                                <ConfirmButton
                                    text={<FaTrash />}
                                    onConfirm={() => handleDeleteParameter(parameter)}
                                    aria-label="Eliminar parámetro"
                                >
                                    <p>Seguro que quieres eliminar el parámetro {parameter.name}?</p>
                                </ConfirmButton>
                                
                            </div>
                        </div>
                        
                        <div className="parameter-card__content">
                            {parameter.colors && parameter.colors.length > 0 ? (
                                <div className="parameter-color-values">
                                    {parameter.colors.map((value) => (
                                        <div 
                                            key={`${value.color.r}-${value.color.g}-${value.color.b}`} 
                                            className="parameter-color-value"
                                        >
                                            <ColorCircle color={value.color} />
                                            <p>{value.value}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="parameter-no-values">
                                    Parámetro numérico sin valores de color
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Parameter;