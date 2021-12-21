import { Layer } from './perceptron.js';

export class NeuralNetwork {
    constructor() {
        /**
         * @type {Layer}
         */
        this.inputLayer;
        /**
         * @type {Layer[]}
         */
        this.hiddenLayers;
        /**
         * @type {Layer}
         */
        this.outputLayer;

        /** Represents the impact of errors over the back propagation */
        this.learningRate = 0.1;
        this.initialize();
    }
    /** 
     * Initializes the layers by adding a specified amount of perceptrons
     *  
     * @param {Number} [inputNodes] Amount of inputs
     * @param {Number[]} [hiddenNodes] Array of numbers, each representing the amount of perceptrons
     * @param {Number} [outputNodes] Amount of outputs
     * @example
     * // Generates a neural network composed of an input layer with 2 neurons, 2 hidden layers with respectively 4 and 3 neurons, an output layer with one neuron:
     * initialize(2,[4,3],1);
     * 
     */
    initialize(inputNodes = 2, hiddenNodes = [2], outputNodes = 1) {

        this.inputLayer = new Layer(inputNodes);

        this.hiddenLayers = [];
        hiddenNodes.forEach(perceptronsAmount => { this.hiddenLayers.push(new Layer(perceptronsAmount)) });

        this.outputLayer = new Layer(outputNodes);

    }
}