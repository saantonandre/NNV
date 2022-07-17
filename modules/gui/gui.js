import { Text } from "./text/text.js";
import { c as context, canvas } from "./canvas/canvas.js";
import { Meta } from "./meta/meta.js";
import { Camera } from "./camera/camera.js";

export class Gui {
  constructor() {
    this.colors = {
      outputs: "#A0D4A9",
      weights: "#9AADBF",
      weightsText: "#6D98BA",
      biases: "#C17767",
      neurons: "#D3B99F",
      neuronsText: "#fff",
      infoText: "#fff",
    };
    this.meta = new Meta();
    canvas.addEventListener("wheel", this.handleWheel);
    this.mouseDown = false;
    canvas.addEventListener("mousedown", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      canvas.style.cursor = "grab";
      this.mouseDown = true;
    });
    canvas.addEventListener("mouseup", () => {
      canvas.style.cursor = "default";
      this.mouseDown = false;
    });
    canvas.addEventListener("mousemove", this.handleMove);
    this.camera = new Camera();
    this.baseW = 800;
    this.baseH = 600;
    this.offsetX = (window.innerWidth - this.baseW) / 2;
    this.offsetY = (window.innerHeight - this.baseH) / 2;
    this.camera.x = this.offsetX;
    this.camera.y = this.offsetY;
    this.nodeSize = 25;

