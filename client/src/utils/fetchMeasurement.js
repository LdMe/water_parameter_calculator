import { API_URL } from "../config";

import fetchApi from "./fetch";


const getMeasurementsByLocation = async (location) => {
    const route = 'measurements/location/' + location;
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

const deleteMeasurement = async (id) => {
    const route = 'measurements/' + id;
    const url = API_URL + route;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    };
    return await fetchApi(url, options);
}
const createMeasurement = async (value,parameterName,locationName,pickedColor=null) => {
    const route = 'measurements';
    const url = API_URL + route;
    const data = {
        value,
        parameterName,
        locationName,
      }
    if(pickedColor){
        data.color = pickedColor;
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    };
    return await fetchApi(url, options);
}

export {
    getMeasurementsByLocation,
    deleteMeasurement,
    createMeasurement
}
