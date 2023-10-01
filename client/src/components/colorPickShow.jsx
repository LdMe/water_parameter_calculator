

const colorPickShow = ({isPickingWhite,setIsPickingWhite,whiteColor,pickedColor}) => {

    return (
        <section className="whiteColorPicker">
            <button onClick={() => setIsPickingWhite(true)} >
                {isPickingWhite ? "Picking" : "Pick white color"}
            </button>
            <span style={{ backgroundColor: whiteColor.toString() }} className="pickedColorSpan"></span>
            <span style={{ backgroundColor: pickedColor.toString() }} className="pickedColorSpan"></span>
        </section>
    )
}

export default colorPickShow