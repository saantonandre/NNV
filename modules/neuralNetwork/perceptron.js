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

        /** The perceptron's bias (defaults to a random number between 0 and 1)
         * @type {Number}
         */
        this.bias = Math.random();
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

    /** Applies the activation function to the sum */
    activation() {
        this.computedOutput = sigmoid(this.sum);
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
    createLink(perceptronR) {
        let link = new Link(this, perceptronR);
        this.forwardLinks.push(link);
        perceptronR.backwardLinks.push(link);
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
        this.weight = 1;

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