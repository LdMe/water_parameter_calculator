import { useState, useEffect } from "react";
import { getParameters,deleteParameter } from "../../utils/fetchParameter";
import ColorCircle from "../../components/color/ColorCircle";
import { Link } from "react-router-dom";
function Parameter() {
    const [parameters, setParameters] = useState([]);
    useEffect(() => {
        const fetchParameters = async () => {
            const parameters = await getParameters();
            console.log(parameters)
            setParameters(parameters.data || []);
        };
        fetchParameters();
    }, []);
    async function handleDeleteParameter(parameterName) {
        if(!confirm(`Are you sure you want to delete '${parameterName}'?`)){
            return;
        }
        const response = await deleteParameter(parameterName);
        const { data, error, code } = response;
        if (error !== null) {
            // checkAuth(code);
        }
        else {
            alert(`Parameter '${parameterName}' deleted`);
            setParameters(parameters.filter(parameter => parameter.name !== parameterName));
        }
    }
    /* const checkAuth = (code) => {
        if (code === 401) {
            navigate('/login');
        }
    } */
    return (
        <div>
            <h1>Parámetros</h1>
            <Link to="/parameter/new">Nuevo Parámetro</Link>
            <section className="parameter-colors">
            {parameters.map((parameter) => (
                <div key={parameter._id}>
                    <h2>{parameter.name}</h2>
                    <button onClick={() => handleDeleteParameter(parameter.name)}>Eliminar</button>
                    <section className="parameter-color-values">
                        {parameter.colors.map((value) => (
                            <div key={value._id}>
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