import { useMemo } from "react";
import Parameter from "../../parameter";
import ColorCircle from "../color/ColorCircle";

function MeasurementCalculator({parameter,color}){
    const newParameter = useMemo(() => new Parameter(parameter.name,parameter.colors), [parameter]);
    console.log("color",color)
    const value = newParameter.calculateValue(color);
    return (
        <div>
            <ColorCircle color={color} />
            <p>{parameter.name}: {value}</p>
        </div>
    );
}

export default MeasurementCalculator;