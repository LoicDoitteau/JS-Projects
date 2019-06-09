function Matrix(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];
    this.init();
}

Matrix.prototype.init = function() {
    this.data = new Array(this.cols * this.rows).fill(0);
}

Matrix.prototype.get = function(i, j) {
    return this.data[i * this.cols + j];
}

Matrix.prototype.copy = function() {
    return new Matrix(this.rows, this.cols).map((_, i, j) => this.get(i, j));
}

Matrix.prototype.map = function(func) {
    this.data = this.data.map((x, i) => func(x, Math.floor(i / this.cols), i % this.cols));
    return this;
}

Matrix.prototype.randomize = function() {
    return this.map(() => Math.random() * 2 - 1);
}

Matrix.prototype.multiply = function(m) {
    if(m instanceof Matrix) {
        if (this.rows != m.rows || this.cols != m.cols) throw "Invalid operation";
        return this.map((x, i, j) => x * m.get(i, j));
    } else {
        return this.map(x => x * m);
    }
};

Matrix.prototype.add = function(m) {
    if(m instanceof Matrix) {
        if (this.rows != m.rows || this.cols != m.cols) throw "Invalid operation";
        return this.map((x, i, j) => x + m.get(i, j));
    } else {
        return this.map(x => x + m);
    }
};

Matrix.prototype.substract = function(m) {
    if(m instanceof Matrix) {
        if (this.rows != m.rows || this.cols != m.cols) throw "Invalid operation";
        return this.map((x, i, j) => x - m.get(i, j));
    } else {
        return this.map(x => x - m);
    }
};

Matrix.prototype.toArray = function() {
    return this.data;
};

Matrix.prototype.log = function() {
    console.table(this.data);
}

Matrix.map = function(m, func) {
    return new Matrix(m.rows, m.cols).map((_, i, j) => func(m.get(i, j), i, j));
};

Matrix.transpose = function(m) {
    return new Matrix(m.cols, m.rows).map((_, i, j) => m.get(j, i));
};

Matrix.dotProduct = function(m1, m2) {
    if (m1.cols != m2.rows) throw "Invalid operation";
    return new Matrix(m1.rows, m2.cols).map((_, i, j) => Array
        .from({length : m1.cols}, (_, k) => m1.get(i, k) * m2.get(k, j))
        .reduce((acc, x) => acc + x, 0));
};

Matrix.multiply = function(m1, m2) {
    if(m2 instanceof Matrix) {
        if (m1.rows != m2.rows || m1.cols != m2.cols) throw "Invalid operation";
        return new Matrix(m1.rows, m1.cols).map((_, i, j) => m1.get(i, j) * m2.get(i, j));
    } else {
        return new Matrix(m1.rows, m1.cols).map((_, i, j) => m1.get(i, j) * m2);
    }
};

Matrix.add = function(m1, m2) {
    if(m2 instanceof Matrix) {
        if (m1.rows != m2.rows || m1.cols != m2.cols) throw "Invalid operation";
        return new Matrix(m1.rows, m1.cols).map((_, i, j) => m1.get(i, j) + m2.get(i, j));
    } else {
        return new Matrix(m1.rows, m1.cols).map((_, i, j) => m1.data[i][j] + m2);
    }
};

Matrix.substract = function(m1, m2) {
    if(m2 instanceof Matrix) {
        if (m1.rows != m2.rows || m1.cols != m2.cols) throw "Invalid operation";
        return new Matrix(m1.rows, m1.cols).map((_, i, j) => m1.get(i, j) - m2.get(i, j));
    } else {
        return new Matrix(m1.rows, m1.cols).map((_, i, j) => m1.get(i, j) - m2);
    }
};

Matrix.fromArray = function(arr) {
    return new Matrix(arr.length, 1).map((_, i) => arr[i]);
};