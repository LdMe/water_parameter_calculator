import { useEffect, useState } from "react";
import {FaTrash} from "react-icons/fa6";
import Color from "../color";
import {SketchPicker} from 'react-color';

const Value = ({ value, onValueChange, onColorChange,onValueDelete ,autoFocus=false}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newValue, setNewValue] = useState(value.value);
    const [openPicker,setOpenPicker] = useState(false);

    const handleValueChange = (e) => {
        let tempValue = Number(e.target.value);

        setNewValue(tempValue);
        onValueChange(value, tempValue);
    }
    const handleColorChange = (e) => {
        let color = Color.fromHex(e.target.value);
        onColorChange(value, color);
    }
    const handleClick = (e) => {
        e.preventDefault();
        setOpenPicker(true)
    }
    useEffect(() => {
    }, [value])

    return (
        <div className="value">
            
            <input type="color" defaultValue={value.color.toHex()} onChange={handleColorChange}/>
                <input type="number" step="0.01" lang="en" value={newValue} onChange={handleValueChange} 
                {...autoFocus && {autoFocus:true}}
                />
                



            <FaTrash className="icon" onClick={() => onValueDelete(value)} />
        </div>
    )
}

export default Value;