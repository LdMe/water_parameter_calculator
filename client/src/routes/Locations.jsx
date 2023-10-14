import { useState, useEffect,useContext } from "react"
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import '../styles/Locations.scss'
import ErrorContext from "../context/errorContext";
import { FaTrash, FaFloppyDisk, FaChartLine, FaPlus } from 'react-icons/fa6';
import { getLocations, createLocation as createLocationApi,updateLocation,deleteLocation as deleteLocationApi } from "../utils/fetchLocation";

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [newlocationName, setNewLocationName] = useState("");
    const navigate = useNavigate();
    const {setError} = useContext(ErrorContext);

    useEffect(() => {
        loadLocations();
    }, []);

    const loadLocations = async () => {
        const response = await getLocations();
        const { data, error, code } = response;
        const locations = data;
        console.log("response", response)
        if (error !== null) {
            console.log("error", error)
            if (code === 401) {
                navigate('/login');
            }
        }
        else {
            console.log("locations", locations)
            setLocations(locations);
            setNewLocationName("");
        }
    }
    const createLocation = async () => {
        if (newlocationName === "") {
            setError("Please enter a location name");
            return;
        }        const result = await createLocationApi(newlocationName);
        const { data, error, code } = result;
        if (error) {
            if (code === 401) {
                navigate('/login');
            }
            if(code === 409){
                setError("Location already exists");
                return;
            }
        }
        else {
            setNewLocationName("");
            loadLocations();
        }
    }

    const saveLocation = async (e) => {
        e.preventDefault();
        const id = e.target.id.value;
        const name = e.target[0].value;
        if (name === "") return;
        const response = await updateLocation(id, name);
        const { data, error, code } = response;
        if (error) {
            if (code === 401) {
                navigate('/login');
            }
        }
        else {
            loadLocations();
        }
    }

    const deleteLocation = async (id) => {
        if (!confirm("Are you sure you want to delete this location?")) return;
        const response = await deleteLocationApi(id);
        const { data, error, code } = response;
        if (error) {
            if (code === 401) {
                navigate('/login');
            }
        }
        else {
            loadLocations();
        }
    }

    return (
        <div>
            <h2>My Locations</h2>
            <input type="text" placeholder="new" value={newlocationName} onChange={(e) => setNewLocationName(e.target.value)} />
            <FaPlus className="icon" onClick={createLocation}>add</FaPlus>
            {
                locations.slice().reverse().map(location => {
                    return (
                        <div key={location._id} className="locationListElement">
                            <form className="locationForm" onSubmit={saveLocation}>
                                <input type="text" name="name" defaultValue={location.name} />
                                <input type="hidden" defaultValue={location._id} name="id" />
                                <section className="buttonSection">
                                    <button className="iconButton" type="submit"><FaFloppyDisk className="icon" title="rename" /></button>
                                    <FaChartLine className="icon" onClick={() => { navigate("/location/" + location.name) }}>view</FaChartLine>
                                    <FaTrash className="icon" onClick={() => deleteLocation(location._id)} title="delete" ></FaTrash>
                                </section>
                            </form>
                        </div>
                    )

                })
            }
        </div>
    )
}

export default Locations;