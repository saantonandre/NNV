import { sigmoid, dsigmoid } from './math.js';

/** 
 * A single perceptron. 
 * It will: 
 * - Receive/handle the inputs through the links
 * - Process them with its activation function
 * - Send it to its links on the opposite side
 */
export class Perceptron {
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
     * Given the direction of incoming inputs, computes the sum of the product of each value times the weigths
     * 
     * @param {'backward' | 'forward'} [direction] The direction of the links
     */
    computeSum(direction = 'forward') {
        this.sum = 0;
        switch (direction) {
            case 'forward':
                this.backwardLinks.forEach(link => {
                    this.sum += link.carriedValue * link.weight;
                })
                break;
        }
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
        this.sum += this.bias;
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
     * Sends the output through each link towards a given direction
     * @param {'backward' | 'forward'} [direction] = The direction of the links, defaults to 'forward'
     */
    sendOutput(direction = 'forward') {
        switch (direction) {
            case 'backward':
                this.backwardLinks.forEach(link => {
                    link.carriedValue = this.computedOutput;
                })
                break;
            case 'forward':
                this.forwardLinks.forEach(link => {
                    link.carriedValue = this.computedOutput;
                })
                break;
        }
    }
    /**
     * Computes the errors and tweaks the weights, relatively to a target or to the forward weights
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

        /** 
         * Carried input
         * @type {Number}
         */
        this.carriedValue = 0;

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