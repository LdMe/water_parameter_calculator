import Color from './color.js';

/**
 * Maneja la corrección del balance de blancos para los colores.
 * Esta clase se encarga de ajustar los colores basándose en un color de referencia blanco.
 */
class WhiteBalanceHandler {
    /**
     * Crea una nueva instancia del manejador de balance de blancos
     */
    constructor() {
        // Inicializamos con blanco puro como referencia
        this.white = new Color(255, 255, 255, 255);
    }

    /**
     * Establece un nuevo color de referencia para el blanco
     * @param {Color} color - El nuevo color de referencia blanco
     */
    setWhite(color) {
        if (!(color instanceof Color)) {
            throw new Error('El color debe ser una instancia de la clase Color');
        }
        this.white = color;
    }

    /**
     * Corrige un color basándose en el balance de blancos actual
     * @param {Color} color - El color a corregir
     * @returns {Color} El color corregido
     */
    correctColor(color) {
        if (!(color instanceof Color)) {
            throw new Error('El color debe ser una instancia de la clase Color');
        }

        // Si el blanco es puro, no necesitamos corrección
        if (this.isPureWhite()) {
            return color;
        }

        const originalWhite = new Color(255, 255, 255, 255);
        const whiteDifference = originalWhite.subtract(this.white);
        return color.add(whiteDifference);
    }

    /**
     * Verifica si el blanco actual es blanco puro
     * @returns {boolean} true si el blanco actual es puro (255,255,255)
     */
    isPureWhite() {
        return this.white.r === 255 && 
               this.white.g === 255 && 
               this.white.b === 255;
    }

    /**
     * Serializa el estado actual del balance de blancos
     * @returns {Object} Un objeto con el estado serializado
     */
    toJSON() {
        return {
            white: {
                r: this.white.r,
                g: this.white.g,
                b: this.white.b,
                a: this.white.a
            }
        };
    }

    /**
     * Crea una instancia desde un objeto serializado
     * @param {Object} json - El objeto con los datos serializados
     * @returns {WhiteBalanceHandler} Una nueva instancia de WhiteBalanceHandler
     */
    static fromJSON(json) {
        const handler = new WhiteBalanceHandler();
        if (json.white) {
            handler.setWhite(new Color(
                json.white.r,
                json.white.g,
                json.white.b,
                json.white.a
            ));
        }
        return handler;
    }
}

export default WhiteBalanceHandler;