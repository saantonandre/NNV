import { Layer } from './layer.js';

export class NeuralNetwork {
    /** Creates a new instance of a neural network */
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
        // Creates the layers
        this.inputLayer = new Layer(inputNodes);

        this.hiddenLayers = [];
        hiddenNodes.forEach(perceptronsAmount => { this.hiddenLayers.push(new Layer(perceptronsAmount)) });

        this.outputLayer = new Layer(outputNodes);
        // Links the layers

        this.inputLayer.link(this.hiddenLayers[0]);
        for (let i = 0; i < this.hiddenLayers.length - 1; i++) {
            this.hiddenLayers[i].link(this.hiddenLayers[i + 1]);
        }
        this.hiddenLayers[this.hiddenLayers.length - 1].link(this.outputLayer);
    }

    /**
     * Trains this neural network for a given amount of cycles
     * 
     * @param {Number} inputs An array of values to pass through the network
     */
    feedForward(inputs) {
        this.inputLayer.set(inputs);
        this.inputLayer.sendOutputs();
        for (let i = 0; i < this.hiddenLayers.length; i++) {
            this.hiddenLayers[i].computeSum();
            this.hiddenLayers[i].applyBias();
            this.hiddenLayers[i].activation();
            this.hiddenLayers[i].sendOutputs();
        }
        this.outputLayer.computeSum();
        this.outputLayer.applyBias();
        this.outputLayer.sendOutputs();
        this.outputLayer.activation();
        let outputs = [];
        this.outputLayer.nodes.forEach(perceptron => {
            outputs.push(perceptron.computedOutput);
        })
        return outputs;
    }

    /**
     * Trains this neural network for a given amount of cycles
     * 
     * @param {Number[]} output An array of values to pass through the network
     */
    propagateBackwards(output) {
        // Compute errors and propagate backwards to each layer

    }
    /**
     * Trains this neural network for a given amount of cycles
     * 
     * @param {Number} epochs The amount of cycles
     * @param {Number[][]} dataset The dataset with which this neural network will be trained
     */
    train(epochs, dataset) {
        this.feedForward();
    }
    /**
     * Trains this neural network for a given amount of cycles
     * 
     * @param {Number} epochs The amount of cycles
     * @param {Number[][]} dataset The dataset with which this neural network will be trained
     */
    train(epochs, dataset) {
        this.feedForward();
    }

    /** Logs the output after a feed forward session 
     * @param {Number[]} inputs An array of values to pass through the network
     */
    test(inputs) {
        console.log(this.feedForward(inputs))
    }
}