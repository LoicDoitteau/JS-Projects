function Color(r, g, b) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
}

Color.prototype.error = function(other) {
    return {r : this.r - other.r, g : this.g - other.g, b : this.b - other.b};
}

Color.prototype.squareDistance = function(other) {
    return Math.pow(this.r - other.r, 2) + Math.pow(this.g - other.g, 2) + Math.pow(this.b - other.b, 2);
}

Color.prototype.visionDistance = function(other) {
    const luma1 = (this.r * 0.299 + this.g * 0.587 + this.b * 0.114) / 255;
    const luma2 = (other.r * 0.299 + other.g * 0.587 + other.b * 0.114) / 255;
    const dLuma = luma1 - luma2;
    const dR = (this.r - other.r) / 255;
    const dG = (this.g - other.g) / 255;
    const dB = (this.b - other.b) / 255;
    return (dR * dR * 0.299 + dG * dG *0.587 + dB * dB * 0.114) * 0.75 + dLuma*dLuma;
}