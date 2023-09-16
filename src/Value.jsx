import { useState } from "react";

const Value = ({ value, onValueChange, onValueDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newValue, setNewValue] = useState(value.value);

    const handleValueChange = (e) => {
        let value = e.target.value;
        
        setNewValue(Number(value));
    }
    return (
        <div>
        {isEditing ? (
            <form style={{backgroundColor:value.color.toString()}} onSubmit={(e) => {
                e.preventDefault();
                onValueChange(value, newValue);
                setIsEditing(false);
            }}>
                <input type="number" step="0.01" lang="en" value={newValue} onChange={handleValueChange} autoFocus/>
                <button type="submit">Save</button>
            </form>

        ) : (
            <p style={{ backgroundColor: value.color.toString() }}>
                {value.color.toString()}: {value.value}
            </p>
        )
        }
            
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onValueDelete(value)}>Delete</button>
        </div>
    )
}

export default Value;