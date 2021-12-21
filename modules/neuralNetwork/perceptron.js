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
        this.output = 0;

        /** The perceptron's bias (defaults to a random number between 0 and 1)
         * @type {Number}
         */
        this.bias = Math.random();
    }
    /** 
     * Given the direction of incoming inputs, computes the sum of the product of each value times the weigths
     * 
     * @param {'left' | 'right'} [from] The direction of the links
     */
    computeSum(from = 'left') {
        this.sum = 0;

        this.backwardLinks.forEach(link => {
            this.sum += link.carriedValue * link.weight;
        })
    }

    /** Applies the activation function to the sum */
    activationFunction() {
        this.computedOutput = sigmoid(this.sum);
    }

    /** Resets the links */
    resetLinks() {
        this.forwardLinks = [];
        this.backwardLinks = [];
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
     * 
     * @param {'left' | 'right'} [to] The direction of the links
     */
    sendOutput(to = 'right') {
        switch (to) {
            case 'left':
                this.backwardLinks.forEach(link => {
                    link.value = this.output;
                })
                break;
            case 'right':
                this.forwardLinks.forEach(link => {
                    link.value = this.output;
                })
                break;
        }
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

        /** 
         * Carried input
         * @type {Number}
         */
        this.carriedValue = 0;

        /** Left end of the link 
         * @type {Perceptron}
         */
        this.left = perceptronA;

        /** Right end of the link 
         * @type {Perceptron}
         */
        this.right = perceptronB;
    }
}