
import {createContext} from 'react';

const defaultMessage = {
    message: "",
    isError: false
}
const MessageContext = createContext({
    ...defaultMessage,
    setMessage : () => {},
    setError : () => {}
});

export {defaultMessage};
export default MessageContext;