class Boids {
  init(opts){
    this.width = opts && opts.width ? opts.width : innerWidth;
    this.height = opts && opts.height ? opts.height : innerHeight;
    this.center = [this.width / 2, this.height / 2];

    this.data = [];
    
    this.separation = opts && isFinite(opts.separation) ? opts.separation : .5;
    this.alignment = opts && isFinite(opts.alignment) ? opts.alignment : 1;
    this.cohesion = opts && isFinite(opts.cohesion) ? opts.cohesion :  1;
    
    this.distance = opts && opts.distance ? opts.distance : 30;

    return this;
  }
  
  add(datum){
    const d = datum || {};
    d.angle = d.angle || 0;
    d.startAngle = d.angle;
    d.pos = d.pos || this.center;
    d.speed = d.speed || 1;

    this.data.push(d);
    
    return this;
  }

  tick(){
    // Check if any of alignment, cohesion, or separation are greater than 0
    const hasValue = this.alignment || this.cohesion || this.separation;
    
    if (hasValue){
      // Loop through the boids to find the neighborhood of each
      for (let i = 0, l = this.data.length; i < l; i++){
        const d = this.data[i];

        d.neighborhood = [];

        // Find all boids within this.distance
        for (let i0 = 0, l0 = this.data.length; i0 < l0; i0++){
          const d0 = this.data[i0];

          if (geometric.lineLength([d.pos, d0.pos]) < this.distance) d.neighborhood.push(d0);
        }
      }      
    }

    // Loop through the boids to calculate the new position
    for (let i = 0, l = this.data.length; i < l; i++){
      const d = this.data[i];

      if (d.neighborhood.length && hasValue){
        const alignment = d3.mean(d.neighborhood, d0 => d0.angle),
              cohesion = geometric.lineAngle([
                d.pos,
                geometric.polygonMean(d.neighborhood.map(d0 => d0.pos))
              ]),
              separation = d.startAngle;

        // The new angle. Alignment needs to be boosted by some coefficient
        d.angle = (cohesion * this.cohesion +
                  separation * this.separation +
                  alignment * this.alignment * 40) / 
                  (this.cohesion + this.separation + this.alignment * 40);
      }
      
      const [x, y] = geometric.pointTranslate(d.pos, d.angle, d.speed);
      d.pos = [x < 0 ? this.width : x > this.width ? 0 : x, y < 0 ? this.height : y > this.height ? 0 : y];
    }
    
    return this;
  }
}