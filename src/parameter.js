import Color from './color.js';

class Parameter {
    constructor(name,white = new Color(255,255,255,255),values = []) {
        this.name = name;
        this.white = white;
        this.values = values;
    }
    addValue(color, value,correct=true) {
        if(correct){
            color = this.correctWhite(color);

        }
        this.values.push(new Value(color, value));
    }
    addValues(values,correct=true) {
        console.log("values: ");
        console.log(values);
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
        console.log("this values");
        console.log(this.values);
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
        /* 
        * this function calculates the value of a color based on the value of the closest color in the parameter
        * the value of the color is calculated by the following formula:
        * value = value of closest color + (distance to closest color / distance to second closest color) * (value of second closest color - value of closest color)
        * this formula is used to make sure that the value of the color is not too far off from the value of the closest color
        */
       if(! (color instanceof Color)) {
              console.log(color);   
              color = new Color(color.color.r,color.color.g,color.color.b);
       } 
        if(correct){
            color = this.correctWhite(color);
        }
        const closestColor = this.getClosestColorValue(color);
        console.log("closest color: ");
        console.log(closestColor);
        const secondClosestColor = this.getSecondClosestColorValue(color);
        console.log("second closest color: ");
        console.log(secondClosestColor);

        const distanceToClosestColor = color.getDistance(closestColor.color);
        console.log("distance to closest color: " + distanceToClosestColor);
        const distanceToSecondClosestColor = color.getDistance(secondClosestColor.color);
        console.log("distance to second closest color: " + distanceToSecondClosestColor);
        const valueOfClosestColor = closestColor.value;
        const valueOfSecondClosestColor = secondClosestColor.value;
        console.log("value of closest color: " + valueOfClosestColor);
        console.log("value of second closest color: " + valueOfSecondClosestColor);

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
    setWhite(color) {
        this.white = color;
    }

    correctWhite(color) {
      const originalWhite = new Color(255,255,255,255);
      /* 
      * the white color from the image can be a little off from the original white
      * this function gets the difference between the original white and the white from the image
      * and adds that difference to the color
      */
      const whiteDifference = originalWhite.subtract(this.white);
      return color.add(whiteDifference);
    }

    getColors() {
        return this.values.map(v => v.color);
    }
    static loadParametersFromJSON(json) {
        /* convert array of objects to array of parameters */

        const parameters = [];
        for (const parameter of json) {
            const values = [];
            for (const value of parameter.values) {
                values.push(new Value(new Color(value.color.r,value.color.g,value.color.b), value.value));
            }
            parameters.push(new Parameter(parameter.name, new Color(parameter.white.r,parameter.white.g,parameter.white.b), values));
        }
        return parameters;
    }


}

class Value {
    constructor(color, value) {
        this.color = color;
        this.value = parseFloat(value);
        console.log("value: " + this.value);
    }
}

export default Parameter;