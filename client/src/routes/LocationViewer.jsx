import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FaArrowLeft, FaTrash } from 'react-icons/fa6';
import HorizontalSelector from '../components/HorizontalSelector';

const LocationViewer = () => {
    const [location, setLocation] = useState({});
    const [measurements, setMeasurements] = useState([]);
    const [selectedParameter, setSelectedParameter] = useState(null);
    const [parameters, setParameters] = useState([]);
    const { locationName } = useParams();
    const navigate = useNavigate();
    const webLocation = useLocation();

    useEffect(() => {
        loadLocation();
    }
        , [locationName]);
    useEffect(() => {
        setParameters(Object.keys(measurements));
        setSelectedParameter(Object.keys(measurements)[0]);
    }, [measurements]);


    const loadLocation = async () => {
        try {
            const response = await fetch(API_URL + "measurements/location/" + locationName, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            if (response.status === 401) {
                navigate('/login');
            }
            const json = await response.json();
            setMeasurements(json);
        }
        catch (err) {
            console.log("err", err)
        }

    }
    const deleteMeasurement = async (measurementId) => {
        if (!confirm("Are you sure you want to delete this measurement?")) {
            return;
        }

        try {
            const response = await fetch(API_URL + "measurements/" + measurementId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            if (response.status === 401) {
                navigate('/login');
            }
            const json = await response.json();
            loadLocation();
        }
        catch (err) {
            console.log("err", err)
        }

    }


    return (
        <div>
            <h1>Location {locationName}</h1>
            <FaArrowLeft className="icon" onClick={() => navigate("/location")}>Back</FaArrowLeft>
            {parameters && <HorizontalSelector
                values={parameters}
                selectedValue={selectedParameter}
                onClick={(value) => setSelectedParameter(value)}
            />
            }


            {
                /* measurements is an object with an array for each key */
                measurements[selectedParameter] &&
                (
                    <li key={selectedParameter}>
                        <b>{selectedParameter}</b>
                        <table>
                            <thead>
                                <tr>
                                    <th>Value</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {measurements[selectedParameter].map((measurement) => {
                                    return (
                                        <tr key={measurement._id}>
                                            <td>
                                                {measurement.color &&
                                                    <span className="colorSpan" style={{ backgroundColor: `rgba(${measurement.color.r},${measurement.color.g},${measurement.color.b},${measurement.color.a})`, width: "20px", height: "20px", display: "inline-block" }}></span>
                                                }
                                                {measurement.value}
                                            </td>
                                            <td>
                                                {new Date(measurement.date).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <FaTrash className="icon" onClick={() => deleteMeasurement(measurement._id)} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </li>
                )

            }

        </div >
    );
}

export default LocationViewer;