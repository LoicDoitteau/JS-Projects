p5.disableFriendlyErrors = true;

const CARS_COUNT = 200;
const CHECK_POINTS_COUNT = 50;
const TRACK_RADIUS = 200;
const TRACK_WIDTH = 50;
let cars = [];
let player = null;
var track = null;
var generation = 1;
var saveButton, loadButton;

function setup() {
    createCanvas(800, 800);
    
    track = new Track();
    const pos = track.checkPoints[0].midPoint();
    const angle = track.dir == 1 ? 0 : PI;

    for (let i = 0; i < CARS_COUNT; i++) {
        cars.push(new Car(pos.copy(), angle));
    }

    player = new Car(pos.copy(), angle);

    saveButton = createButton("Save");
    saveButton.mousePressed(saveDada);
    loadButton = createButton("Load");
    loadButton.mousePressed(loadData);
}

function draw() {
    background(50);

    noStroke();
    fill(255);
    text(`Génération ${generation}`, 24, 24);

    track.show();

    if (keyIsDown(UP_ARROW)) {
        player.accelerate(1);
    }
    if (keyIsDown(DOWN_ARROW)) {
        player.brake(1);
    }
    if (keyIsDown(LEFT_ARROW)) {
        player.rotate(-1);
    } else if (keyIsDown(RIGHT_ARROW)) {
        player.rotate(1);
    }

    for (const car of cars) {
        if(!car.dead)
        {
            car.autoPilot(track.walls);
            car.update();
            car.check(track.checkPoints);
            car.look(track.walls);
        }
        car.draw();
    }

    const best = cars.sort((c1, c2) => c2.fitness - c1.fitness).find(c => c);
    
    player.update();
    player.highlight();

    if(cars.every(c => c.dead) || best.fitness >= CHECK_POINTS_COUNT * 3)
    {
        if(++generation % 5 == 0) track = new Track();
        let newCars = [];
        const pos = track.checkPoints[0].midPoint();
        const angle = track.dir == 1 ? 0 : PI;

        for (let i = 0; i < CARS_COUNT; i++) {
            var car = new Car(pos.copy(), angle);
            car.brain = pickOne(cars).brain.copy().mutate(0.1);
            newCars.push(car);
        }
        cars = newCars;

        player = new Car(pos.copy(), angle);
    }
}

function saveDada() {
    const best = cars.sort((c1, c2) => c2.fitness - c1.fitness).find(c => c);
    var json = {};
    json.weigths = best.brain.weigths.map(w => w.data);
    json.biases = best.brain.biases.map(b => b.data);;
    json.generation = generation;
    saveJSON(json, "data.json");
}

function loadData() {
    loadJSON("data.json", (json) => {
        generation = json.generation;
        for (const car of cars) {
            for (let i = 0; i < car.brain.weigths.length; i++) {
                car.brain.weigths[i].data = json.weigths[i];
            }
            for (let i = 0; i < car.brain.biases.length; i++) {
                car.brain.biases[i].data = json.biases[i];
            }
        }
    })
}