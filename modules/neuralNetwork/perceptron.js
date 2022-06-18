// import { sigmoid, dsigmoid } from './math.js';
importScripts("./modules/neuralNetwork/math.js")


/** 
 * A single perceptron. 
 * It will: 
 * - Receive/handle the inputs through the links
 * - Process them with its activation function
 * - Send it to its links on the opposite side
 */
class Perceptron {
    constructor() {

        /** Links connected to the forward layer's perceptrons 
         * @type {Link[]}
         */
        this.forwardLinks = [];

        /** Links connected to the backward layer's perceptrons 
         * @type {Link[]}
         */
        this.backwardLinks = [];

        /** Result of the sums
         * @type {Number}
         */
        this.sum = 0;

        /** The computed output (will get sent to forward perceptrons) 
         * @type {Number}
         */
        this.computedOutput = 0;

        /** The perceptron's bias
         * @type {Number}
         */
        this.bias = 0;


        /** The latest error made by this perceptron
         * @type {Number}
         */
        this.error = 0;
    }

    /** 
     * Computes the sum of the product of each backward value times the link weigths
     */
    computeSum() {
        this.sum = 0;
        this.backwardLinks.forEach(link => {
            this.sum += link.backward.computedOutput * link.weight;
        })
    }

    /** 
     * @returns {Number} The result of this computed sum passed through the activation function 
     */
    activation() {
        // Activation function here
        return sigmoid(this.sum);
    }

    /** 
     * @returns {Number} The result of this computed sum passed through the deactivation function 
     */
    deactivation() {
        // Deactivation function here
        return dsigmoid(this.computedOutput);
    }

    /** Resets the links */
    resetLinks() {
        this.forwardLinks = [];
        this.backwardLinks = [];
    }

    /** Adds this perceptron's bias to its sum */
    addBias() {
        this.sum += this.bias * this.backwardLinks.length;
    }

    /** 
     * Creates a new link between this perceptron and another one in the right direction.
     * @param {Perceptron} perceptron A given perceptron to link to
     * 
     */
    createLink(perceptron) {
        let link = new Link(this, perceptron);
        this.forwardLinks.push(link);
        perceptron.backwardLinks.push(link);
    }

    /**
     * Computes the errors and tweaks the weights, relatively to a target or to the forward weights
     * 
     * NOTE: Requires a target parameter, but only the input layer will use it.
     * Other layers will take a share of the forward errors.
     * @param {Number} target 
     * @returns {Number} this.error
     */
    computeError(target) {
        this.error = 0;
        if (this.forwardLinks.length === 0) {
            this.error = target - this.computedOutput;
        } else {
            this.forwardLinks.forEach(link => {
                this.error += link.weight * link.forward.error;
            });
        }
        return this.error;
    }

    /** 
     * Tweaks the bias and weights relatively to this.error 
     * @param {Number} learningRate
     */
    tweak(learningRate) {
        let gradient = this.deactivation() * this.error * learningRate;
        this.bias += gradient;
        this.backwardLinks.forEach(link => {
            link.weight += gradient * link.backward.computedOutput;
        })
    }

}





/** 
 * Represents a link between two perceptrons.
 *  
 * There is a link abstraction solely to serve rendering functions of this model.
 */
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
        this.weight = 0.5;

        /** Left end of the link 
         * @type {Perceptron}
         */
        this.backward = perceptronA;

        /** Right end of the link 
         * @type {Perceptron}
         */
        this.forward = perceptronB;
    }
}

// export {Perceptron, Link}