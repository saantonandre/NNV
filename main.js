import { NeuralNetwork } from './modules/neuralNetwork/neuralNetwork.js';
import { c, canvas } from './modules/canvas/canvas.js';


fetch('./trainingData.json')
    .then(response => response.json())
    .then(dataset => setup(dataset));

const INPUT = 2,
    HIDDENS = [4],
    OUTPUT = 1;


function setup(dataset) {
    let neuralNetwork = new NeuralNetwork();
    window.nn = neuralNetwork;
    neuralNetwork.initialize(INPUT, HIDDENS, OUTPUT);
    neuralNetwork.train(dataset, 5000, true);
    neuralNetwork.render(c, canvas);
}

function setup2(dataset) {
    measureAverage(1000, 5000, dataset);
}

/**
 * Tests the average accuracy of the NN.
 * 
 * It does so by creating a specified amount of new instances and
 * testing each istance for a specified amount of iterations
 * 
 * @param {Number} neuralNetworks Amount of neural network to take as subject
 * @param {Number} iterations Amount of iterations for each neural network to compute
 */
function measureAverage(neuralNetworks, iterations, dataset) {
    let neuralNetwork;
    let average = 0;
    for (let i = 0; i < neuralNetworks; i++) {
        neuralNetwork = new NeuralNetwork();
        neuralNetwork.initialize(INPUT, HIDDENS, OUTPUT);
        average += neuralNetwork.train(dataset, iterations);
    }
    neuralNetwork.render(c, canvas);
    console.log(average / neuralNetworks);
}