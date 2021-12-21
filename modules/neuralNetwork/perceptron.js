import { sigmoid, dsigmoid } from './math.js';

/** 
 * 
 */
class Perceptron {
    constructor() {

        /** References to the forward layer's perceptrons 
         * @type {Perceptron[]}
         */
        this.forwardLinks = [];

        /** References to the backward layer's perceptrons 
         * @type {Perceptron[]}
         */
        this.backwardLinks = [];

        /** Result of the matrix dot product
         * @type {Number}
         */
        this.sum = 0;

        /** The computed output (will get sent to forward perceptrons) 
         * @type {Number}
         */
        this.output = 0;

        /** The perceptron's bias 
         * @type {Number}
         */
        this.bias = Math.random();
    }
    /** Applies the activation function to the sum */
    activationFunction() {
        this.computedOutput = sigmoid(this.sum);
    }


}

/** Represents a link between two perceptrons */
class Link {
    /**
     * Creates a link between two perceptrons
     * @param {Perceptron} perceptronA 
     * @param {Perceptron} perceptronB 
     */
    constructor(perceptronA, perceptronB) {
        /**
         * Input multiplier
         * @type {Number}
         */
        this.weight = 1;
    }
}

/** A neural network layer */
export class Layer {
    constructor() {
        /**
         * Collection of Perceptrons
         * @type {Perceptron[]}
         */
        this.nodes = [];
    }

    /** Initializes the layer by adding a specified amount of perceptrons
     *  
     * @param {Number} amount Amount of perceptrons
     */
    initialize(amount) {
        for (let i = 0; i < amount; i++) {
            this.nodes.push(new Perceptron());
        }
    }
    /** Computes the sum (dot product) of each perceptron times the weights
     * 
     * @param {Perceptron} perceptron A perceptron where to send 
     */
    dotProduct(perceptron) {
        this.computedOutput = sigmoid(this.sum);
    }
}