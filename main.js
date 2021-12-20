import { NeuralNetwork } from './modules/neural-network/neural-network.js';

// Loads the training data (async) and calls the setup function once it's done
fetch('./trainingData.json')
    .then(response => response.json())
    .then(data => setup(data));

/** Amount of input layer nodes */
const input_nodes = 2;
/** Amount of hidden layer nodes */
const hidden_nodes = 4;
/** Amount of output layer nodes */
const output_nodes = 1;

/** Amount of training sessions */
const training_iterations = 5000;

/** Initial learning rate */
let learningRate = 1;

/** Setups a new NN session:
 * - Creates the Neural network based on
 */
function setup(data) {
    let trainingData = data;
    let nn = new NeuralNetwork(input_nodes, hidden_nodes, output_nodes);
    for (let i = 0; i < training_iterations; i++) {
        // Takes a random data entry 
        let data = trainingData[Math.random() * trainingData.length | 0];
        nn.train(data.inputs, data.targets);

        // Slowly shrinks the learning rate 
        nn.learningRate = learningRate * 0.99;
    }
    console.log(nn.feedForward([0, 0]));
    console.log(nn.feedForward([1, 0]));
    console.log(nn.feedForward([0, 1]));
    console.log(nn.feedForward([1, 1]));
}