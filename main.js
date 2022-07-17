import { Gui } from "./modules/gui/gui.js";
/* 
A spawned worker which will handle heavy NN computations,
it will provide the current state to the NN whenever prompted to.
 */
let worker = new Worker("worker.js");
/**
 * Handles worker messages
 * @param {Event} e Message Event object
 */
const handleMessage = (e) => {
  switch (e.data.label) {
    case "state":
      nn = { layers: e.data.layers, data: e.data.info };
      stateRequested = false;
      break;
      case "ready":
        renderLoop()
        break;
    default:
      console.log(e.data);
  }
};
worker.addEventListener("message", handleMessage);

/** Graphical user interface instance, provides
 * rendering functionalities and interactive inputs
 */
const gui = new Gui();

const options = document.getElementById("options");
options.appendChild(
  gui.speedAmount((e) => {
    worker.postMessage({ label: "config", changes: { speed: e.target.value } });
  })
);
options.appendChild(gui.numbersToggler());
options.appendChild(gui.genericButton("Start \u23F5",(e) => {
  worker.postMessage({ label: "start"});
}));
options.appendChild(gui.genericButton("Step \u23EF",(e) => {
  worker.postMessage({ label: "step"});
}));
options.appendChild(gui.genericButton("Pause \u23F8",(e) => {
  worker.postMessage({ label: "pause"});
}));
options.appendChild(gui.genericButton("Reset \u27F3",(e) => {
  worker.postMessage({ label: "reset"});
}));


// Asks the worker to initialize the NN
worker.postMessage({ label: "init" });

let nn = false;
let stateRequested = false;
const renderLoop = () => {
  if (!stateRequested) {
    // Makes sure to not bloat the worker message queue with too many state requests
    stateRequested = true;
    worker.postMessage({ label: "state" });
  }
  if (nn) {
    // Renders the state as soon as it's available
    gui.render(nn, nn.data);
    if (nn.data.failedSinceLastRender) {
      worker.postMessage({
        label: "config",
        changes: {
          data: {
            ...nn.data,
            failedSinceLastRender: 0,
            framesSinceLastRender: 0,
          },
        },
      });
    }
  }
  // repeats in a loop (once per Javascript rendering cycle, depending on monitor frequency ~16ms/~8ms)
  requestAnimationFrame(renderLoop);
};
