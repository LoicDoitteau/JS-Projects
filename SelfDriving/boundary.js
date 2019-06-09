function Boundary(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
}

Boundary.prototype.show = function() {
    stroke(255);
    strokeWeight(1);
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y)
}

Boundary.prototype.midPoint = function() {
    return new Vector((this.p1.x + this.p2.x) * 0.5, (this.p1.y + this.p2.y) * 0.5);
}

Boundary.prototype.closestPoint = function(vector) {
    const p1 = this.p1.copy();
    const p2 = this.p2.copy();
    const p3 = vector.copy();
    const v = p2.sub(p1);
    const u = p3.sub(p1);
    const uv = u.dot(v);
    const vv = v.dot(v);
    const t = Math.max(Math.min(uv / vv, 1), 0);
    return p1.add(v.mul(t));
}

Boundary.prototype.dist = function(vector) {
    return this.closestPoint(vector).sub(vector).getMag();
}