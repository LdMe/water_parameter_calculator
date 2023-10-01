import { useState, useEffect } from "react"
import { API_URL } from "../config";

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [newlocationName, setNewLocationName] = useState("");

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
            <button onClick={createLocation}>add</button>
            {
                locations.slice().reverse().map(location => {
                    return (
                        <div key={location._id}>
                            <form onSubmit={saveLocation}>
                                <input type="text" defaultValue={location.name} />
                                <input type="hidden" defaultValue={location._id} name="id" />
                                <button type="submit">rename</button>
                                <button onClick={() => deleteLocation(location._id)} >delete</button>
                            </form>
                            <a href={"/location/" + location.name}>view</a>
                        </div>
                    )

                })
            }
        </div>
    )
}

export default Locations;