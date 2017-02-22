function Quadtree(level, quad)
{
	this.maxLevels = 10;
	this.maxObjects = 1;
	this.objects = [];
	this.nodes = [];
	this.level = level;
	this.quad = quad;
}

Quadtree.prototype.clear = function()
{
	this.objects = [];
	for (var i = 0; i < this.nodes.length; i++) 
	{
		this.nodes[i].clear();
	}
	this.nodes = [];
}

Quadtree.prototype.split = function()
{
	var subWidth = this.quad.width / 2;
	var subHeight = this.quad.height / 2;

	this.nodes.push(new Quadtree(this.level + 1, new Quad(this.quad.pos.x, this.quad.pos.y, subWidth, subHeight)));
	this.nodes.push(new Quadtree(this.level + 1, new Quad(this.quad.pos.x + subWidth, this.quad.pos.y, subWidth, subHeight)));
	this.nodes.push(new Quadtree(this.level + 1, new Quad(this.quad.pos.x + subWidth, this.quad.pos.y + subHeight, subWidth, subHeight)));
	this.nodes.push(new Quadtree(this.level + 1, new Quad(this.quad.pos.x, this.quad.pos.y + subHeight, subWidth, subHeight)));
}

Quadtree.prototype.indexOf = function(object)
{
	var subWidth = this.quad.width / 2;
	var subHeight = this.quad.height / 2;

	var top = object.quad.pos.y >= this.quad.pos.y && object.quad.pos.y + object.quad.height <= this.quad.pos.y + subHeight;
	var bottom = object.quad.pos.y >= this.quad.pos.y + subHeight && object.quad.pos.y + object.quad.height <= this.quad.pos.y + this.quad.height;

	if(object.quad.pos.x >= this.quad.pos.x && object.quad.pos.x + object.quad.width <= this.quad.pos.x + subWidth)
	{
		if(top)
		{
			return 0;
		}
		if(bottom)
		{
			return 3;
		}
	}
	else if(object.quad.pos.x >= this.quad.pos.x + subWidth && object.quad.pos.x + object.quad.width <= this.quad.pos.x + this.quad.width)
	{
		if(top)
		{
			return 1;
		}
		if(bottom)
		{
			return 2;
		}
	}
	return -1;
}

Quadtree.prototype.insert = function(object)
{
	if(this.nodes.length > 0)
	{
		var index = this.indexOf(object)
		if(index != -1)
		{
			this.nodes[index].insert(object);
			return;
		}
	}

	this.objects.push(object);

	if(this.objects.length > this.maxObjects && this.level < this.maxLevels)
	{
		this.split();
		for (var i = this.objects.length - 1; i >= 0; i--) 
		{
			var index = this.indexOf(this.objects[i]);
			if(index != -1)
			{
				this.nodes[index].insert(this.objects.splice(i, 1)[0]);
			}
		}
	}
}

Quadtree.prototype.retrieve = function(returnObjects, object)
{
	if(this.quad.intersects(object.quad))
	{
		for(var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].retrieve(returnObjects, object);
		}
		Array.prototype.push.apply(returnObjects, this.objects);
	}
	return returnObjects;
}

Quadtree.prototype.show = function()
{
	// for(var i = 0; i < objects.length; i++)
	// {
	// 	this.objects[i].quad.show();
	// }
	if(this.nodes.length == 0)
	{
		this.quad.show();
		return;
	}
	else
	{
		for(var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].show();
		}
	}
}