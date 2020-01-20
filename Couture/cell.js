function Cell(canvas, position, size, color) {
    this.canvas = canvas;
    this.position = position;
    this.size = size;
    this.color = color;
}

Cell.prototype.show = function() {
    push();
    // canvas.strokeWeight(0.2);
    // canvas.stroke(52, 30, 48);
    canvas.noStroke();
    canvas.fill(this.color.r, this.color.g, this.color.b);
    canvas.rect(this.position.x * this.size, this.position.y * this.size, this.size, this.size);
    pop();
}

Cell.prototype.highlight = function() {
    push();
    strokeWeight(1);
    stroke(52, 30, 48);
    fill(this.color.r, this.color.g, this.color.b);
    rect(this.position.x * this.size - this.size, this.position.y * this.size - this.size, this.size * 4, this.size * 4);
    pop();
}