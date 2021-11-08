
const shapes = [[
    {x : 100, y : 100},
    {x : 200, y : 100},
    {x : 200, y : 200},
    {x : 100, y : 200}
], [
    {x : 300, y : 300},
    {x : 400, y : 300},
    {x : 400, y : 400},
    {x : 300, y : 400}
]];

let drawingShape = [];
let drawing = false;

let selectedPoint = null;
let hoveredPoint = null;

let mirrorMode;

function setup() {
    createCanvas(500, 500);
    mirrorMode = createCheckbox('Mirror mode', false);
}

function mouseDragged() {
    const mouseP = {x : mouseX, y : mouseY};
    for (const points of shapes) {
        for (const p of points) {
            if (dist(mouseP, p) <= 7) {
                selectedPoint = p;
                break;
            }
        }
    }
    return false;
}

function mouseReleased() {
    selectedPoint = null;
    return false;
}

function mousePressed() {
    if (!hoveredPoint) {
        const mouseP = {x : mouseX, y : mouseY};

        if (mouseP.x > 500 || mouseP.y > 500) return false;

        if (drawingShape.length > 1 && dist(drawingShape[0], mouseP) <= 7) {
            drawing = false;
            const mirrorShape = [];

            if (mirrorMode.checked() && drawingShape.length > 2) {
                var p1 = drawingShape[0];
                var p2 = drawingShape[drawingShape.length - 1];
    
                
                for (const p of drawingShape) {
                    if (p == p1 || p == p2) continue;
                    const v = sub(project(p, p1, p2), p);
                    mirrorShape.push({x : p.x + v.x * 2, y : p.y + v.y * 2});
                };
            }

            shapes.push(drawingShape.concat(mirrorShape.reverse()));
            drawingShape = [];
        }
        else {
            drawing = true;
            drawingShape.push(mouseP);
        }
    }
    return false;
}

function draw() {
    background(52);
    updateShapes();
    drawShapes();
    drawUI();
}

const squareDist = (p1, p2) => (p2.y - p1.y) * (p2.y - p1.y) + (p2.x - p1.x) * (p2.x - p1.x);
const dist = (p1, p2) => Math.sqrt(squareDist(p1, p2));
const dot = (p1, p2) => p1.x * p2.x + p1.y * p2.y;
const sum = (p1, p2) => ({x : p1.x + p2.x, y : p1.y + p2.y});
const sub = (p1, p2) => ({x : p1.x - p2.x, y : p1.y - p2.y});
const project = (p, p1, p2) =>
{
    const v1 = sub(p, p1);
    const v2 = sub(p2, p1);
    const d1 = dot(v1, v2);
    const d2 = dot(v2, v2);
    const t = d1 / d2;
    return {x : p1.x + t * v2.x, y : p1.y + t * v2.y};
}

function updateShapes() {
    if (mouseIsPressed && selectedPoint) {
        selectedPoint.x = mouseX;
        selectedPoint.y = mouseY;
    }
}

function drawShapes() {
    const mouseP = {x : mouseX, y : mouseY};

    noFill();
    stroke(200);
    strokeWeight(1);

    for (const shape of shapes) {
        beginShape();
        for (const p of shape) vertex(p.x, p.y);
        endShape(CLOSE);
    }

    if (drawingShape.length > 0) {
        beginShape();
        for (const p of drawingShape) vertex(p.x, p.y);
        vertex(mouseP.x, mouseP.y);
        endShape();

        if (mirrorMode.checked() && drawingShape.length > 2) {
            drawingContext.setLineDash([5, 5]);

            var p1 = drawingShape[0];
            var p2 = drawingShape[drawingShape.length - 1];

            stroke(200, 52, 52);
            line(p1.x, p1.y, p2.x, p2.y);
            stroke(lerp(200 , 52, (sin(frameCount * 0.1) * 0.5 + 0.5)));
            
            beginShape();
            vertex(p1.x, p1.y);
            for (const p of drawingShape) {
                if (p == p1 || p == p2) continue;
                const v = sub(project(p, p1, p2), p);
                vertex(p.x + v.x * 2, p.y + v.y * 2);
            }
            vertex(p2.x, p2.y);
            endShape();

            stroke(200);
            drawingContext.setLineDash([]);
        }
    }

    fill(200);
    hoveredPoint = null;

    for (const points of shapes) {
        for (const p of points) {
            fill(200);
            if (dist(mouseP, p) <= 7) {
                hoveredPoint = p;
                fill(200, 52, 52);
            }
            ellipse(p.x, p.y, 13);
        }
    }
}

function drawUI() {
    noStroke();
    fill(200);
    textAlign(LEFT);
    text("Press to play", 20, 20);
    textAlign(CENTER);
}
