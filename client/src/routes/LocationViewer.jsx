import {useState,useEffect} from 'react';
import {API_URL} from '../config';
import {useParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

const LocationViewer = () => {
    const [location,setLocation] = useState({});
    const [measurements,setMeasurements] = useState([]);

    const {locationName} = useParams();
    const navigate = useNavigate();
    const webLocation = useLocation();

    useEffect(() => {
        loadLocation();
    }
        , [locationName]);

    const loadLocation = async () => {
        try{
            const response = await fetch(API_URL + "measurements/location/" + locationName, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            if(response.status === 401){
                navigate('/login');
            }
            const json = await response.json();
            setMeasurements(json);
        }
        catch(err){
            console.log("err", err)
        }

    }
    const deleteMeasurement = async (measurementId) => {
        if(!confirm("Are you sure you want to delete this measurement?")){
            return;
        }
        
        try{
            const response = await fetch(API_URL + "measurements/" + measurementId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            if(response.status === 401){
                navigate('/login');
            }
            const json = await response.json();
            loadLocation();
        }
        catch(err){
            console.log("err", err)
        }

    }


    return (
        <div>
            <h1>Location {locationName}</h1>
            <FaArrowLeft className="icon" onClick={() => navigate("/location")}>Back</FaArrowLeft>
            <ul>
                { 
                /* measurements is an object with an array for each key */
                Object.keys(measurements).map((parameterName) => {
                    return (
                        <li key={parameterName}>
                            {parameterName}
                            <ul>
                                {measurements[parameterName].map((measurement) => {
                                    return (
                                        <li key={measurement._id}>
                                            {measurement.color &&
                                            <span style={{backgroundColor: `rgba(${measurement.color.r},${measurement.color.g},${measurement.color.b},${measurement.color.a})`,width:"20px",height:"20px",display:"inline-block"}}></span>
                                            }
                                            {measurement.value} | 
                                            {new Date(measurement.date).toDateString()}
                                            <button onClick={()=>deleteMeasurement(measurement._id)}>Delete</button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>
                    )
                })
                }
            </ul>
        </div>
    );
}

export default LocationViewer;