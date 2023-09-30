import { useEffect, useState } from "react";

const Value = ({ value, onValueChange, onValueDelete ,autoFocus=false}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newValue, setNewValue] = useState(value.value);

    const handleValueChange = (e) => {
        let tempValue = Number(e.target.value);

        setNewValue(tempValue);
        onValueChange(value, tempValue);
    }
    useEffect(() => {
    }, [value])

    return (
        <div>
            <span style={{ display:"inline-block",width:"25px",height:"25px",backgroundColor: value.color ? value.color.toString(): "white"}}></span>
            
                <input type="number" step="0.01" lang="en" value={newValue} onChange={handleValueChange} 
                {...autoFocus && {autoFocus:true}}
                />
                



            <button onClick={() => onValueDelete(value)}>Delete</button>
        </div>
    )
}

export default Value;