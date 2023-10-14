import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaDownload } from 'react-icons/fa6';
import HorizontalSelector from '../components/HorizontalSelector';
import { getMeasurementsByLocation, deleteMeasurement as deleteMeasurementApi } from '../utils/fetchMeasurement';

import '../styles/Locations.scss'

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
        const response = await getMeasurementsByLocation(locationName);

        const { data, error, code } = response;
        if (error !== null) {
            
            if (code === 401) {
                navigate('/login');
            }
        }
        else {
            
            setMeasurements(data);
        }
    }
    const downloadMeasurementsAsJson = () => {
        const element = document.createElement("a");
        
        const data = [];
        for (const parameter in measurements) {
            
            const parameterObject = {
                name: parameter,
                values: []
            }
            parameterObject.values = measurements[parameter].map((measurement) => {
                return {
                    value: measurement.value,
                    date: measurement.date,
                    color: measurement.color
                }
            });
            data.push(parameterObject);
        }
        const file = new Blob([JSON.stringify(data)], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${locationName}.json`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
    const deleteMeasurement = async (measurementId) => {
        if (!confirm("Are you sure you want to delete this measurement?")) {
            return;
        }
        const response = await deleteMeasurementApi(measurementId);
        const { data, error, code } = response;
        if (error !== null) {
            
            if (code === 401) {
                navigate('/login');
            }
        }
        else {
            
            loadLocation();
        }

    }


    return (
        <div>
            <h1>Location {locationName}</h1>
            <section className="buttonSection">
                <FaArrowLeft className="icon" onClick={() => navigate("/location")}>Back</FaArrowLeft>
                <FaDownload className="icon" onClick={downloadMeasurementsAsJson}>Download</FaDownload>
            </section>
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