function Track() {
    this.checkPoints = [];
    this.walls = [];
    this.dir = Math.random() < 0.5 ? 1 : -1;

    const startX = random(1000);
    const startY = random(1000);
    const noiseValue = 3;

    const middle = new Vector(width / 2, height / 2);
    for (let i = 0; i < CHECK_POINTS_COUNT; i++) {
        const angle = this.dir * i / CHECK_POINTS_COUNT * TWO_PI - PI * 0.5;
        const xoff = (Math.cos(angle) + 1) * 0.5 * noiseValue + startX;
        const yoff = (Math.sin(angle) + 1) * 0.5 * noiseValue + startY;
        const r = noise(xoff, yoff) * TRACK_RADIUS;
        const p1 = Vector.fromAngle(angle, TRACK_RADIUS + r).add(middle);
        const p2 = Vector.fromAngle(angle, TRACK_RADIUS + r + TRACK_WIDTH).add(middle);
        this.checkPoints.push(new Boundary(p1, p2));
    }

    for (let i = 0; i < CHECK_POINTS_COUNT; i++) {
        const j = (i + 1) % CHECK_POINTS_COUNT;
        const checkPoint = this.checkPoints[i];
        const nextCheckPoint = this.checkPoints[j];
        this.walls.push(new Boundary(checkPoint.p1, nextCheckPoint.p1));
        this.walls.push(new Boundary(checkPoint.p2, nextCheckPoint.p2));
    }
}

Track.prototype.show = function() {
    for (const wall of this.walls) {
        wall.show();
    }
}