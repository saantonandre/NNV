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
        this.learningRate = 1;

        /** Init parameters */
        this.initParams = [];

        /**
         * An array containing a reference to each layer of the network
         * @type {Layer[]}
         */
        this.layers = [];
    }
    /** The layers returned as a single array */
    get layersArray() {
        return [this.inputLayer, ...this.hiddenLayers, this.outputLayer];
    }
    saveSettings() {
        console.log(JSON.stringify(new Settings(this)))
    }
    /**
     * @param {Settings} settings
     */
    loadSettings(settings) {
        this.initialize(...settings.initParams);
        this.learningRate = settings.learningRate;
        for (let i = 0; i < this.layersArray.length; i++) {
            for (let j = 0; j < this.layersArray[i].nodes.length; j++) {
                this.layersArray[i].nodes[j].bias = settings.layersBiases[i][j];
                for (let k = 0; k < this.layersArray[i].nodes[j].forwardLinks.length; k++) {
                    this.layersArray[i].nodes[j].forwardLinks[k].weight = settings.layersWeights[i][j][k];
                }
            }
        }

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
        this.randomize(5);
    }

    /** Initializes every weight as a random amount 
     * 
     * @param {Number} range The amount will be a random value between -range/2 and range/2
     */
    randomize(range) {
        this.layers.forEach(layer => {
            layer.nodes.forEach(perceptron => {
                perceptron.forwardLinks.forEach(link => {

                    link.weight = Math.random() * range - (range / 2);
                    // link.weight += link.weight > 0 ? range / 2 : -range / 2;
                    // link.weight = Math.random() > 0.5 ? range : -range
                })
            })
        })
    }

    /** Returns the layer before the given one 
     * 
     * @param {Layer} layer
     * @returns {Layer}
     */
    prevLayer(layer) {
        return this.layers[this.layers.indexOf(layer) - 1];
    }

    /** Returns the layer after the given one 
     * 
     * @param {Layer} layer
     * @returns {Layer}
     */
    nextLayer(layer) {
        return this.layers[this.layers.indexOf(layer) + 1];
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
            } else {
                layer.computeSums();
                layer.addBiases();
                layer.computeActivations();
            }
        })

        return this.outputLayer.values;
    }

    /**
     * Given a layer and its correct expected output, computes the error and propagates it backwards through each layer
     * This is a recursive function which will terminate once arrived back to the input layer
     * 
     * @param {Layer} layer The layer computing the error
     * @param {Number[]} targets The expected answer to compare with the output's guess
     * @param {Number} learningRate The ratio of the impact of the error over the biases/weights
     * 
     * @returns {Boolean} True when the recursion ends 
     */
    backPropagation(layer, targets, learningRate = this.learningRate) {
        layer.getErrors(targets);
        if (layer === this.inputLayer) {
            return true; // The input layer doesn't back-propagate
        }
        layer.tweak(learningRate);
        this.backPropagation(this.prevLayer(layer), targets)
    }

    /**
     * Trains this neural network for a given amount of cycles
     *      
     * @param {Object[]} dataset The dataset with which this neural network will be trained
     * @param {Number} iterations The amount of cycles
     * 
     * @returns {Number} Accuracy of the latter 1000 tests
     */
    train(dataset, iterations, log = false) {
        let random = 0;
        let correctGuesses = 0;
        let latterGuesses = 0;
        let accuracyCount = iterations > 1000 ? 1000 : iterations;

        for (let i = 0; i < iterations; i++) {
            random = Math.random() * dataset.length | 0;
            let guess = this.feedForward(dataset[random].inputs);

            // Counts the correct guesses
            let correct = Math.round(guess[0]) === dataset[random].targets[0];
            if (correct) {
                correctGuesses++;
                if (i >= iterations - accuracyCount) {
                    latterGuesses++;
                }
            }
            this.backPropagation(this.outputLayer, dataset[random].targets, this.learningRate);
        }



        // logs the accuracy on the console
        let accuracyAll = correctGuesses / iterations * 100;
        let accuracyLatter = latterGuesses / accuracyCount * 100;
        if (log) {
            console.log(`Trained for ${iterations} iterations.\n\nAccuracy: 
            ${accuracyAll.toFixed(2)}% (overall)
            ${accuracyLatter.toFixed(2)}% (last ${accuracyCount} iterations)`);
        }
        return accuracyLatter;
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
        let colors = {
            outputs: "#22ffff",
            weights: "#00ff00",
            biases: "#aaaaff",
        }
        // Display colors graph
        context.fillStyle = colors.outputs;
        context.fillRect(10, 10, 20, 20);
        let oText = new Text(35, 20, colors.outputs, "left");
        oText.content = "outputs";
        oText.render(context);

        context.fillStyle = colors.weights;
        context.fillRect(10, 40, 20, 20);
        let wText = new Text(35, 50, colors.weights, "left");
        wText.content = "weights";
        wText.render(context);

        context.fillStyle = colors.biases;
        context.fillRect(10, 70, 20, 20);
        let bText = new Text(35, 80, colors.biases, "left");
        bText.content = "biases";
        bText.render(context);

        // Define maximum amount of perceptrons;
        layers.forEach(layer => {
            layer.nodes.length > nNodes ? nNodes = layer.nodes.length : false;
        })

        // Assign coordinates to each perceptron;
        layers.forEach((layer, i) => {
            layer.nodes.forEach((node, j) => {
                node.x = canvas.width / nLayers * (i + 0.5);
                node.y = (canvas.height / 2) + (j - (layer.nodes.length - 1) / 2) * (canvas.height / nNodes);
                // node.y = j * (canvas.height / nNodes) * (layer.nodes.length / nNodes) + 80;
            })
        })
        // Render links as lines
        layers.forEach((layer, i) => {
            layer.nodes.forEach((node, j) => {
                node.forwardLinks.forEach(link => {
                    context.strokeStyle = "lightgreen";
                    context.lineWidth = Math.abs(link.weight);
                    context.beginPath();
                    context.moveTo(node.x, node.y);
                    context.lineTo(link.forward.x, link.forward.y);
                    context.closePath();
                    context.stroke();


                    let text = new Text(link.backward.x + (link.forward.x - link.backward.x) / 1.5, link.backward.y + (link.forward.y - link.backward.y) / 1.5, colors.weights);
                    text.content = '' + parseFloat(link.weight.toFixed(4));
                    text.render(context)
                })
            })
        })

        // Render perceptrons as filled circles
        layers.forEach((layer, i) => {
            layer.nodes.forEach((node, j) => {
                context.fillStyle = "white";
                context.beginPath();
                context.arc(node.x, node.y, 25, 0, Math.PI * 2);
                context.closePath()
                context.fill();
                let text = new Text(node.x, node.y, colors.outputs)
                text.content = '' + parseFloat(node.computedOutput.toFixed(4));
                text.render(context)
                if (layer !== this.inputLayer) {
                    let text2 = new Text(node.x, node.y - 30, colors.biases)
                    text2.content = '' + parseFloat(node.bias.toFixed(4));
                    text2.render(context)
                }
            })
        })

    }
}
class Settings {
    /**
     * 
     * @param {NeuralNetwork} nn 
     */
    constructor(nn) {
        this.initParams = nn.initParams;
        this.learningRate = nn.learningRate;
        this.layersBiases = this.getBiases(nn);
        this.layersWeights = this.getWeights(nn);
    }
    /**
     * 
     * @param {NeuralNetwork} nn 
     */
    getBiases(nn) {
        let layers = [];
        for (let i = 0; i < nn.layersArray.length; i++) {
            let biases = [];
            for (let j = 0; j < nn.layersArray[i].nodes.length; j++) {
                biases.push(nn.layersArray[i].nodes[j].bias);
            }
            layers.push(biases);
        }
        return layers;
    }
    /**
     * 
     * @param {NeuralNetwork} nn 
     */
    getWeights(nn) {
        let layers = [];
        for (let i = 0; i < nn.layersArray.length; i++) {
            let nodes = [];
            for (let j = 0; j < nn.layersArray[i].nodes.length; j++) {
                let weights = [];
                for (let k = 0; k < nn.layersArray[i].nodes[j].forwardLinks.length; k++) {
                    weights.push(nn.layersArray[i].nodes[j].forwardLinks[k].weight);
                }
                nodes.push(weights);
            }
            layers.push(nodes);
        }
        return layers;
    }
}