/** A neural network layer */
export class Layer {
    /**
     * Creates a layer with a specified amount of perceptrons
     * @param {Number} perceptronsAmount 
     */
    constructor(perceptronsAmount) {
        /**
         * Collection of Perceptrons
         * @type {Perceptron[]}
         */
        this.nodes = [];

        this.initialize(perceptronsAmount);
    }

    /** 
     * Initializes the layer by adding a specified amount of perceptrons
     *  
     * @param {Number} amount Amount of perceptrons
     */
    initialize(amount) {
        for (let i = 0; i < amount; i++) {
            this.nodes.push(new Perceptron());
        }
    }

    /** 
     * Sends the values to another layer
     * 
     * @param {'left' | 'right'} direction The direction of the links
     */
    sendValues(direction = 'right') {

    }
    /** 
     * Receives the values from another layer
     * 
     * @param {'left' | 'right'} direction The direction of the links
     */
    receiveValues(direction = 'right') {

    }
}