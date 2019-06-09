function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
}

Vector.prototype.sub = function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
}

Vector.prototype.dot = function(vector) {
    return this.x * vector.x + this.y * vector.y;
}

Vector.prototype.mul = function(amount) {
    this.x *= amount;
    this.y *= amount;
    return this;
}

Vector.prototype.div = function(amount) {
    this.x /= amount;
    this.y /= amount;
    return this;
}

Vector.prototype.normalize = function() {
    const mag = this.getMag();
    return mag == 0 ? this : this.div(mag);
}

Vector.prototype.set = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
}

Vector.prototype.setMag = function(magnitude) {
    return this.normalize().mul(magnitude);
}

Vector.prototype.getMag = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector.prototype.limit = function(max) {
    return this.getMag() < max ? this : this.setMag(max);
}

Vector.prototype.heading = function() {
    return Math.atan2(this.y, this.x);
}

Vector.prototype.rotate = function(angle) {
    const newHeading = this.heading() + angle;
    const mag = this.getMag();
    this.x = mag * Math.cos(newHeading);
    this.y = mag * Math.sin(newHeading);
    return this;
}

Vector.prototype.dist = function(vector) {
    return vector.copy().sub(this).getMag();
}

Vector.prototype.copy = function() {
    return new Vector(this.x, this.y)
}

Vector.fromAngle = function(angle, magnitude = 1) {
    return new Vector(Math.cos(angle), Math.sin(angle)).setMag(magnitude);
}