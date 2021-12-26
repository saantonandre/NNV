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
//neuralNetwork.test(c, canvas);
neuralNetwork.train(dataset, 15000);
neuralNetwork.render(c, canvas);