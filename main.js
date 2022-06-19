import { Gui } from "./modules/neuralNetwork/gui.js";
let worker = new Worker("worker.js");

const handleMessage = (e) => {
  switch (e.data.label) {
    case "state":
      nn = { layers: e.data.layers, data: e.data.info };
      stateRequested = false;
      break;
    default:
      console.log(e.data);
  }
};
worker.addEventListener("message", handleMessage);
const gui = new Gui();
options = document.getElementById("options");
options.appendChild(gui.numbersToggler());
worker.postMessage({ label: "init" });

let nn = false;
let stateRequested = false;
const renderLoop = () => {
  if(!stateRequested){
    stateRequested = true;
    worker.postMessage({ label: "state" });
  }
  if (nn) {
    gui.render(nn, nn.data);
  }
  requestAnimationFrame(renderLoop);
};
requestAnimationFrame(renderLoop);
