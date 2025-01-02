import { updateLocation } from "../../utils/fetchLocation";
import { Outlet, useLoaderData, useRevalidator } from "react-router-dom";
import LocationSelector from "../../components/location/LocationSelector";

import './Location.scss'
function Locations() {
    const locations = useLoaderData();

    const revalidator = useRevalidator();
    const handleLocationUpdate = async (locationId, newName) => {
        await updateLocation(locationId, newName);
        // Forzar la recarga del loader para obtener los datos actualizados
        revalidator.revalidate();
    };
    if (!locations) {
        return null;
    }
    return (
        <section className="locations">
            <LocationSelector locations={locations}  />
            <main className="location__measurements">
                <Outlet  context={{ onUpdateLocation: handleLocationUpdate }}/>
            </main>
        </section>
    )
}

export default Locations