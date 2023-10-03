

const colorPickShow = ({ isPickingWhite, setIsPickingWhite, whiteColor, pickedColor }) => {

    return (
        <section className="whiteColorPicker">
            <button onClick={() => setIsPickingWhite(!isPickingWhite)} >
                {isPickingWhite ? "Picking" : "Pick white color"}
            </button>
            <div className="pickedColorDiv">
                <span style={{ backgroundColor: whiteColor.toString() }} className="pickedColorSpan"></span>
                <span style={{ backgroundColor: pickedColor.toString() }} className="pickedColorSpan"></span>

            </div>
        </section>
    )
}

export default colorPickShow