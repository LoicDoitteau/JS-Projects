function Palette(...colors) {
    this.colors = colors;
}

Palette.prototype.findClosest = function(other) {
    closest = null;
    distance = null;

    for (const color of this.colors) {
        const d = color.squareDistance(other);
        if(closest == null || d < distance) {
            closest = color;
            distance = d
        }
    }

    return closest;
}

Palette.prototype.findClosestVision = function(other) {
    closest = null;
    distance = null;

    for (const color of this.colors) {
        const d = color.visionDistance(other);
        if(closest == null || d < distance) {
            closest = color;
            distance = d
        }
    }

    return closest;
}

Palette.prototype.show = function() {
    push();
    noStroke();
    for (let i = 0; i < this.colors.length; i++) {
        const color = this.colors[i];
        fill(color.r, color.g, color.b);
        rect(i * 20, 0, 20, 20);
    }
    pop();
}