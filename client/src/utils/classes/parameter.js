import Color from './color.js';
import ColorValue from './ColorValue.js';
import WhiteBalanceHandler from './WhiteBalanceHandler.js';

/**
 * Representa un parámetro medible que puede estar basado en color o no.
 * Gestiona la relación entre colores y valores, y proporciona métodos
 * para calcular valores basados en colores de entrada.
 */
class Parameter {
    /**
     * Crea una nueva instancia de Parameter
     * @param {string} name - Nombre del parámetro
     * @param {Array} values - Array inicial de valores (opcional)
     */
    constructor(name, values = []) {
        if (!name || typeof name !== 'string') {
            throw new Error('El nombre del parámetro es requerido y debe ser una cadena');
        }

        this.name = name;
        this.whiteBalance = new WhiteBalanceHandler();
        this.values = new Map();
        this.hasColor = true;
        
        if (values.length > 0) {
            this.addValues(values);
        }
    }

    /**
     * Añade un nuevo valor de color al parámetro
     * @param {Color} color - El color a añadir
     * @param {number} value - El valor asociado al color
     * @param {boolean} correct - Si se debe aplicar corrección de balance de blancos
     */
    addValue(color, value, correct = true) {
        // Validación de entrada
        if (!color || typeof value !== 'number' || isNaN(value)) {
            throw new Error('Color y valor son requeridos y valor debe ser un número');
        }

        // Asegurar que el color es una instancia de Color
        let colorInstance = color instanceof Color ? color : new Color(color.r, color.g, color.b);
        
        if (correct) {
            colorInstance = this.whiteBalance.correctColor(colorInstance);
        }

        const colorValue = new ColorValue(colorInstance, value);
        const key = `${colorInstance.r}-${colorInstance.g}-${colorInstance.b}`;
        this.values.set(key, colorValue);
    }

    /**
     * Añade múltiples valores de color al parámetro
     * @param {Array} values - Array de objetos {color, value}
     * @param {boolean} correct - Si se debe aplicar corrección de balance de blancos
     */
    addValues(values, correct = true) {
        values.forEach(value => {
            const color = new Color(value.color.r, value.color.g, value.color.b);
            this.addValue(color, value.value, correct);
        });
    }

    /**
     * Calcula el valor para un color dado usando interpolación ponderada
     * @param {Color} color - El color para el que calcular el valor
     * @returns {number} El valor calculado
     */
    calculateValue(color) {
        if (!(color instanceof Color)) {
            color = new Color(color.color.r, color.color.g, color.color.b);
        }

        // Obtener los 3 colores más cercanos para mejor interpolación
        const closestColors = this.getNClosestColors(color, 3);
        
        if (closestColors.length === 0) {
            throw new Error('No hay valores de referencia para calcular');
        }

        // Si solo hay un color cercano, devolver su valor
        if (closestColors.length === 1) {
            return closestColors[0].value;
        }

        // Cálculo ponderado basado en distancias inversas
        let totalWeight = 0;
        let weightedSum = 0;

        closestColors.forEach(({color: refColor, value, distance}) => {
            // Usar el inverso de la distancia como peso
            const weight = 1 / (distance + Number.EPSILON);
            weightedSum += value * weight;
            totalWeight += weight;
        });

        return weightedSum / totalWeight;
    }

    /**
     * Obtiene los N colores más cercanos a un color dado
     * @param {Color} targetColor - El color objetivo
     * @param {number} n - Número de colores cercanos a obtener
     * @returns {Array} Array de objetos con color, valor y distancia
     */
    getNClosestColors(targetColor, n) {
        return Array.from(this.values.values())
            .map(colorValue => ({
                color: colorValue.color,
                value: colorValue.value,
                distance: colorValue.color.getDistance(targetColor)
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, n);
    }

    /**
     * Elimina un valor de color del parámetro
     * @param {Color} color - El color a eliminar
     */
    deleteValue(color) {
        const key = `${color.r}-${color.g}-${color.b}`;
        this.values.delete(key);
    }

    /**
     * Obtiene todos los valores ordenados por valor
     * @returns {Array} Array ordenado de valores
     */
    getValues() {
        return Array.from(this.values.values())
            .sort((a, b) => a.value - b.value);
    }

    /**
     * Serializa el parámetro a un objeto simple
     * @returns {Object} El objeto serializado
     */
    toJSON() {
        return {
            name: this.name,
            hasColor: this.hasColor,
            white: this.whiteBalance.toJSON(),
            values: Array.from(this.values.values()).map(colorValue => colorValue.toJSON())
        };
    }

    /**
     * Crea una instancia de Parameter desde un objeto serializado
     * @param {Object} json - El objeto serializado
     * @returns {Parameter} Una nueva instancia de Parameter
     */
    static fromJSON(json) {
        if (!json || !json.name) {
            throw new Error('JSON inválido para crear un Parameter');
        }

        const parameter = new Parameter(json.name);
        parameter.hasColor = json.hasColor;
        
        if (json.white) {
            parameter.whiteBalance = WhiteBalanceHandler.fromJSON(json.white);
        }

        if (json.values) {
            json.values.forEach(value => {
                const colorValue = ColorValue.fromJSON(value);
                parameter.addValue(colorValue.color, colorValue.value, false);
            });
        }

        return parameter;
    }

    /**
     * Carga múltiples parámetros desde un array de objetos JSON
     * @param {Array} json - Array de objetos JSON de parámetros
     * @returns {Array} Array de instancias de Parameter
     */
    static loadParametersFromJSON(json) {
        if (!Array.isArray(json)) {
            throw new Error('Se espera un array de parámetros');
        }

        return json
            .filter(parameter => parameter !== null)
            .map(parameter => Parameter.fromJSON(parameter));
    }
}

export default Parameter;