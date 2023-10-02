
import {rgbToCIELab,cie2000} from "colorpare"
class Color {
    constructor(r, g, b, a=255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.correctColor();
    }

    static fromRgbaString(rgbaString) {
        const rgba = rgbaString.match(/rgba\((\d+),(\d+),(\d+),(\d+)\)/);
        return new Color(parseInt(rgba[1]), parseInt(rgba[2]), parseInt(rgba[3]), parseInt(rgba[4]));
    }
    correctColor(){
        if(this.isOutOfBounds() == 1) {
            const maxValue = Math.max(this.r, this.g, this.b);
            const difference = 255 - maxValue;
            this.r += difference;
            this.g += difference;
            this.b += difference;
        }
        if(this.isOutOfBounds() == -1) {
            const minValue = Math.min(this.r, this.g, this.b);
            const difference = minValue;
            this.r += difference;
            this.g += difference;
            this.b += difference;
        }
    }
    isOutOfBounds() {
        if(this.r > 255 || this.g > 255 || this.b > 255 || this.a > 255) {
            return 1;
        }
        if(this.r < 0 || this.g < 0 || this.b < 0 || this.a < 0) {
            return -1;
        }
        return 0;
    }
    add(color2) {
        return new Color(this.r + color2.r, this.g + color2.g, this.b + color2.b, this.a + color2.a);
    }
    subtract(color2) {
        return new Color(this.r - color2.r, this.g - color2.g, this.b - color2.b, this.a - color2.a);
    }
    multiply(color2) {
        return new Color(this.r * color2.r, this.g * color2.g, this.b * color2.b, this.a * color2.a);
    }
    divide(color2) {
        return new Color(this.r / color2.r, this.g / color2.g, this.b / color2.b, this.a / color2.a);
    }
    scale(scalar) {
        return new Color(this.r * scalar, this.g * scalar, this.b * scalar, this.a * scalar);
    }
    invert() {
        return new Color(255 - this.r, 255 - this.g, 255 - this.b, this.a);
    }
    getDistance(color2) {

        const color1 = rgbToCIELab({r:this.r,g:this.g,b:this.b});
        const color2CIE = rgbToCIELab({r:color2.r,g:color2.g,b:color2.b});
        return cie2000(color1,color2CIE);
        /*
        if( ! (color2 instanceof Color)) {
            throw new Error("color2 is not an instance of Color");
        }
        return Math.sqrt(Math.pow(this.r - color2.r, 2) + Math.pow(this.g - color2.g, 2) + Math.pow(this.b - color2.b, 2) + Math.pow(this.a - color2.a, 2));
        */
    }
    getMinDistance(colors) {
        return Math.min(...colors.map(color => this.getDistance(color)));
    }
    toString() {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }
    toHex() {
        return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
    }


}

export default Color;