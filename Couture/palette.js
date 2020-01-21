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
        rect(i * width / this.colors.length, 0, width / this.colors.length, 20);
    }
    pop();
}

Palette.prototype.average = function() {
    const sum = {r : 0, g : 0, b : 0}
    for (let i = 0; i < this.colors.length; i++) {
        const color = this.colors[i];
        sum.r += color.r;
        sum.g += color.g;
        sum.b += color.b;
    }
    return {r : sum.r / this.colors.length, g : sum.g / this.colors.length, b : sum.b / this.colors.length};
}

Palette.prototype.deviation = function() {
    const sum = {r : 0, g : 0, b : 0}
    const average = this.average();
    for (let i = 0; i < this.colors.length; i++) {
        const color = this.colors[i];
        sum.r += Math.abs(color.r - average.r);
        sum.g += Math.abs(color.g - average.g);
        sum.b += Math.abs(color.b - average.b);
    }
    return {r : sum.r / this.colors.length, g : sum.g / this.colors.length, b : sum.b / this.colors.length};
}