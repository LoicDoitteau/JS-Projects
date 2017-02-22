function Quad(x, y, width, height)
{
	this.pos = createVector(x, y);
	this.width = width;
	this.height = height;
}

Quad.prototype.contains = function(x, y)
{
	return this.pos.x <= x && this.pos.x + this.width >= x && this.pos.y  <= y && this.pos.y + this.height >= y
}

Quad.prototype.intersects = function(other)
{
	return !(this.pos.y + this.height < other.pos.y || this.pos.y > other.pos.y + other.height || this.pos.x + this.width < other.pos.x || this.pos.x > other.pos.x + other.width);
}

Quad.prototype.inside = function(other)
{
	return this.pos.y + this.height < other.pos.y + other.height && this.pos.y > other.pos.y && this.pos.x + this.width < other.pos.x + other.width && this.pos.x > other.pos.x;
}

Quad.prototype.show = function()
{
	stroke(255, 128, 0)
	noFill();
	quad(this.pos.x, this.pos.y, this.pos.x + this.width, this.pos.y, this.pos.x + this.width, this.pos.y + this.height, this.pos.x, this.pos.y + this.height);
}