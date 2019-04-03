
let shapes = [[
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

let selectedPoint = null;
let hoveredPoint = null;

function setup() {
    createCanvas(500, 500);
    for(const points of shapes) {
        for(let i = 0; i < points.length; i++) {
            points[i].prev = points[i == 0 ? points.length - 1 : i - 1];
            points[i].next = points[i == points.length - 1 ? 0 : i + 1];
        }
    }
}

function mouseDragged() {
    const mouseP = {x : mouseX, y : mouseY};
    for(const points of shapes) {
        for(const p of points) {
            if(dist(mouseP, p) <= 7) {
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

function draw() {
    background(52);
    updateShapes();
    drawShapes(checkIntersections());
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

function updateShapes() {
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

function drawShapes(intersects) {
    noFill();
    intersects ? stroke(200, 52, 52) : stroke(200);
    strokeWeight(1);
    for(const points of shapes) {
        beginShape();
        for(const p of points) vertex(p.x, p.y);
        endShape(CLOSE);
    }
    fill(200);
    const mouseP = {x : mouseX, y : mouseY};
    hoveredPoint = null;
    for(const points of shapes) {
        for(const p of points) {
            fill(200);
            if(dist(mouseP, p) <= 7) {
                hoveredPoint = p;
                fill(200, 52, 52);
            } else if(dist(mouseP, p.prev) <= 7) {
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
    text("Press 'Space' to resize selected segment to 100", 20, 20);
    textAlign(CENTER);
    const mouseP = {x : mouseX, y : mouseY};
    for(const points of shapes) {
        for(const p of points) {
            fill(52, 255, 255);
            const pos = {x : (p.x + p.next.x) / 2, y : (p.y + p.next.y) / 2};
            text(Math.round(dist(p, p.next)), pos.x, pos.y);
            fill(52, 255, 52);
            if(dist(mouseP, p) <= 7) text(Math.round(radToDeg(angle(p.prev, p.next, p))), p.x, p.y);
        }
    }
}

// https://www.quora.com/How-do-I-know-if-any-two-given-polygons-intersect-overlap
function checkIntersections() {
    return checkBoundingBoxes() && checkEdges() && checkPoints();
}

function checkBoundingBoxes() {
    var boxes = shapes.map(s => s.reduce((b, p) => {
        if(p.x > b.xMax) b.xMax = p.x;
        if(p.x < b.xMin) b.xMin = p.x;
        if(p.y > b.yMax) b.yMax = p.y;
        if(p.y < b.yMin) b.yMin = p.y;
        return b;
    }, {xMin : Infinity, yMin : Infinity, xMax : -Infinity, yMax : -Infinity}));

    for(const box1 of boxes) {
        for(const box2 of boxes) {
            if(box1 == box2) continue;
            if(!(box1.xMax < box2.xMin || box1.xMin > box2.xMax || box1.yMax < box2.yMin || box1.yMin > box2.yMax)) return true;
        }
    }

    return false;
}

// https://www.swtestacademy.com/intersection-convex-polygons-algorithm/
function checkEdges() {
    for(const shape1 of shapes) {
        for(const shape2 of shapes) {
            if(shape1 == shape2) continue;
            for(const p1 of shape1) {
                const a1 = p1.next.y - p1.y;
                const b1 = p1.x - p1.next.x;
                const c1 = a1 * p1.x + b1 * p1.y
                for(const p2 of shape2) {
                    const a2 = p2.next.y - p2.y;
                    const b2 = p2.x - p2.next.x;
                    const c2 = a2 * p2.x + b2 * p2.y

                    const det = a1 * b2 - a2 * b1;
                    // if(det == 0) continue;

                    const x = (b2 * c1 - b1 * c2) / det;
                    const y = (a1 * c2 - a2 * c1) / det;

                    const online1 = ((Math.min(p1.x, p1.next.x) <= x)
                    && (Math.max(p1.x, p1.next.x) >= x)
                    && (Math.min(p1.y, p1.next.y) <= y)
                    && (Math.max(p1.y, p1.next.y) >= y));
                    const online2 = ((Math.min(p2.x, p2.next.x) <= x)
                    && (Math.max(p2.x, p2.next.x) >= x)
                    && (Math.min(p2.y, p2.next.y) <= y)
                    && (Math.max(p2.y, p2.next.y) >= y));

                    if(online1 && online2) return true;
                }
            }
        }
    }
    return false;
}

// https://stackoverflow.com/questions/217578/how-can-i-determine-whether-a-2d-point-is-within-a-polygon
function checkPoints() {
    for(const shape1 of shapes) {
        for(const shape2 of shapes) {
            if(shape1 == shape2) continue;
            for(const p1 of shape1) {
                let inside = false;
                for(const p2 of shape2) {
                    if(((p2.next.y > p1.y) != (p2.y > p1.y)) && p1.x < (p2.x - p2.next.x) * (p1.y - p2.next.y) / (p2.y - p2.next.y) + p2.next.x) inside = !inside
                }
                if(inside) return true;
            }
        }
    }
    return false;
}