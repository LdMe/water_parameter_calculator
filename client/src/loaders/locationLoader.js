import { redirect } from "react-router-dom";
import { getLocations, getLocation } from "../utils/fetchLocation";

async function loadLocations() {
    const response = await getLocations();
    const { data, error, code } = response;
    const locations = data;
    console.log(locations);
    if (error !== null) {
        if (code === 401) {
            redirect('/login');
        }
        return null;
    }
    else {
        return locations;
    }
}
async function loadLocation(locationName) {
    console.log("locationName",locationName)
    const response = await getLocation(locationName); 
    console.log("response",response)  
    const { data, error, code } = response;
    const location = data;
    if (error !== null) {
        console.log("error",error)
        if (code === 401) {
            return redirect('/login');
        }
        return redirect('/location');
    }
    else {
        if(location === null){
            return redirect('/location');
        }
        return location;
    }
}
export { loadLocations, loadLocation };