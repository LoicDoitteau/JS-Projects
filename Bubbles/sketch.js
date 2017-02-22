var field;
var bubbles = [];
var maxBubbles = 300;
var particles = [];
var quadtree;
var showField;
var showQuadtree;

function setup() 
{
	createCanvas(600, 600);
	field = new Field(20);
	quadtree = new Quadtree(0, new Quad(0, 0, width, height));
	showField = createCheckbox('Flow field', false);
	showQuadtree = createCheckbox('Quad tree', false);
}

function mousePressed()
{
	var x = mouseX;
	var y = mouseY;
	bubbles.push({item: new Bubble(x, y), quad : new Quad(x - 1, y - 1, 2, 2)});
}

function draw() 
{
	background(50, 50, 50);
	quadtree.clear();
	field.update();
	if(showField.checked())
	{
		field.show();
	}

	if(bubbles.length < maxBubbles)
	{
		var attemps = 0;
		var done = false;
		do
		{
			var bubble = newBubble();
			if(bubble != null)
			{
				bubbles.push(bubble);
				done = true;
			}
			else
			{
				done = ++attemps < 100;
			}
		}
		while(!done)
	}

	for(var i = 0; i < bubbles.length; i++)
	{
		var bubble = bubbles[i];
		bubble.quad.pos.x = bubble.item.pos.x - bubble.item.r;
		bubble.quad.pos.y = bubble.item.pos.y - bubble.item.r;
		bubble.quad.width = bubble.item.r * 2;
		bubble.quad.height = bubble.item.r * 2;
		quadtree.insert(bubble);
	}
	for(var i = 0; i < bubbles.length; i++)
	{
		var bubble = bubbles[i];
		if(bubble.item.isGrowing)
		{
			if(bubble.item.edges())
			{
				bubble.item.isGrowing = false;
			}
			else
			{
				var others = quadtree.retrieve([], bubble);
				for (var j = 0; j < others.length; j++)
				{
					var other = others[j];
					if(other != bubble)
					{
						var d = dist(bubble.item.pos.x, bubble.item.pos.y, other.item.pos.x, other.item.pos.y) - bubble.item.r - other.item.r;
						if(d <= 1)
						{
							bubble.item.isGrowing = false;
							break;
						}
					}
				}
			}
		}
	}
	if(showQuadtree.checked())
	{
		quadtree.show();
	}
	for(var i = bubbles.length - 1; i >= 0; i--)
	{
		var bubble = bubbles[i];
		if(bubble.item.isGrowing)
		{
			bubble.item.follow(field);
			bubble.item.update();
			bubble.item.show();
		}
		else
		{
			bubbles.splice(i,1);
		}
	}
}

function newBubble()
{
	var x = random(width);
	var y = random(height);
 	var bubble = {item: new Bubble(x, y), quad : new Quad(x - 1, y - 1, 2, 2)};

	var valid = true;
	var others = quadtree.retrieve([], bubble);
	for (var i = 0; i < others.length; i++)
	{
		var other = others[i];
		var d = dist(bubble.item.pos.x, bubble.item.pos.y, other.item.pos.x, other.item.pos.y) - bubble.item.r - other.item.r;
		if(d <= 1)
		{
			valid = false;
			break;
		}
	}
  	if (valid) 
  	{
		return bubble;
  	}
	return null;
}