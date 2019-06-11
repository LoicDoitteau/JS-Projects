function Car(pos, angle) {
    this.pos = pos;
    this.acc = 0;
    this.vel = 0;
    this.dir = Vector.fromAngle(angle);
    this.rays = [];
    for(let i = -PI / 4; i <= PI / 4; i+= PI / 8) this.rays.push(new Ray(pos, i));
    this.maxspeed = 5;
    this.dead = false;
    this.index = 0;
    this.fitness = 0;
    this.life = 100;
    this.sight = 100;
    this.brain = new Network(
        new Layer(this.rays.length + 1),
        [new Layer(this.rays.length * 2, sigmoid)],
        new Layer(3, sigmoid)
    );
}

Car.prototype.show = function() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.dir.heading());
    stroke(255);
    fill(255, 100);
    rectMode(CENTER);
    rect(0, 0, 10, 5);
    pop();
}

Car.prototype.highlight = function() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.dir.heading());
    strokeWeight(1);
    stroke(0, 255, 0);
    fill(0, 255, 0, 100);
    rectMode(CENTER);
    rect(0, 0, 10, 5);
    pop();

}

Car.prototype.accelerate = function(amount) {
    this.acc += amount * 0.1;
}

Car.prototype.brake = function(amount) {
    this.vel *= (1 - amount * 0.1);
}

Car.prototype.rotate = function(amount) {
    this.dir.rotate(amount * 0.1 * this.vel / this.maxspeed);
}

Car.prototype.autoPilot = function(boundaries) {
    const output = this.brain.feedForward([
        ...this.rays.map(ray => {
            const dist = boundaries
                .map(b => ray.cast(b))
                .filter(p => p)
                .map(p => ray.pos.dist(p))
                .sort()
                .find(d => d < this.sight);
            if(dist) return 1 - dist / this.sight;
            else return 0;
        }),
        this.vel / this.maxspeed
    ]);

    this.accelerate(output[0]);
    this.brake(output[1]);
    this.rotate(output[2] * 2 - 1);
}

Car.prototype.update = function() {
    if(this.life-- < 0) this.dead = true;
    if(this.acc == 0) this.vel *= 0.98;
    this.vel += this.acc;
    this.vel = Math.max(Math.min(this.vel, this.maxspeed), -this.maxspeed);
    this.pos.add(this.dir.copy().setMag(this.vel));
    this.acc = 0;
    const heading = this.dir.heading();
    for (const ray of this.rays) {
        ray.rotate(heading);
    }
}

Car.prototype.check = function(boundaries) {
    if(boundaries[this.index].dist(this.pos) - this.vel < 0.001){
        this.index = (this.index + 1) % boundaries.length;
        this.fitness++;
        this.life += 15;
    }
}

Car.prototype.look = function(boundaries) {
    for (const ray of this.rays) {
        const dist = boundaries
            .map(b => ray.cast(b))
            .filter(p => p)
            .map(p => ray.pos.dist(p))
            .sort()
            .find(d => d);
        if(dist && dist - this.vel < 0.001) this.dead = true;
    }
}