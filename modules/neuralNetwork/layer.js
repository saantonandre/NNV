import { Perceptron } from './perceptron.js';
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
     * Initializes the links towards a given layer
     *  
     * @param {Layer} layer Amount of perceptrons
     */
    link(layer) {
        // Links each perceptron of this layer to each perceptron of the given layer
        this.nodes.forEach(perceptronA => {
            layer.nodes.forEach(perceptronB => {
                perceptronA.createLink(perceptronB);
            })
        })
    }

    /** 
     * For each perceptron, adds its bias to its sum
     *  
     * @param {Layer} layer Amount of perceptrons
     */
    applyBias(layer) {
        // Links each perceptron of this layer to each perceptron of the given layer
        this.nodes.forEach(perceptron => {
            perceptron.addBias();
        })
    }
    /** 
     * Sets this nodes output values to a specific amount.
     * 
     * Values length must be the same amount as the length of this nodes
     * 
     * @param {Number[]} values The values to assign to this layer's perceptrons
     */
    set(values) {
        if (values.length !== this.nodes.length) {
            throw new Error("Values amount must be the same as the amount of perceptrons");
        }
        // Links each perceptron of this layer to each perceptron of the given layer
        this.nodes.forEach((perceptron, i) => {
            perceptron.computedOutput = values[i];
        })
    }

    /** 
     * Sends the values inside a layer to a given direction
     * 
     * @param {'backward' | 'forward'} direction The direction of the links
     */
    sendOutputs(direction = 'forward') {
        this.nodes.forEach(perceptron => {
            perceptron.sendOutput(direction);
        })
    }

    /** 
     * Collects and sums the values of the backward links
     * 
     * @param {'backward' | 'forward'} direction The direction of the links
     */
    computeSum(direction = 'forward') {
        this.nodes.forEach(perceptron => {
            perceptron.computeSum(direction);
        })
    }
    /** 
     * Collects and sums the values of the backward links
     * 
     * @param {'backward' | 'forward'} direction The direction of the links
     */
    activation() {
        this.nodes.forEach(perceptron => {
            perceptron.activation();
        })
    }
}