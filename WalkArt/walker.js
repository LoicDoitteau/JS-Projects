function Walker()
{
    this.reset();
}

Walker.prototype.reset = function()
{
    this.position = new Position(floor(random(width)), floor(random(height)));
    this.stack = [this.position];
    this.walked = [];
    var c = {r : random(256), g : random(256), b : random(256)};
    this.walked[this.position.x + this.position.y * width] = c;
    stroke(color(c.r, c.g, c.b));
    point(this.position.x, this.position.y);
}

Walker.prototype.update = function()
{
    if(this.stack.length > 0)
    {
        var freeNeighbors = this.getFreeNeighbors(1);
        if(freeNeighbors.length > 0)
        {
            this.position = random(freeNeighbors);
            this.stack.push(this.position);
            var fullNeighbors = this.getFullNeighbors(2);
            var c = fullNeighbors.map(n => this.walked[n.x + n.y * width]).reduce((t, c, i) => ({r : t.r + c.r, g : t.g + c.g, b : t.b + c.b}));
            c.r = c.r / fullNeighbors.length + random(-1, 1);
            c.g = c.g / fullNeighbors.length + random(-1, 1);
            c.b = c.b / fullNeighbors.length + random(-1, 1);
            this.walked[this.position.x + this.position.y * width] = c; 
            stroke(color(c.r, c.g, c.b));
            point(this.position.x, this.position.y);
        }
        else
        {
            this.position = this.stack.pop();
        }
    }
}

Walker.prototype.getFreeNeighbors = function(distance)
{
    var neighbors = [];
    for(var x = -distance; x <= distance; x++)
    {
        for(var y = -distance; y <= distance; y++)
        {
            if(!(x == 0 && y == 0) &&
                abs(x) + abs(y) <= distance &&
                this.position.x + x >= 0 &&
                this.position.x + x < width &&
                this.position.y + y >= 0 && 
                this.position.y + y < height
                && this.walked[this.position.x + x + (this.position.y + y) * width] === undefined)
            {
                neighbors.push(new Position(this.position.x + x, this.position.y + y))
            }
        }
    }
    return neighbors;
}

Walker.prototype.getFullNeighbors = function(distance)
{
    var neighbors = [];
    for(var x = -distance; x <= distance; x++)
    {
        for(var y = -distance; y <= distance; y++)
        {
            if(!(x == 0 && y == 0) &&
                abs(x) + abs(y) <= distance &&
                this.position.x + x >= 0 &&
                this.position.x + x < width &&
                this.position.y + y >= 0 && 
                this.position.y + y < height
                && this.walked[this.position.x + x + (this.position.y + y) * width] !== undefined)
            {
                neighbors.push(new Position(this.position.x + x, this.position.y + y))
            }
        }
    }
    return neighbors;
}