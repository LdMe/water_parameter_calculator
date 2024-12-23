import { useState } from "react"
function ParameterTypeChooser({selectedIndex,onClick}) {
    return (
        <div className="parameter-type-chooser">
            <h2>Tipo de  Parámetro</h2>
            <div className="parameter-type-chooser__options">
                <div className={"parameter-type-chooser__option " + (selectedIndex === 0 ? "selected" : "")} onClick={() => onClick(true)}>
                    <div className="parameter-type-chooser__option__title" >
                        <span className="parameter-type-chooser__option__icon color-icon"></span>
                        <h3 className="">Basado en Color</h3>
                    </div>
                    <p className="">Para tiras reactivas o tests colorimétricos</p>

                </div>
                <div className={"parameter-type-chooser__option " + (selectedIndex === 1 ? "selected" : "")} onClick={() => onClick(false)}>
                    <div className="parameter-type-chooser__option__title" >
                        <span className="parameter-type-chooser__option__icon numeric-icon"> 123</span>
                        <h3 className="">Valor Numérico</h3>
                    </div>
                    <p className="">Para mediciones directas sin color</p>

                </div>
            </div>
        </div>

    )
}

export default ParameterTypeChooser