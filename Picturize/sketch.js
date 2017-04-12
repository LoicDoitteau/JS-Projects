var particles = [];
var particlesCount = 20;
var maxStep = 50;
var img;
var pixels;
var iterations = 20;

function preload()
{
	img = loadImage("https://s-media-cache-ak0.pinimg.com/736x/ae/8a/a9/ae8aa90f5d7532b6b691fada3e1a0aa5.jpg");
	//img = loadImage("pika.jpg");
}

function setup()
{
	createCanvas(img.width, img.height);
	stroke(255, 10);
	image(img, 0, 0);
	img = get(0, 0, width, height);
	img.loadPixels();
	pixels = img.pixels;
	background(0);
	for(var i = 0; i < particlesCount; i++)
	{
		particles.push(new Particle(random(width), random(height)));
	}
}

function draw()
{
	background(0, 1);
	for(var i = 0; i < particlesCount; i++)
	{
		for(var j = 0; j < iterations; j++)
		{			
			var x = floor(particles[i].x);
			var y = floor(particles[i].y);
			var off = (y * width + x) * 4; 
			var m = (pixels[off] + pixels[off+1] + pixels[off+2]) / 3;
			var stepSize = map(m, 255, 0, 15, 1);
			stroke(pixels[off], pixels[off+1], pixels[off+2], 50);
			particles[i].move(stepSize);
			particles[i].show();
		}
	}
}

function Particle(x, y)
{
	this.x = x;
	this.y = y;
	this.xOld = x;
	this.yOld = y;
}

Particle.prototype.move = function(step)
{
	this.xOld = this.x;
	this.yOld = this.y;
	this.x += random(-step, step);
	this.y += random(-step, step);
	
	if(this.x < 0) this.x = 0;
	if(this.x > width - 1) this.x = width - 1;
	if(this.y < 0) this.y = 0;
	if(this.y > height - 1) this.y = height - 1;
}

Particle.prototype.show = function()
{
	line(this.xOld, this.yOld, this.x, this.y);
}