import Color from './color.js';

class Parameter {
    constructor(name,white = new Color(255,255,255,255),values = []) {
        this.name = name;
        this.white = white;
        this.values = values;
        this.isColor = true;
    }
    addValue(color, value,correct=true) {
        if(correct){
            color = this.correctWhite(color);

        }
        this.values.push(new Value(color, value));
    }
    addValues(values,correct=true) {
        values.forEach(value => this.addValue(new Color(value.color.r,value.color.g,value.color.b), value.value,correct));
    }
    getValues() {
        const values =  this.values.slice().sort((a,b) => {
            const indexA = this.values.indexOf(a);
            const indexB = this.values.indexOf(b);
            const value = a.value - b.value;
            if (value == 0) {
                return indexB - indexA;
            }
            return value;
        });
        return values;
    }
    getClosestColorValue(color) {
        return this.values.reduce((prev, curr) => {
            if (curr.color.getDistance(color) < prev.color.getDistance(color)) {
                return curr;
            }
            return prev;
        });
    }
    getSecondClosestColorValue(color) {
        const closestColor = this.getClosestColorValue(color);
        return this.values.reduce((prev, curr) => {
            if (curr.color.getDistance(color) < prev.color.getDistance(color) && curr.color != closestColor.color) {
                return curr;
            }
            return prev;
        });
    }
    calculateValue(color,correct=true) {
       if(! (color instanceof Color)) { 
              color = new Color(color.color.r,color.color.g,color.color.b);
       } 
        if(correct){
            color = this.correctWhite(color);
        }
        const closestColor = this.getClosestColorValue(color);
        const secondClosestColor = this.getSecondClosestColorValue(color);
        const distanceToClosestColor = color.getDistance(closestColor.color);
        const distanceToSecondClosestColor = color.getDistance(secondClosestColor.color);
        const valueOfClosestColor = closestColor.value;
        const valueOfSecondClosestColor = secondClosestColor.value;
        if(distanceToSecondClosestColor == 0) return valueOfClosestColor;
        const value = valueOfClosestColor + (distanceToClosestColor / distanceToSecondClosestColor) * (valueOfSecondClosestColor - valueOfClosestColor);
        return value;
    }
    getName() {
        return this.name;
    }
    deleteValue(color) {
        this.values = this.values.filter(v => v.color != color);
    }
    getValue(color) {
        return this.values.find(v => v.color == color);
    }
    setValue(color, value) {
        this.getValue(color).value = value;
    }
    setColor(color, newColor) {
        this.getValue(color).color = newColor;
    }
    setWhite(color) {
        this.white = color;
    }

    correctWhite(color) {
      const originalWhite = new Color(255,255,255,255);
      const whiteDifference = originalWhite.subtract(this.white);
      return color.add(whiteDifference);
    }

    static loadParametersFromJSON(json) {
        const parameters = [];
        for (const parameter of json) {
            const values = [];
            if(parameter === null) continue;
            if(parameter.values == undefined) {
                if(parameter.colors){
                    parameter.values = parameter.colors;
                }
                else {
                    parameter.values = [];
                }
            }
            for (const value of parameter.colors) {
                values.push(new Value(new Color(value.color.r,value.color.g,value.color.b), value.value));
            }
            const newParameter = new Parameter(parameter.name);
            newParameter.isColor = parameter.isColor;
            newParameter.addValues(values);
            parameters.push(newParameter);
        }
        return parameters;
    }


}

class Value {
    constructor(color, value) {
        this.color = color;
        this.value = parseFloat(value);
    }
}

export default Parameter;