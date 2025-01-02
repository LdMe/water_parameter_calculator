import { useReducer } from "react";
import Color from "../../utils/color";
import ColorCircle from "./ColorCircle";
import ColorPicker from "./ColorPicker";
import colorPickerReducer from "../../reducers/colorPicker/colorPickerReducer";

function ColorCalculator({onSelectColor}) {
    const [state, dispatch] = useReducer(colorPickerReducer, {
        selectedColor: null,
        selectedWhite: { r: 255, g: 255, b: 255, a: 255 },
        selectingWhite: false,
        selectedValue: 0,
    });

    const {
        selectedColor,
        selectedWhite,
        selectingWhite,
        selectedValue,
    } = state;

    const handleSelectColor = (color) => {
        console.log("color",color)
        if(selectingWhite) {
            dispatch({ type: "SET_WHITE", payload: color });
            return;
        }
        const correctedColor = new Color(
            color.r,
            color.g,
            color.b,
            color.a
        ).correctWhite(selectedWhite);
        dispatch({ type: "SET_COLOR", payload: correctedColor });
        onSelectColor(correctedColor);
    };

    const handleToggleWhiteSelection = () => {
        dispatch({ type: "TOGGLE_WHITE_SELECTION" });
    };

    const handleResetWhite = () => {
        dispatch({ type: "RESET_WHITE" });
    };

    const handleSetValue = (value) => {
        dispatch({ type: "SET_VALUE", payload: value });
    };

    return (
        <section className="color-editor">
            <ColorPicker onClick={handleSelectColor} isPicking={true} />

            <section className="whiteColorPicker">
                <ColorCircle
                    color={selectedWhite}
                    className="parameter-color-white"
                />
                <button onClick={handleToggleWhiteSelection}>
                    {selectingWhite ? "Seleccionando" : "Selecciona un punto blanco"}
                </button>
                <button onClick={handleResetWhite}>
                    Limpiar
                </button>
            </section>

            
        </section>
    )
}

export default ColorCalculator