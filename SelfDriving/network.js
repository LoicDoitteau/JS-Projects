function Network(inputLayer, hiddenLayers, outputLayer) {
    this.inputLayer = inputLayer;
    this.hiddenLayers = hiddenLayers;
    this.outputLayer = outputLayer;
    this.layers = [inputLayer, ...hiddenLayers, outputLayer];
    this.weigths = [];
    this.biases = [];
    this.gradients = [];
    this.init();
}

Network.prototype.init = function() {
    this.weigths = Array.from({length : this.layers.length - 1}, (_, i) => new Matrix(this.layers[i + 1].size, this.layers[i].size).randomize());
    this.biases = Array.from({length : this.layers.length - 1}, (_, i) => new Matrix(this.layers[i + 1].size, 1));
}

Network.prototype.copy = function() {
    var inputLayer = this.inputLayer.copy();
    var hiddenLayers = this.hiddenLayers.map(l => l.copy());
    var outputLayer = this.outputLayer.copy();
    var weights = this.weigths.map(w => w.copy());
    var biases = this.biases.map(b => b.copy());
    var network = new Network(inputLayer, hiddenLayers, outputLayer);
    network.weigths = weights;
    network.biases = biases;
    return network;
}

Network.prototype.feedForward = function(input) {
    feedLayer(this, 0, Matrix.fromArray(input));
    return this.outputLayer.neurons.toArray();
}

Network.prototype.mutate = function(rate) {
    for (const weight of this.weigths) {
        weight.map((x, i, j) => {
            if(Math.random() < rate) return x + Math.random() * 0.4 - 0.2;
            return x;
        });
    }
    for (const bias of this.biases) {
        bias.map((x, i, j) => {
            if(Math.random() < rate) return x + Math.random() * 0.4 - 0.2;
            return x;
        });
    }
    return this;
}

Network.prototype.log = function() {
    console.group("Network");
    this.layers.forEach((layer, i) => layer.log(this.weigths[i], this.biases[i - 1]));
    console.groupEnd();
}

function feedLayer(network, i, input) {
    let layer = network.layers[i];
    layer.neurons = input;

    if(i == network.layers.length - 1) return;

    layer = network.layers[i + 1];
    input = Matrix.dotProduct(network.weigths[i], input)
            .add(network.biases[i])
            .map(layer.activationFunction);

    feedLayer(network, i + 1, input);
}
