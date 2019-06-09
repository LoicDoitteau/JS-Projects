function Ray(pos, angle) {
    this.pos = pos;
    this.angle = angle;
    this.dir = Vector.fromAngle(angle);
}

Ray.prototype.show = function() {
    push();
    stroke(255);
    strokeWeight(1);
    translate(this.pos.x, this.pos.y);
    line(0, 0, this.dir.x * 10000, this.dir.y * 10000);
    pop();
}

Ray.prototype.rotate = function(angle) {
    this.dir = Vector.fromAngle(this.angle + angle);
}

Ray.prototype.cast = function(boundary) {
    const x1 = boundary.p1.x;
    const y1 = boundary.p1.y;
    const x2 = boundary.p2.x;
    const y2 = boundary.p2.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
        return;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (t > 0 && t < 1 && u > 0) {
        const x = x1 + t * (x2 - x1);
        const y = y1 + t * (y2 - y1);
        return new Vector(x, y);
    } else {
        return null;
    }
}