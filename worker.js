
importScripts(
  "./modules/neuralNetwork/neuralNetwork.js",
  "./modules/idxConverter/idxConverter.js"
);
const handleMessage = (e) => {
  switch (e.data.label) {
    case "init":
      problems[selected].load();
      break;
    case "config":
      Object.keys(e.data.changes).forEach(
        (key) => (neuralNetwork[key] = e.data.changes[key])
      );
      break;
    case "start":
      if (neuralNetwork.stop) {
        neuralNetwork.stop = false;
        neuralNetwork.train({
          ...neuralNetwork.trainingConfig,
          ...problems[selected].train,
        });
      }
      break;
    case "pause":
      neuralNetwork.stop = true;
      break;
    case "step":
      neuralNetwork.stop = true;
      neuralNetwork.train({
        ...neuralNetwork.trainingConfig,
        ...problems[selected].train,
      });
      break;
    case "reset":
      neuralNetwork.resetData();
      problems[selected].load();
      break;
    case "state":
      self.postMessage({
        label: "state",
        layers: neuralNetwork.layers,
        info: neuralNetwork.data,
      });
      break;
    default:
      self.postMessage({ label: "invalid message" });
  }
};
self.addEventListener("message", handleMessage);

let selected = "xor";
const problems = {
  xor: {
    load: () => {
      fetch("./trainingData.json")
        .then((response) => response.json())
        .then((data) => {
          setup({ ...problems.xor.layers });
          problems.xor.train.dataset = data;
          self.postMessage({ label: "ready" });
        });
    },
    layers: {
      input: 2,
      hidden: [4],
      output: 1,
    },
    train: {
      dataset: {},
      correctCriteria: (outputs, targets) => {
        return Math.round(outputs[0]) === targets[0];
      },
    },
  },
  mnist: {
    load: () => {
      createMnistDataset().then((resp) => {
        self.postMessage({ label: "Setting up" });
        setup({ ...problems.mnist.layers });
        problems.mnist.train.dataset = resp;
        self.postMessage({ label: "ready" });
      });
    },
    layers: {
      input: 784,
      hidden: [128, 64],
      output: 10,
    },
    train: {
      dataset: {},
      correctCriteria: (outputs, targets) => {
        let numGuess = [0, 0];
        outputs.forEach((g, i) => {
          if (g > numGuess[1]) {
            numGuess[0] = i;
            numGuess[1] = g;
          }
        });
        let numTarget = targets.indexOf(1);

        return numGuess[0] === numTarget;
      },
    },
  },
};
const createMnistDataset = async () => {
  const rawLabelsDataset = await convertIdx(
    "MNIST/train-labels.idx1-ubyte"
  ).then((r) => r.rawData);
  const rawImagesDataset = await convertIdx(
    "MNIST/train-images.idx3-ubyte"
  ).then((r) => r.rawData);
  return formatDataset(rawLabelsDataset, rawImagesDataset);
};

const neuralNetwork = new NeuralNetwork();
function setup({ speed = 0, input = [1], hidden = [1], output = 1 }) {
  neuralNetwork.initialize({
    speed: speed,
    inputNodes: input,
    hiddenNodes: hidden,
    outputNodes: output,
  });
}

/**
 * @param {String} location
 * @returns {Response}
 */
const fetchFile = async (location) => {
  return await fetch(location)
    .then((response) => response)
    .catch((e) => console.log("Unable to fetch: " + e.message));
};
const formatDataset = (labels, images) => {
  const parsedDataset = [];
  for (let i = 0; i < labels.length; i++) {
    parsedDataset.push({
      inputs: normalizeInputs(images.slice(i * 784, i * 784 + 784)),
      targets: getTargets(labels[i]),
    });
  }
  console.log("Fetched data files");
  return parsedDataset;
};
function normalizeInputs(arr) {
  let inputs = [];
  for (let i = 0; i < arr.length; i++) {
    inputs.push(arr[i] / 255);
  }
  return inputs;
}

/**
 *
 * @param {Number} number A number from 0 to 9 representing the label for the MNIST dataset
 * @returns {Number[]} an array of 10 numbers with a 1 at the index of the argument number
 */
function getTargets(number) {
  let targets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  targets[number] = 1;
  return targets;
}
