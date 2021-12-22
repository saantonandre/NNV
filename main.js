import { NeuralNetwork } from './modules/neuralNetwork/neuralNetwork.js';

let neuralNetwork = new NeuralNetwork();

neuralNetwork.initialize(2, [2, 2], 1);
let inputs = [3, 4];
neuralNetwork.test(inputs);
console.log(neuralNetwork)