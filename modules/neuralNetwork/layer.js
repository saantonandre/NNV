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
     * Pushes the computed outputs of each perceptron in an array and returns it
     * @returns {Number[]}
     */
    get values() {
        let layerValues = [];
        this.nodes.forEach(perceptron => { layerValues.push(perceptron.computedOutput) })
        return layerValues;
    }

    /**
     * Returns a matrix representing the weights of each perceptron of this layer
     * @returns {Number[][]}
     */
    get weights() {
        let weightsArr = [];
        this.nodes.forEach(perceptron => {
            let pWeights = [];
            perceptron.forwardLinks.forEach(link => {
                pWeights.push(link.weight);
            })
            weights.push(pWeights);
        })
        return weightsArr;
    }

    /**
     * Returns a matrix representing the weights of each perceptron of this layer
     * @returns {Number[][]}
     */
    get biases() {
        let biasesArr = [];
        this.nodes.forEach(perceptron => {
            biasesArr.push(perceptron.bias);
        })
        return biasesArr;
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
     * Collects and sums the values of (weights * biases) from the previous layer
     * 
     */
    computeSums() {
        this.nodes.forEach(perceptron => {
            perceptron.computeSum();
        })
    }

    /** 
     * For each perceptron, adds its bias to its sum
     *  
     */
    addBiases() {
        // Links each perceptron of this layer to each perceptron of the given layer
        this.nodes.forEach(perceptron => {
            perceptron.addBias();
        })
    }

    /** 
     * Calls the activation function to each perceptron in this layer
     * 
     */
    computeActivations() {
        this.nodes.forEach(perceptron => {
            perceptron.computedOutput = perceptron.activation();
        })
    }

    /** 
     * Collects the deltas of the targets minus the actual outputs
     * 
     * @param {Number[]} targets The target correct outputs
     * 
     * @returns {Number[]} target - guess
     */
    getErrors(targets) {
        let errors = [];
        this.nodes.forEach((perceptron, i) => {
            errors.push(perceptron.computeError(targets[i]));
        })
        return errors;
    }

    /** 
     * Tweaks biases and backward weights for each perceptron
     * @param {Number} learningRate Tweak factor
     */
    tweak(learningRate) {
        this.nodes.forEach(perceptron => {
            perceptron.tweak(learningRate);
        });
    }

    /** 
     * Calls the deactivation function to each perceptron in this layer
     * 
     */
    deactivation() {
        this.nodes.forEach(perceptron => {
            perceptron.computedOutput = perceptron.deactivation();
        })
    }
}