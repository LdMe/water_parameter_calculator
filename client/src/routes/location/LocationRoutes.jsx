import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";

function LocationRoutes() {
    const {locations } = useOutletContext();

    return (
        <div className="location-routes">
            <div className="location-routes__container">
                <h1 className="location-routes__title">Selecciona una ubicación</h1>
                <ul className="location-routes__list">
                    {locations.map((location) => (
                        <li key={location._id} className="location__card">
                            <Link to={`/location/${location.name}`}>{location.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default LocationRoutes
