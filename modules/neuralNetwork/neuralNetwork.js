import { Layer } from './layer.js';
import { Text } from '../text/text.js';

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
        this.learningRate = 0.99;

        /** Init parameters */
        this.initParams = [];

        /**
         * An array containing a reference to each layer of the network
         * @type {Layer[]}
         */
        this.layers = [];
    }
    get layersArray() {
        return [this.inputLayer, ...this.hiddenLayers, this.outputLayer];
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
        this.initParams = [inputNodes, hiddenNodes, outputNodes];
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
        this.layers = this.layersArray;
        this.randomize();
    }

    /** Initializes every bias and weight as a random amount (between -1 and 1) */
    randomize() {
        this.layers.forEach(layer => {
            layer.nodes.forEach(perceptron => {
                perceptron.bias = Math.random() * 10 - 5;
                perceptron.forwardLinks.forEach(link => {
                    link.weight = Math.random() * 10 - 5;
                })
            })
        })
    }
    /** Returns the layer before the given one 
     * 
     * @param {Layer} layer
     * @returns {Layer}
     */
    previousLayer(layer) {
        if (layer === this.inputLayer) {
            throw new Error("There's nothing before the input layer")

        } else if (layer === this.outputLayer) {
            return this.hiddenLayers[this.hiddenLayers.length - 1];

        } else {
            let index = this.hiddenLayers.indexOf(layer);
            if (index == 0) {
                return this.inputLayer;
            } else {
                return this.hiddenLayers[index - 1];
            }
        }
    }
    /** Returns the layer after the given one 
     * 
     * @param {Layer} layer
     * @returns {Layer}
     */
    nextLayer(layer) {
        if (layer === this.inputLayer) {
            return this.hiddenLayers[0];

        } else if (layer === this.outputLayer) {
            throw new Error("There's nothing after the output layer");

        } else {
            let index = this.hiddenLayers.indexOf(layer);
            if (index == this.hiddenLayers.length - 1) {
                return this.outputLayer;
            } else {
                return this.hiddenLayers[index + 1];
            }
        }
    }

    /**
     * Feeds the inputs to pass through the network
     * 
     * @param {Number} inputs An array of values to pass through the network
     * @returns {Number[]} The output layer's values
     */
    feedForward(inputs) {
        let layers = this.layers;

        layers.forEach(layer => {
            if (layer === this.inputLayer) {
                layer.set(inputs);
                layer.sendOutputs();
            } else {
                layer.computeSum();
                layer.applyBias();
                layer.activation();
                layer.sendOutputs();
            }
        })

        return this.outputLayer.values;
    }
    /**
     * Given a layer and its correct expected output, computes the error and propagates it backwards through each layer
     * This is a recursive function which will terminate once arrived back to the input layer
     * 
     * @param {Layer} layer The layer computing the error
     * @param {Number[]} target The expected answer to compare with the output's guess.
     * 
     * @returns {Boolean} True when the recursion ends 
     */
    backPropagation(layer, targets) {
        layer.getErrors(targets);
        layer.tweak(this.learningRate);
        if (layer === this.inputLayer) {
            // The input layer doesn't back-propagate
            return true;
        }
        this.backPropagation(this.previousLayer(layer), targets)
    }
    /**
     * Trains this neural network for a given amount of cycles
     *      
     * @param {Number[][]} dataset The dataset with which this neural network will be trained
     * @param {Number} epochs The amount of cycles
     */
    train(dataset, epochs) {
        let random = 0;
        let cycles = 0;
        let wrongGuesses = 0;
        let correctGuesses = 0;
        for (cycles = 0; cycles < epochs; cycles++) {
            random = Math.random() * dataset.length | 0;
            let guess = this.feedForward(dataset[random].inputs);

            Math.round(guess[0]) === dataset[random].targets[0] ? correctGuesses++ : wrongGuesses++;

            this.backPropagation(this.outputLayer, dataset[random].targets)
        }

        let accuracy = correctGuesses / (wrongGuesses + correctGuesses) * 100;

        console.log(`Trained for ${cycles} epochs.\n\nAccuracy: ${accuracy}%`)
    }
    /**
     * Provisional rendering method
     *
     * @param {CanvasRenderingContext2D} context 
     * @param {HTMLCanvasElement} canvas 
     */
    render(context, canvas) {
        let layers = this.layers;
        let nLayers = this.layers.length;
        let nNodes = 0;

        // Define maximum amount of perceptrons;
        layers.forEach(layer => {
            layer.nodes.length > nNodes ? nNodes = layer.nodes.length : false;
        })

        // Assign coordinates to each perceptron;
        layers.forEach((layer, i) => {
            layer.nodes.forEach((node, j) => {
                node.x = canvas.width / nLayers * (i + 0.5);
                // node.y = (canvas.height / 2) + (j - (layer.nodes.length - 1) / 2) * (canvas.height / nNodes);
                node.y = j * (canvas.height / nNodes) * (layer.nodes.length / nNodes) + 80;
            })
        })
        // Render links as lines
        layers.forEach((layer, i) => {
            layer.nodes.forEach((node, j) => {
                node.forwardLinks.forEach(link => {
                    context.fillStyle = "white";
                    context.strokeStyle = "white";

                    context.lineWidth = link.weight;
                    context.beginPath();
                    context.moveTo(node.x, node.y);
                    context.lineTo(link.forward.x, link.forward.y);
                    context.closePath();
                    context.stroke();

                    context.strokeStyle = "white";
                    context.fillStyle = "white";

                    let text = new Text(link.backward.x + (link.forward.x - link.backward.x) / 2, link.backward.y + (link.forward.y - link.backward.y) / 2, '#00ff00');
                    text.content = '' + link.weight;
                    text.render(context)
                })
            })
        })

        // Render perceptrons as squares
        layers.forEach((layer, i) => {
            layer.nodes.forEach((node, j) => {
                context.fillStyle = "white";
                context.fillRect(
                    node.x - 20,
                    node.y - 20,
                    40,
                    40
                )
                let text = new Text(node.x, node.y)
                text.content = '' + node.computedOutput;
                text.render(context)
                let text2 = new Text(node.x, node.y - 30, "blue")
                text2.content = '' + node.bias;
                text2.render(context)
            })
        })

    }
}