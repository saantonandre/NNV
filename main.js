import { NeuralNetwork } from './modules/neuralNetwork/neuralNetwork.js';
import { c, canvas } from './modules/canvas/canvas.js';

let dataset = [{
        inputs: [
            0,
            1
        ],
        targets: [
            1
        ]
    },
    {
        inputs: [
            1,
            0
        ],
        targets: [
            1
        ]
    },
    {
        inputs: [
            0,
            0
        ],
        targets: [
            0
        ]
    },
    {
        inputs: [
            1,
            1
        ],
        targets: [
            0
        ]
    }
]
let neuralNetwork = new NeuralNetwork();
neuralNetwork.initialize(2, [4], 1);
neuralNetwork.train(dataset, 10000);
neuralNetwork.render(c, canvas);

//neuralNetwork.test(c, canvas);
//measureAverage(1000, 5000);

function measureAverage(neuralNetworks, iterations) {
    let neuralNetwork;
    let average = 0;
    for (let i = 0; i < neuralNetworks; i++) {
        neuralNetwork = new NeuralNetwork();
        neuralNetwork.initialize(2, [4], 1);
        average += neuralNetwork.train(dataset, iterations);
    }
    neuralNetwork.render(c, canvas);
    console.log(average / neuralNetworks);
}