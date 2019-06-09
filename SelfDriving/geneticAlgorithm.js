function pickOne(population) {
    const sumFitnesses = population.reduce((acc, p) => acc + p.fitness, 0);
    const fitnesses = population.map(p => p.fitness / sumFitnesses);
    let index = 0;
    let r = Math.random();
    do {
        r -= fitnesses[index++];
    } while(r >= 0);
    return population[--index];
}