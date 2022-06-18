// import { NeuralNetwork } from "./modules/neuralNetwork/neuralNetwork.js";
importScripts("./modules/neuralNetwork/neuralNetwork.js");

const handleMessage = (e) => {
  switch (e.data.label) {
    case "init":
      fetch("./trainingData.json")
        .then((response) => response.json())
        .then((dataset) => {
          self.postMessage({ label: "working" });
          setup(dataset);
          self.postMessage({ label: "done" });
        });
      break;
    case "state":
      self.postMessage({ label: "state", layers: neuralNetwork.layers, info: neuralNetwork.data });
      break;
    default:
      self.postMessage({ label: "invalid message" });
  }
};
self.addEventListener("message", handleMessage);
const neuralNetwork = new NeuralNetwork();
const INPUT = [2];
const HIDDENS = [4];
const OUTPUT = 1;
function setup(dataset) {
  //neuralNetwork.initialize(INPUT, HIDDENS, OUTPUT);
  neuralNetwork.loadSettings(settings);
  neuralNetwork.train(dataset, 100000, true);
}

function setup2(dataset) {
  measureAverage(1000, 10000, dataset);
}

/**
 * Tests the average accuracy of the NN.
 *
 * It does so by creating a specified amount of new instances and
 * testing each istance for a specified amount of iterations
 *
 * @param {Number} neuralNetworks Amount of neural networks to take as subject
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

const settings = {
  initParams: [[2], [4], 1],
  learningRate: 1,
  layersBiases: [
    [0, 0],
    [
      0.5881571156590575, -1.1218697489666605, -0.9212706467418784,
      0.6356724469270029,
    ],
    [-0.5947030687556563],
  ],
  layersWeights: [
    [
      [
        -5.438101362827573, 5.792366499466637, -8.183403449358146,
        -5.525441427538952,
      ],
      [
        -5.636778286886468, -8.21413808230639, 5.522062452404506,
        -5.790962908229075,
      ],
    ],
    [
      [-2.315371637628231],
      [5.237246099722279],
      [5.365256811981108],
      [-2.09347574225194],
    ],
    [[]],
  ],
};
