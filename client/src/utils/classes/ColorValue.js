import Color from './color.js';

/**
 * Representa un valor asociado a un color específico.
 * Esta clase encapsula la relación entre un color y su valor numérico correspondiente.
 */
class ColorValue {
    /**
     * Crea una nueva instancia de ColorValue
     * @param {Color} color - El color asociado al valor
     * @param {number} value - El valor numérico asociado al color
     */
    constructor(color, value) {
        if (!(color instanceof Color)) {
            throw new Error('El color debe ser una instancia de la clase Color');
        }
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('El valor debe ser un número válido');
        }

        this.color = color;
        this.value = parseFloat(value);
    }
    
    /**
     * Calcula la distancia entre este color y otro
     * @param {ColorValue} otherColorValue - El otro ColorValue para comparar
     * @returns {number} La distancia entre los dos colores
     */
    getDistance(otherColorValue) {
        if (!(otherColorValue instanceof ColorValue)) {
            throw new Error('El parámetro debe ser una instancia de ColorValue');
        }
        return this.color.getDistance(otherColorValue.color);
    }

    /**
     * Serializa la instancia a un objeto simple
     * @returns {Object} Un objeto con las propiedades color y value
     */
    toJSON() {
        return {
            color: {
                r: this.color.r,
                g: this.color.g,
                b: this.color.b,
                a: this.color.a
            },
            value: this.value
        };
    }

    /**
     * Crea una instancia de ColorValue desde un objeto simple
     * @param {Object} json - El objeto con los datos serializados
     * @returns {ColorValue} Una nueva instancia de ColorValue
     */
    static fromJSON(json) {
        const color = new Color(
            json.color.r,
            json.color.g,
            json.color.b,
            json.color.a
        );
        return new ColorValue(color, json.value);
    }
}

export default ColorValue;