
let points = [
    {x : 100, y : 100},
    {x : 400, y : 100},
    {x : 400, y : 400},
    {x : 100, y : 400}
];

let selectedPoint = null;
let hoveredPoint = null;

function setup() {
    createCanvas(500, 500);
    for(let i = 0; i < points.length; i++) {
        points[i].prev = points[i == 0 ? points.length - 1 : i - 1];
        points[i].next = points[i == points.length - 1 ? 0 : i + 1];
    }
}

function mouseDragged() {
    const mouseP = {x : mouseX, y : mouseY};
    for(const p of points) {
        if(dist(mouseP, p) <= 5) {
            selectedPoint = p;
            break;
        }
    }
    return false;
}

function mouseReleased() {
    selectedPoint = null;
    return false;
}

function doubleClicked() {
    points[0].x = random(0, width);
    return false;
}

function draw() {
    background(52);
    updateShape();
    drawShape();
    drawUI();
}

const dist = (p1, p2) => Math.sqrt((p2.y - p1.y) * (p2.y - p1.y) + (p2.x - p1.x) * (p2.x - p1.x));
const angle = (p1, p2, c) => {
    const dp1c = dist(p1, c);
    const dp2c = dist(p2, c);
    const dp1p2 = dist(p1, p2);
    return Math.acos((dp1c * dp1c + dp2c * dp2c - dp1p2 * dp1p2) / (2 * dp1c * dp2c));
}
const radToDeg = (a) => a * 180 / Math.PI;
const degToRad = (a) => a * Math.PI / 180;
const rot = (p, l, a) => { return {x : p.x + l * Math.cos(a), y : p.y + l * Math.sin(a)}; }

function updateShape() {
    if(mouseIsPressed && selectedPoint) {
        selectedPoint.x = mouseX;
        selectedPoint.y = mouseY;
    }
    if(keyIsPressed && keyCode == 32 && hoveredPoint) {
        const t = 100 / dist(hoveredPoint, hoveredPoint.next);
        hoveredPoint.x = hoveredPoint.x * t + hoveredPoint.next.x * (1 - t);
        hoveredPoint.y = hoveredPoint.y * t + hoveredPoint.next.y * (1 - t);
    }
}

function drawShape() {
    noFill();
    stroke(200);
    strokeWeight(1);
    beginShape();
    for(const p of points) vertex(p.x, p.y);
    endShape(CLOSE);
    fill(200);
    const mouseP = {x : mouseX, y : mouseY};
    hoveredPoint = null;
    for(const p of points) {
        fill(200);
        if(dist(mouseP, p) <= 5) {
            hoveredPoint = p;
            fill(200, 52, 52);
        } else if(dist(mouseP, p.prev) <= 5) {
            fill(200, 52, 52);
        }
        ellipse(p.x, p.y, 10);
    }
}

function drawUI() {
    noStroke();
    fill(200);
    textAlign(LEFT);
    text("Press 'Space' to resize selected segment to 100", 20, 20);
    textAlign(CENTER);
    const mouseP = {x : mouseX, y : mouseY};
    for(const p of points) {
        fill(52, 255, 255);
        const pos = {x : (p.x + p.next.x) / 2, y : (p.y + p.next.y) / 2};
        text(Math.round(dist(p, p.next)), pos.x, pos.y);
        fill(52, 255, 52);
        if(dist(mouseP, p) <= 5) text(Math.round(radToDeg(angle(p.prev, p.next, p))), p.x, p.y);
    }
}