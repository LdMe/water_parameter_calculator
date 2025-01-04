import { useReducer } from "react";
import Color from "../../utils/color";
import ColorCircle from "./ColorCircle";
import ColorPicker from "./ColorPicker";
import colorPickerReducer from "../../reducers/colorPicker/colorPickerReducer";
import { FaArrowRotateRight, FaEyeDropper } from "react-icons/fa6";
import TextWithInfo from "../text/TextWithInfo";

function ColorCalculator({ onSelectColor }) {
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
        console.log("color", color)
        if (selectingWhite) {
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

            <section className="white-color-picker">
                <TextWithInfo
                    text="Selecciona un punto blanco"
                    autoCloseTime={null}
                >
                    <div className="white-color-picker__info">
                        <p>
                            Ayuda a mejorar las mediciones en fotos oscuras o con luz artificial. Haz click en el botón <FaEyeDropper /> para seleccionar un punto blanco en la imagen. Puedes reestablecerlo con el botón <FaArrowRotateRight />.
                        </p>

                    </div>
                </TextWithInfo>
                <section className="white-color-picker__selector">
                    <ColorCircle
                        color={selectedWhite}
                        className="parameter-color-white"
                    />
                    <button onClick={handleToggleWhiteSelection} className={`white-color-picker__button ${selectingWhite ? "selected" : ""}`}>
                        <FaEyeDropper />
                    </button>
                    <button className="white-color-picker__button" onClick={handleResetWhite}>
                        <FaArrowRotateRight />
                    </button>
                </section>
            </section>


        </section>
    )
}

export default ColorCalculator