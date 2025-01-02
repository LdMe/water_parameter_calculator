import Color from "../../utils/color";



export function colorPickerReducer(state, action) {
    switch (action.type) {
        case "SET_COLOR":
            
            return {
                ...state,
                selectedColor: action.payload
            };

        case "SET_WHITE":

            return {
                ...state,
                selectedWhite: action.payload,
                selectingWhite: false
            };
        case "RESET_WHITE":
            return {
                ...state,
                selectedWhite: { r: 255, g: 255, b: 255, a: 255 },
                selectingWhite: false
        }
        case "TOGGLE_WHITE_SELECTION":
            return {
                ...state,
                selectingWhite: !state.selectingWhite
            };

        case "SET_VALUE":
            return {
                ...state,
                selectedValue: action.payload
            };

        default:
            return state;
    }
}

export default colorPickerReducer