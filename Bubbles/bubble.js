function Bubble(x, y)
{
	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.r = 1;
	this.maxspeed = 4;
	this.isGrowing = true;
}

Bubble.prototype.update = function()
{
	if(this.isGrowing)
	{
		this.r++;
	}
	this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
}

Bubble.prototype.follow = function(field) 
{
    var x = floor(this.pos.x / field.scale);
    var y = floor(this.pos.y / field.scale);
    var index = x + y * field.cols;
    var force = field.forces[index];
    force.setMag(1);
    this.applyForce(force);
}

Bubble.prototype.applyForce = function(force) 
{
    this.acc.add(force);
}

Bubble.prototype.show = function()
{
	stroke(255);
	fill(255, 10)
	ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
	noFill();
	//var rotation = millis() / 1000 / 10 * TWO_PI;
	var rotation = 0;
	arc(this.pos.x, this.pos.y, this.r * 1.6, this.r * 1.6, rotation, rotation + HALF_PI)
}

Bubble.prototype.edges = function()
{
	return (this.pos.x + this.r >= width - 1 || this.pos.x - this.r <= 1 || this.pos.y + this.r >= height - 1 || this.pos.y - this.r <= 1)
}