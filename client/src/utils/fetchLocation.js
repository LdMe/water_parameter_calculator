import { API_URL } from "../config";

import fetchApi from "./fetch";

const getLocations = async () => {
    const route = 'locations';
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
const createLocation = async (name) => {
    const route = 'locations';
    const url = API_URL + route;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({name})
    };
    return await fetchApi(url, options);
}



const updateLocation = async (id, name) => {
    const route = 'locations/' + id;
    const url = API_URL + route;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({name})
    };
    return await fetchApi(url, options);
}

const deleteLocation = async (id) => {
    const route = 'locations/' + id;
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
    
export { 
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation,
 };