    this.mouse = { x: false, y: false };
    this.displayNumbers = true;
    this.initialized = false;
  }
  /** Creates and returns an HTML checkbox input */
  numbersToggler = () => {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.onchange = () => {
      this.displayNumbers = checkbox.checked;
    };
    let label = document.createElement("label");
    label.innerHTML = "Display values";
    label.appendChild(checkbox);
    return label;
  };
  /** Creates and returns an HTML range input
   * @param {Function} eventHandler
   * @param {Number} initialValue Initial value of the range input
   */
  speedAmount = (eventHandler, initialValue = 10) => {
    let input = document.createElement("input");
    let label = document.createElement("label");
    label.innerHTML = "Epochs per render: ";
    input.type = "number";
    input.min = 1;
    input.style.width = "80px";
    input.style.textAlign = "center";
    input.value = initialValue;
    input.oninput = eventHandler;
    label.appendChild(input);
    return label;
  };
  numbersToggler = () => {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.onchange = () => {
      this.displayNumbers = checkbox.checked;
    };
    let label = document.createElement("label");
    label.innerHTML = "Display values";
    label.appendChild(checkbox);
    return label;
  };
  genericButton = (label, action) => {
    let button = document.createElement("button");
    button.innerHTML = label;
    button.onclick = action;
    return button;
  };
  /**
   * @param {MouseEvent} e
   */
  handleMove = (e) => {
    if (!this.mouseDown) {
      return;
    }
    this.camera.x += (e.offsetX - this.mouse.x) / this.meta.ratio;
    this.camera.y += (e.offsetY - this.mouse.y) / this.meta.ratio;
    this.mouse.x = e.offsetX;
    this.mouse.y = e.offsetY;
  };
  /**
   * @param {Event} e
   */
  handleWheel = (e) => {
    let scrollValue = e.deltaY * -0.002;
    if (
      this.meta.ratio + scrollValue > 0 &&
      this.meta.ratio + scrollValue < 10
    ) {
      // handles mouse wheel movements
      this.meta.ratio += scrollValue;
      this.camera.x +=
        (window.innerWidth / this.meta.ratio -
          window.innerWidth / (this.meta.ratio - scrollValue)) /
        2;
      this.camera.y +=
        (window.innerHeight / this.meta.ratio -
          window.innerHeight / (this.meta.ratio - scrollValue)) /
        2;
    }
  };
  initialize(nLayers, layers) {
    this.baseW = (800 / 3) * nLayers;
    this.baseH =
      (600 / 4) *
      layers.reduce((max, layer) => {
        if (layer.nodes.length > max) {
          return layer.nodes.length;
        } else {
          return max;
        }
      }, 0);
    this.offsetX = (window.innerWidth - this.baseW) / 2;
    this.offsetY = (window.innerHeight - this.baseH) / 2;
    this.camera.x = this.offsetX;
    this.camera.y = this.offsetY;
  }
  /**
   *
   * @param {*} nn
   * @param {object | null} data Info texts
   */
  render = (nn, data = null) => {
    this.meta.compute();
    context.clear();
    let layers = nn.layers;
    let nLayers = nn.layers.length;
    if (!this.initialized) {
      this.initialized = true;
      this.initialize(nLayers, layers);
    }
    let nNodes = 0;

    // Define maximum amount of perceptrons;
    layers.forEach((layer) => {
      layer.nodes.length > nNodes ? (nNodes = layer.nodes.length) : false;
    });
    // Assign coordinates to each perceptron;
    layers.forEach((layer, i) => {
      layer.nodes.forEach((node, j) => {
        node.x = (this.baseW / nLayers) * (i + 0.5);
        node.y =
          this.baseH / 2 +
          (j - (layer.nodes.length - 1) / 2) * (this.baseH / nNodes);
        // node.y = j * (this.baseH / nNodes) * (layer.nodes.length / nNodes) + 80;
      });
    });

    // Render links as lines
    this.renderLinks(layers, data);

    // Render perceptrons as filled circles
    this.renderPerceptrons(layers);

    if (this.displayNumbers) {
      // Render values
      this.renderTexts(nn, layers);
    }
    this.renderInfo();
    // Render data
    if (data) {
      this.renderData(data);
    }
  };
  renderPerceptrons = (layers) => {
    layers.forEach((layer) => {
      layer.nodes.forEach((node) => {
        context.fillStyle = this.colors.neurons;
        context.strokeStyle = this.colors.biases;
        context.lineWidth = node.bias * 5 * this.meta.ratio;
        context.beginPath();
        context.arc(
          (node.x + this.camera.x) * this.meta.ratio,
          (node.y + this.camera.y) * this.meta.ratio,
          this.nodeSize * this.meta.ratio,
          0,
          Math.PI * 2
        );
        context.closePath();
        context.fill();
        context.stroke();
      });
    });
  };
  renderLinks = (layers, data) => {
    layers.forEach((layer) => {
      layer.nodes.forEach((node) => {
        node.forwardLinks.forEach((link) => {
          context.strokeStyle = this.colors.weights;
          context.lineWidth = Math.abs(link.weight) * this.meta.ratio;
          context.beginPath();
          context.moveTo(
            (node.x + this.camera.x) * this.meta.ratio,
            (node.y + this.camera.y) * this.meta.ratio
          );
          context.lineTo(
            (link.forward.x + this.camera.x) * this.meta.ratio,
            (link.forward.y + this.camera.y) * this.meta.ratio
          );
          context.closePath();
          context.stroke();

          /* // Error rendering
          if (data && (data.failedSinceLastRender||data.lastGuessWrong)) {
            context.globalAlpha =
              data.failedSinceLastRender? data.failedSinceLastRender/ data.framesSinceLastRender:1;
            context.strokeStyle = "#ff0000";
            context.beginPath();
            context.moveTo(
              (node.x + this.camera.x) * this.meta.ratio,
              (node.y + this.camera.y) * this.meta.ratio
            );
            context.lineTo(
              (link.forward.x + this.camera.x) * this.meta.ratio,
              (link.forward.y + this.camera.y) * this.meta.ratio
            );
            context.closePath();
            context.stroke();
            context.globalAlpha = 1;
          }
          */
        });
      });
    });
  };
  renderTexts = (nn, layers) => {
    layers.forEach((layer) => {
      layer.nodes.forEach((node) => {
        let text = new Text({
          x: (node.x + this.camera.x) * this.meta.ratio,
          y: (node.y + this.camera.y) * this.meta.ratio,
          color: this.colors.outputs,
        });
        text.content = "" + parseFloat(node.computedOutput.toFixed(4));
        text.render(context);
        if (layer !== nn.inputLayer) {
          let text2 = new Text({
            x: (node.x + this.camera.x) * this.meta.ratio,
            y: (node.y - this.nodeSize * 1.2 + this.camera.y) * this.meta.ratio,
            color: this.colors.biases,
          });
          text2.content = "" + parseFloat(node.bias.toFixed(4));
          text2.render(context);
        }
        node.forwardLinks.forEach((link) => {
          let text = new Text({
            x:
              (link.backward.x +
                (link.forward.x - link.backward.x) / 1.5 +
                this.camera.x) *
              this.meta.ratio,
            y:
              (link.backward.y +
                (link.forward.y - link.backward.y) / 1.5 +
                this.camera.y) *
              this.meta.ratio,
            color: this.colors.weights,
          });
          text.content = "" + parseFloat(link.weight.toFixed(4));
          text.render(context);
        });
      });
    });
  };
  /**
   * Displays the color legend
   */
  renderInfo = () => {
    ["outputs", "weights", "biases"].forEach((label, i) => {
      context.fillStyle = this.colors[label];
      context.fillRect(10, i * 30 + 80, 20, 20);
      let oText = new Text({
        x: 35,
        y: i * 30 + 10 + 80,
        color: this.colors[label],
        align: "left",
      });
      oText.content = label;
      oText.render(context);
    });
  };
  renderData = (data) => {
    let iText = new Text({
      x: window.innerWidth - 20,
      y: 10 + 80,
      color: this.colors.infoText,
      align: "right",
    });
    iText.content = `Epoch: ${data.iterations}`;
    iText.render(context);

    let lText = new Text({
      x: window.innerWidth - 20,
      y: 30 + 80,
      color: this.colors.infoText,
      align: "right",
    });
    lText.content = `Accuracy(300): ${data.accuracyLatter}%`;

    lText.render(context);
    let aText = new Text({
      x: window.innerWidth - 20,
      y: 50 + 80,
      color: this.colors.infoText,
      align: "right",
    });
    aText.content = `Total accuracy: ${data.accuracy}%`;
    aText.render(context);
  };
}
