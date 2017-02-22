function Field(scale)
{
    this.scale = scale;
    this.zOff = 0;
    this.forces = [];
    this.cols = floor(width / scale);
  	this.rows = floor(height / scale);
    this.dx = 0.1;
    this.dy = 0.1;
    this.dz = 0.0009;
}

Field.prototype.update = function()
{
    var xOff = 0;
	for(var x = 0; x < this.cols; x++)
	{
		var yOff = 0;
		for(var y = 0; y < this.rows; y++)
		{
            var angle = noise(xOff, yOff, this.zOff) * TWO_PI * 4;
            var v = p5.Vector.fromAngle(angle);
            v.setMag(1);
			this.forces[x + y * this.cols] = v;
			yOff += this.dy;
		}
		xOff += this.dx;
	}
	this.zOff += this.dz;
}

Field.prototype.show = function()
{
    //noStroke();
    stroke(0, 255, 255);
	for(var x = 0; x < this.cols; x++)
	{
		for(var y = 0; y < this.rows; y++)
		{
			push();
			translate((x+0.5) * this.scale, (y+0.5) * this.scale);
            rotate(this.forces[x + y * this.cols].heading());
            line(0, 0, this.scale / 2, 0);
			pop();
		}
	}
}