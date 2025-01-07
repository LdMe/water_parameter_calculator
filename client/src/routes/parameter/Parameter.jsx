import { useState, useEffect,useContext } from "react";
import { getParameters, deleteParameter } from "../../utils/fetchParameter";
import MessageContext from "../../context/messageContext";
import ColorCircle from "../../components/color/ColorCircle";
import Modal from "../../components/generic/modal/Modal";
import ParameterEditor from "../../components/parameter/ParameterEditor";
import TextWithInfo from "../../components/generic/text/TextWithInfo";


import './Parameter.scss'
function Parameter() {
    const [parameters, setParameters] = useState([]);
    const [selectedParameter, setSelectedParameter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {setMessage,setError} = useContext(MessageContext);
    useEffect(() => {
        const fetchParameters = async () => {
            const parameters = await getParameters();
            console.log(parameters)
            setParameters(parameters.data || []);
        };
        fetchParameters();
    }, []);
    async function handleDeleteParameter(parameter) {
        console.log("delete parameter", parameter)
        if (!confirm(`Seguro que quieres eliminar el parámetro '${parameter.name}'?`)) {
            return;
        }
        const response = await deleteParameter(parameter._id);
        console.log("response", response)
        const { data, error, code } = response;
        if (error !== null) {
            setError(error.message);
            return;

        }
        else {
            setMessage(`Parametro '${parameter.name}' eliminado`);
            setParameters(parameters.filter(p => p._id !== parameter._id));
        }
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
        console.log("saving parameter22", parameter)
        setParameters(oldParameters => {
            const parameterIndex = oldParameters.findIndex(p => p._id === parameter._id);
            console.log("parameterIndex", parameterIndex)
            if (parameterIndex === -1) {
                return [...oldParameters, parameter];
            }
            console.log("existe el parametro")
            return [...oldParameters.slice(0, parameterIndex), parameter, ...oldParameters.slice(parameterIndex + 1)];

        })
        setIsModalOpen(false);
    }
    return (
        <div>
            <div className="parameter-header">
                <h1>Parámetros</h1>
                <TextWithInfo>
                    <p>Los parámetros permiten guardar y clasificar las mediciones de tus muestras.</p>
                    <p>Para resultados colorimétricos, puedes guardar un parámetro basado en color.</p>
                    <p>Para resultados numéricos, puedes guardar un parámetro basado en un valor numérico.</p>
                </TextWithInfo>
            </div>
            <Modal
                trigger={<button onClick={handleCreateParameter}>Nuevo Parámetro</button>}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <ParameterEditor
                    defaultValues={selectedParameter}
                    onSave={handleSaveParameter}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
            <section className="parameter-colors">
                {parameters.map((parameter) => (
                    <div key={parameter._id}>
                        <h2>{parameter.name}</h2>
                        <button onClick={() => handleEditParameter(parameter)}>Editar</button>
                        <button onClick={() => handleDeleteParameter(parameter)}>Eliminar</button>
                        <section className="parameter-color-values">
                            {parameter.colors.map((value) => (
                                <div key={value.color.r + value.color.g + value.color.b} className="parameter-color-value">
                                    <p>{value.value}</p>
                                    <ColorCircle color={value.color} />
                                </div>
                            ))}

                        </section>

                    </div>
                ))}
            </section>
        </div>
    );
}

export default Parameter;