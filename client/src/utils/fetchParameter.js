import { API_URL } from "../config";
import fetchApi from "./fetch";


const getParameters = async () => {
    const route = 'parameters';
    const url = API_URL + route;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    return await fetchApi(url, options);
}
const createParameter = async (name) => {
    const route = 'parameters';
    const url = API_URL + route;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ name })
    };
    return await fetchApi(url, options);
}

const createDefaultParameters = async () => {
    const parameters = [

        {
            name: "ph",
            colors: [
                {
                    color: { r: 227, g: 224, b: 170 },
                    value: 6
                },
                {
                    color: { r: 209, g: 214, b: 168 },
                    value: 6.5
                },
                {
                    color: { r: 191, g: 205, b: 189 },
                    value: 7
                },
                {
                    color: { r: 172, g: 213, b: 208 },
                    value: 7.5
                },
                {
                    color: { r: 147, g: 189, b: 208 },
                    value: 8
                },
                {
                    color: { r: 141, g: 163, b: 208 },
                    value: 8.5
                },
                {
                    color: { r: 135, g: 152, b: 196 },
                    value: 9
                }
            ],
            isColor: true
        },
        {
            name: "nitrite",
            colors: [
                {
                    color: { r: 255, g: 255, b: 255 },
                    value: 0
                },
                {
                    color: { r: 255, g: 240, b: 250 },
                    value: 0.5
                },
                {
                    color: { r: 255, g: 227, b: 237 },
                    value: 1
                },
                {
                    color: { r: 255, g: 220, b: 241 },
                    value: 2
                },
                {
                    color: { r: 255, g: 185, b: 219 },
                    value: 4
                },
                {
                    color: { r: 254, g: 145, b: 190 },
                    value: 8
                }
            ],
            isColor: true
        },
        {
            name: "dkh",
            isColor: false
        }
    ];

    const route = 'parameters';
    const url = API_URL + route;
    parameters.forEach(async (parameter) => {
        await createParameter(parameter.name);
        await saveParameter(parameter.name, parameter.colors, parameter.isColor,true);
    });

}

const getParameter = async (parameterName) => {
    const route = 'parameters/' + parameterName;
    const url = API_URL + route;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    return await fetchApi(url, options);
}

const saveParameter = async (parameterName, values, hasColorScale,force=false) => {
    const oldParameter = await getParameter(parameterName);

    let route = 'parameters/' + parameterName;

    const data = {
        name: parameterName,
        colors: values,
        isColor: hasColorScale
    }
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    };
    if (oldParameter.data === null) {
        options.method = 'POST';
        route = 'parameters';
    } else {
        if (!force && !confirm(`A parameter with the name '${parameterName}' already exists, do you want to overwrite it?`)) {
            return { error: "Update cancelled", code: 400, data: null }
        };
    }
    const url = API_URL + route;
    return await fetchApi(url, options);
}

const deleteParameter = async (parameterName) => {
    const route = 'parameters/' + parameterName;
    const url = API_URL + route;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    }
    return await fetchApi(url, options);
}

export {
    getParameters,
    createParameter,
    getParameter,
    saveParameter,
    deleteParameter,
    createDefaultParameters
};