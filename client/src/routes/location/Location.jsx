import { useLoaderData } from "react-router-dom";
import Measurements from "../../components/measurement/Measurement";

function LocationComponent (){
    const location = useLoaderData();
    console.log("location",location)
    
    return (
        <Measurements location={location} />
    )
}

export default LocationComponent