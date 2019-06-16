function Grid(cellWidth, cellHeight) {
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
}

Grid.prototype.show = function() {
    stroke(52, 30, 48);
    fill(240, 220, 200);
    for(let x = 0; x < width; x += this.cellWidth) {
        for(let y = 0; y < height; y += this.cellHeight) {
            rect(x, y, this.cellWidth, this.cellHeight);
        }
    }
}

Grid.prototype.highlight = function(x, y) {
    stroke(52, 30, 48);
    fill(240, 220, 200);
    const posX = x - x % this.cellWidth;
    const posY = y - y % this.cellWidth;
    rect(posX - this.cellWidth / 2, posY - this.cellHeight / 2, this.cellWidth * 2, this.cellHeight * 2);
}