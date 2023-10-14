
const colorToString = (color) => {
    return `rgb(${color.r}, ${color.g}, ${color.b})`
}
const ColorGradient = ({ colors }) => {
    const getColorGradientHtml = () => {
        let html = <div className="color-gradient">
            {colors.sort((a,b) => a.value -b.value).map((color,index) => {
                return (
                index !== colors.length - 1 ?
                <div key={index}>
                    <div style={{ backgroundColor: colorToString(color.color) }} className="color-value" >{color.value}</div>
                    <div className="color-gradient-separator color-value" style={{backgroundImage: `linear-gradient(to right, ${colorToString(color.color)}, ${colorToString(colors[index + 1].color)})`
                }}>-</div>
                </div>
                :
                <div key={index} style={{ backgroundColor: colorToString(color.color) }} className="color-value" >{color.value}</div>
                
                )
            })}
        </div>
        return html
    }
    return getColorGradientHtml()
}

export default ColorGradient