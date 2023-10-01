import {createContext} from 'react';

const LocationContext = createContext({
    locations:[],
    setLocations: () => {}
});

export default LocationContext;