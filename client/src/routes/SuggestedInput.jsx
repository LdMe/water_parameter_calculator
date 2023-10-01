

const SuggestedInput = ({suggested, onChange, value, ...props}) => {
    

    return (
        <div className="suggestedInput">
            <input type="text" value={value} onChange={onChange} {...props} />
            <div className="suggested">
                {suggested.map((s,i) => <div key={i} className="suggestion" onClick={() => onChange({target: {value: s}})}>{s}</div>)}
            </div>
        </div>
    )
}

export default SuggestedInput;