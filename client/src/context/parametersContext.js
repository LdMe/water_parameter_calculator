import {createContext} from 'react';

const ParametersContext = createContext({
    parameters:[],
    setParameters: () => {}
});

export default ParametersContext;