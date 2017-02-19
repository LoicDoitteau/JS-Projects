var walker;

function setup()
{
    createCanvas(windowWidth, windowHeight);
    background(50);
    walker = new Walker();
}

function draw()
{
    for(var i = 0 ; i < 500; i++)
    {
        walker.update();
    }
}