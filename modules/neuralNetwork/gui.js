import { Text } from "../text/text.js";
import { c as context, canvas } from "../canvas/canvas.js";
import { Meta } from "../meta/meta.js";
import { Camera } from "../camera/camera.js";

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
    this.nodeSize = 25;

    this.mouse = { x: false, y: false };
    this.displayNumbers=true;
  }
  numbersToggler=()=>{
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.onchange=()=>{
      this.displayNumbers=checkbox.checked;
    }
    let label = document.createElement("label");
    label.innerHTML="Display values";
    label.appendChild(checkbox)
    return label;
  }
  /**
   * @param {MouseEvent} e
   */
  handleMove = (e) => {
    if (!this.mouseDown) {
      return;
    }
    this.camera.x += (e.offsetX - this.mouse.x)/this.meta.ratio;
    this.camera.y += (e.offsetY - this.mouse.y)/this.meta.ratio;
    this.mouse.x = e.offsetX;
    this.mouse.y = e.offsetY;
  };
  /**
   * @param {Event} e
   */
  handleWheel = (e) => {
    let scrollValue = e.deltaY * -0.001;
    if (
      this.meta.ratio - scrollValue > 0 &&
      this.meta.ratio - scrollValue < 10
    ) {
      // handles mouse wheel movements
      this.meta.ratio -= scrollValue;
      this.camera.x +=
        (this.baseW / this.meta.ratio -
          this.baseW / (this.meta.ratio + scrollValue)) /
        2;
      this.camera.y +=
        (this.baseH / this.meta.ratio -
          this.baseH / (this.meta.ratio + scrollValue)) /
        2;
    }
  };
  /**
   * Displays the color legend
   */
  renderInfo = () => {
    context.fillStyle = this.colors.outputs;
    context.fillRect(10, 0, 20, 20);
    let oText = new Text(35, 10, this.colors.outputs, "left");
    oText.content = "outputs";
    oText.render(context);

    context.fillStyle = this.colors.weights;
    context.fillRect(10, 30, 20, 20);
    let wText = new Text(35, 40, this.colors.weights, "left");
    wText.content = "weights";
    wText.render(context);

    context.fillStyle = this.colors.biases;
    context.fillRect(10, 60, 20, 20);
    let bText = new Text(35, 70, this.colors.biases, "left");
    bText.content = "biases";
    bText.render(context);
  };
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
    layers.forEach((layer) => {
      layer.nodes.forEach((node) => {
        node.forwardLinks.forEach((link) => {
          context.strokeStyle = this.colors.weightsText;
          context.lineWidth = Math.abs(link.weight)*this.meta.ratio;
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
        });
      });
    });

    // Render perceptrons as filled circles
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
    if(this.displayNumbers){
      this.renderTexts(nn, layers);
    }
    this.renderInfo();
    // Render data
    if (data) {
      this.renderData(data);
    }
  };
  renderTexts = (nn, layers) => {
    layers.forEach((layer) => {
      layer.nodes.forEach((node) => {
        let text = new Text(
          (node.x + this.camera.x) * this.meta.ratio,
          (node.y + this.camera.y) * this.meta.ratio,
          this.colors.outputs
        );
        text.content = "" + parseFloat(node.computedOutput.toFixed(4));
        text.render(context);
        if (layer !== nn.inputLayer) {
          let text2 = new Text(
            (node.x + this.camera.x) * this.meta.ratio,
            (node.y - this.nodeSize * 1.2 + this.camera.y) * this.meta.ratio,
            this.colors.biases
          );
          text2.content = "" + parseFloat(node.bias.toFixed(4));
          text2.render(context);
        }
        node.forwardLinks.forEach((link) => {
          let text = new Text(
            (link.backward.x +
              (link.forward.x - link.backward.x) / 1.5 +
              this.camera.x) *
              this.meta.ratio,
            (link.backward.y +
              (link.forward.y - link.backward.y) / 1.5 +
              this.camera.y) *
              this.meta.ratio,
            this.colors.weights
          );
          text.content = "" + parseFloat(link.weight.toFixed(4));
          text.render(context);
        });
      });
    });
  };
  renderData = (data) => {
    let iText = new Text(this.baseW, 10, this.colors.infoText, "right");
    iText.content = `Iteration: ${data.iterations}`;
    iText.render(context);

    let lText = new Text(this.baseW, 30, this.colors.infoText, "right");
    lText.content = `Accuracy(300): ${data.accuracyLatter}%`;

    lText.render(context);
    let aText = new Text(this.baseW, 50, this.colors.infoText, "right");
    aText.content = `Accuracy: ${data.accuracy}%`;
    aText.render(context);
  };
}
