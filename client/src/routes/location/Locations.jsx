import { useState, useEffect } from "react";
import { Outlet, useLoaderData, useParams } from "react-router-dom";
import LocationSelector from "../../components/location/LocationSelector";

import './Location.scss'
function Locations() {
    const locations = useLoaderData();
    const {locationName} = useParams();
    const [selectedLocation, setSelectedLocation] = useState(locations.find(location => location.name === locationName) || locations[0]);
    if(!locations){
        return null;
    }
    return (
        <section className="locations">
            <LocationSelector locations={locations} selectedLocation={selectedLocation} onSelect={setSelectedLocation} />
            <main className="location__measurements">
                <Outlet />
            </main>
        </section>
    )
}

export default Locations