import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import '../styles/Locations.scss'
import { FaTrash, FaFloppyDisk, FaChartLine, FaPlus } from 'react-icons/fa6';

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [newlocationName, setNewLocationName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadLocations();
    }
        , []);

    const loadLocations = async () => {
        try {
            const response = await fetch(API_URL + "locations", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            const json = await response.json();
            console.log("json", json)
            setNewLocationName("");
            setLocations(json);

        } catch (error) {

        }
    }
    const createLocation = async () => {
        try {
            if(newlocationName === "") return;
            console.log("newlocationName", newlocationName)
            const response = await fetch(API_URL + "locations", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ name: newlocationName })

            });
            const json = await response.json();
            loadLocations();
        }
        catch (err) {

        }
    }

    const saveLocation = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_URL + "locations/" + e.target.id.value, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ name: e.target[0].value })

            });
            const json = await response.json();
            alert("saved");
            loadLocations();
        } catch (error) {
            console.log("error", error)
        }
    }

    const deleteLocation = async (id) => {
        if (!confirm("Are you sure you want to delete this location?")) return;
        try {
            const response = await fetch(API_URL + "locations/" + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },

            });
            const json = await response.json();
            loadLocations();
        } catch (error) {
            console.log("error", error)
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
                                    <button className="iconButton" type="submit"><FaFloppyDisk title="rename" /></button>
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