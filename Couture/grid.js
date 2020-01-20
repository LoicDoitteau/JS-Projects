function Grid(canvas, rows, cols, cellSize) {
    this.canvas = canvas;
    this.rows = rows;
    this.cols = cols;
    this.cellSize = cellSize;
    this.cells = Array.from({length : rows * cols}, (_, i) => new Cell(canvas, createVector(i %  rows, Math.floor(i / rows)), cellSize, new Color(240, 220, 200)));
}

Grid.prototype.show = function() {
    for (const cell of this.cells) {
        cell.show();
    }
}

Grid.prototype.highlight = function(x, y) {
    const cell = this.cells.find(c => c.position.x == x && c.position.y == y);
    if(cell) cell.highlight();
}