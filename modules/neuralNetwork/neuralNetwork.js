// import { Layer } from "./layer.js";
// import {Gui} from "./gui.js";
importScripts("./modules/neuralNetwork/layer.js");

class NeuralNetwork {
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

    /**
     * An object providing rendering functionalities
     * @type {Gui}
     */
    //this.gui = new Gui();
    /**
     * Keeps track of training data
     */
    this.data = {
      iterations: 0,
      accuracyLatter: 0,
      accuracy: 0,
    };



    /**
     * Rendering frame skips
     */
    this.speed = 10000;
  }
  /** The layers returned as a single array */
  get layersArray() {
    return [this.inputLayer, ...this.hiddenLayers, this.outputLayer];
  }
  saveSettings() {
    console.log(JSON.stringify(new Settings(this)));
  }
  /**
   * @param {Settings} settings
   */
  loadSettings(settings) {
    this.initialize(...settings.initParams);
    this.learningRate = settings.learningRate;
    this.layersArray.forEach((layer, i) => {
      layer.nodes.forEach((node, j) => {
        node.bias = settings.layersBiases[i][j];
        node.forwardLinks.forEach((forwardLink, k) => {
          forwardLink.weight = settings.layersWeights[i][j][k];
        });
      });
    });
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
    hiddenNodes.forEach((perceptronsAmount) => {
      this.hiddenLayers.push(new Layer(perceptronsAmount));
    });

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
    this.layers.forEach((layer) => {
      layer.nodes.forEach((perceptron) => {
        perceptron.forwardLinks.forEach((link) => {
          link.weight = Math.random() * range - range / 2;
        });
      });
    });
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

    layers.forEach((layer) => {
      if (layer === this.inputLayer) {
        layer.set(inputs);
      } else {
        layer.computeSums();
        layer.addBiases();
        layer.computeActivations();
      }
    });

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
  backPropagation = (layer, targets, learningRate = this.learningRate) => {
    layer.getErrors(targets);
    if (layer === this.inputLayer) {
      return true; // The input layer doesn't back-propagate
    }
    layer.tweak(learningRate);
    this.backPropagation(this.prevLayer(layer), targets);
  };

  /**
   * Trains this neural network for a given amount of cycles
   *
   * @param {Object[]} dataset The dataset with which this neural network will be trained
   * @param {Number} iterations The amount of cycles
   *
   * @returns {Number} Accuracy of the latter 1000 tests
   */
  async train(dataset, iterations, log = false) {
    let random = 0;
    let correctGuesses = 0;
    let latterGuesses = 0;
    const accuracyCount = iterations > 1000 ? 1000 : iterations;
    let latterArray = [];
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const results = () => {
      // logs the accuracy on the console
      let accuracyAll = (correctGuesses / iterations) * 100;
      let accuracyLatter = (latterGuesses / accuracyCount) * 100;
      if (log) {
        console.log(`Trained for ${iterations} iterations.\n\nAccuracy: 
                  ${accuracyAll.toFixed(2)}% (overall)
                  ${accuracyLatter.toFixed(
                    2
                  )}% (last ${accuracyCount} iterations)`);
      }
      return accuracyLatter;
    };
    const breathe = () => new Promise((res) => setTimeout(res, 1));
    for (let counter = iterations; counter > 0; counter) {
      random = (Math.random() * dataset.length) | 0;
      let guess = this.feedForward(dataset[random].inputs);

      // Counts the correct guesses
      let correct = Math.round(guess[0]) === dataset[random].targets[0];
      if (correct) {
        latterArray.unshift(1);
        correctGuesses++;
        if (counter <= accuracyCount) {
          latterGuesses++;
        }
      } else {
        latterArray.unshift(0);
      }
      latterArray.length > 300 && latterArray.pop();

      this.backPropagation(
        this.outputLayer,
        dataset[random].targets,
        this.learningRate
      );
      counter--;
      this.data = {
        iterations: iterations - counter,
        accuracyLatter: (avg(latterArray) * 100).toFixed(2),
        accuracy: ((correctGuesses / (iterations - counter)) * 100).toFixed(2),
      };
      if (counter < 0) {
        return results();
      }
      if (!(counter % this.speed)) {
        await breathe();
      }
    }
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
    return nn.layersArray.map((layer) => layer.nodes.map((node) => node.bias));
  }
  /**
   * @param {NeuralNetwork} nn
   */
  getWeights(nn) {
    return nn.layersArray.map((layer) =>
      layer.nodes.map((node) =>
        node.forwardLinks.map((forwardLinks) => forwardLinks.weight)
      )
    );
  }
}
// export {NeuralNetwork, Settings}
