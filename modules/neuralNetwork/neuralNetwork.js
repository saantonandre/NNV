import { Layer } from './perceptron.js';

export class NeuralNetwork {
    constructor() {
        this.inputLayer = new Layer();
        this.hiddenLayer = new Layer();
        this.outputLayer = new Layer();

        this.learningRate = 0.1;
        this.initialize();
    }
    /** 
     * Initializes the layers by adding a specified amount of perceptrons
     *  
     * @param {Number} [inputNodes] Amount of inputs
     * @param {Number} [hiddenNodes] Amount of hidden 
     * @param {Number} [outputNodes] Amount of outputs
     */
    initialize(inputNodes = 2, hiddenNodes = 2, outputNodes = 1) {
        this.inputLayer = new Layer();
        this.hiddenLayer = new Layer();
        this.outputLayer = new Layer();
    }
}