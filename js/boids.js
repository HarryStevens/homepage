// Add vector w to vector v
function add(v, w) {
  let out = [];
  for (let i = 0; i < v.length; i++){
    out[i] = v[i] + w[i];
  }
  return out;
}

// Subtract vector w from vector v
function sub(v, w) {
  let out = [];
  for (let i = 0; i < v.length; i++){
    out[i] = v[i] - w[i];
  }
  return out;
}

// Multiply vector v by w, either a vector of equal length or a number
function mult(v, w) {
  let that = [];
  if (typeof w === "number"){
    for (let i = 0; i < v.length; i++){
      that[i] = w;
    }
  }
  else {
    that = w;       
  }
  let out = [];
  for (let i = 0; i < v.length; i++){
    out[i] = v[i] * that[i];
  }
  return out;
}

// Divide vector v by w, either a vector of equal length or a number
function div(v, w) {
  let that = [];
  if (typeof w === "number"){
    for (let i = 0; i < v.length; i++){
      that[i] = w;
    }
  }
  else {
    that = w;       
  }
  let out = [];
  for (let i = 0; i < v.length; i++){
    out[i] = v[i] / that[i];
  }
  
  return out;
}

// Limit the magnitude of this vector to the value used for the n parameter.
function limit(v, n) {
  let out = v;
  
  const sq = Math.pow(getMag(v), 2);
  if (sq > n * n){
    out = div(out, Math.sqrt(sq));
    out = mult(out, n);
  }
  return out;
}

// Normalize the vector to length 1 (make it a unit vector).
function normalize(v) {
  const m = getMag(v), l = v.length;
  return m ? mult(v, 1 / m) : v.map(d => 1 / l);
}

// Get the magnitude of a vector
function getMag(v) {
  let l = v.length, sums = 0;
  for (let i = 0; i < l; i++){
    sums += v[i] * v[i];
  }
  
  return Math.sqrt(sums);
}

// Set the magnitude of this vector to the value used for the n parameter.
function setMag(v, n) {
  return mult(normalize(v), n);
}

// Angle from vector v to vector w in radians
function ang(v, w) {
  return Math.atan2(w[1] - v[1], w[0] - v[0]);
}

// Distance from position of vector v to position of vector w in pixels
function dist(v, w) {
  return Math.sqrt(Math.pow(w[0] - v[0], 2) + Math.pow(w[1] - v[1], 2));
}

// Translate position of vector v by an angle in radians and a distance in pixels
function trans(v, ang, dist) {
  return [v[0] + dist * Math.cos(ang), v[1] + dist * Math.sin(ang)];
}

const vecmath = {
  add, sub, mult, div, limit, normalize, getMag, setMag, ang, dist, trans
}

class Boids {
  constructor(){
    this.width = innerWidth;
    this.height = innerHeight;
    this.perception = 50;
    this.maxForce = 0.2;
    this.alignment = 0.5;
    this.cohesion = 0.5;
    this.separation = 0.5;
    this.maxSpeed = 4;
    
    this.flock = [];
  }
  
  setAlignment(n){
    this.alignment = n;
    for (let i = 0, l = this.flock.length; i < l; i++){
      this.flock[i].alignment = n;
    }
  }
  
  setCohesion(n){
    this.cohesion = n;
    for (let i = 0, l = this.flock.length; i < l; i++){
      this.flock[i].cohesion = n;
    }
  }

  setPerception(n){
    this.perception = n;
    for (let i = 0, l = this.flock.length; i < l; i++){
      this.flock[i].perception = n;
    }
  }
  
  setSeparation(n){
    this.separation = n;
    for (let i = 0, l = this.flock.length; i < l; i++){
      this.flock[i].separation = n;
    }
  }

  setWidth(n){
    this.width = n;
    for (let i = 0, l = this.flock.length; i < l; i++){
      this.flock[i].width = n;
    }
  }

  setHeight(n){
    this.height = n;
    for (let i = 0, l = this.flock.length; i < l; i++){
      this.flock[i].height = n;
    }
  }
  
  add(opts){
    this.flock.push(new Boid(this, opts));
  }
  
  tick(){
    for (let i = 0, l = this.flock.length; i < l; i++){
      this.flock[i].update();
    }
  }
}

class Boid {
  constructor(Boids, opts){
    Object.assign(this, Boids);
    Object.assign(this, opts);

    // Angle, position, and speed can be assigned by the user.
    this.ang = this.ang || d3.randomUniform(0, Math.PI * 2)();
    this.pos = this.pos || [
      d3.randomUniform(0, this.width)(),
      d3.randomUniform(0, this.height)()
    ];
    this.speed = this.speed || 1;
    
    const obj = {
      pos: this.pos,
      ang: this.ang,
      speed: this.speed,
      vel: vecmath.sub(
        vecmath.trans(this.pos, this.ang, this.speed),
        this.pos
      ),
      acc: [0, 0],
      id: this.flock.length
    };
    
    Object.assign(this, obj);
  }
  
  visit(){
    let alignment = [0, 0],
        cohesion = [0, 0],
        separation = [0, 0],
        n = 0;
    
    for (let i = 0, l = this.flock.length; i < l; i ++){
      const that = this.flock[i];
      const dist = vecmath.dist(this.pos, that.pos);
      
      if (this.id !== that.id && dist < this.perception){
        alignment = vecmath.add(alignment, that.vel);        
        cohesion = vecmath.add(cohesion, that.pos);
        const diff = vecmath.div(
          vecmath.sub(this.pos, that.pos), 
          Math.max(dist, 1e-6)
        );
        separation = vecmath.add(separation, diff);
        n++;
      }
    }
    
    if (n > 0){
      alignment = vecmath.div(alignment, n);    
      alignment = vecmath.setMag(alignment, this.maxSpeed);
      alignment = vecmath.sub(alignment, this.vel);      
      alignment = vecmath.limit(alignment, this.maxForce);
      
      cohesion = vecmath.div(cohesion, n);
      cohesion = vecmath.sub(cohesion, this.pos);
      cohesion = vecmath.setMag(cohesion, this.maxSpeed);
      cohesion = vecmath.sub(cohesion, this.vel);
      cohesion = vecmath.limit(cohesion, this.maxForce);
      
      separation = vecmath.div(separation, n);
      separation = vecmath.setMag(separation, this.maxSpeed);
      separation = vecmath.sub(separation, this.vel);
      separation = vecmath.limit(separation, this.maxForce);
    }
    
    alignment = vecmath.mult(alignment, this.alignment);
    cohesion = vecmath.mult(cohesion, this.cohesion);
    separation = vecmath.mult(separation, this.separation);
    
    return { alignment, cohesion, separation };
  }
  
  update(){
    const { alignment, cohesion, separation } = this.visit();
    this.acc = vecmath.add(this.acc, alignment);
    this.acc = vecmath.add(this.acc, cohesion);
    this.acc = vecmath.add(this.acc, separation);
    
    const prev = { ...this };
    this.pos = vecmath.add(this.pos, this.vel);
    this.vel = vecmath.add(this.vel, this.acc);
    this.vel = vecmath.limit(this.vel, this.maxSpeed);
    
    this.ang = vecmath.ang(prev.pos, this.pos);
    this.speed = vecmath.dist(prev.pos, this.pos);
    
    if (this.pos[0] > this.width) this.pos[0] = 0;
    if (this.pos[0] < 0) this.pos[0] = this.width;
    if (this.pos[1] > this.height) this.pos[1] = 0;
    if (this.pos[1] < 0) this.pos[1] = this.height;
    
    this.acc = vecmath.mult(this.acc, 0);
  }
}