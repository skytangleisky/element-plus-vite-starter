import windyData from './gfs.js'
class Field{
  null_wind_vector:[number,number,null]
  columns:any[]
  bounds:{[key:string]:any}
  /**
   * @returns {Array} wind vector [u, v, magnitude] at the point (x, y), or [NaN, NaN, null] if wind
   *          is undefined at that point.
   */
  constructor(columns:any[],bounds:{[key:string]:any},null_wind_vector:[number,number,null]){
    this.null_wind_vector = null_wind_vector
    this.columns = columns
    this.bounds = bounds
  }
  field(x:number,y:number){
    var column = this.columns[Math.round(x)];
    return column && column[Math.round(y)] || this.null_wind_vector;
  }
  // Frees the massive "columns" array for GC. Without this, the array is leaked (in Chrome) each time a new
  // field is interpolated because the field closure's context is leaked, for reasons that defy explanation.
  release = ()=> {
    this.columns = [];
  }
  randomize = (o:{[key:string]:any})=> {  // UNDONE: this method is terrible
    var x, y;
    var safetyNet = 0;
    do {
        x = Math.round(Math.floor(Math.random() * this.bounds.width) + this.bounds.x);
        y = Math.round(Math.floor(Math.random() * this.bounds.height) + this.bounds.y)
    } while (this.field(x, y)[2] === null && safetyNet++ < 30);
    o.x = x;
    o.y = y;
    return o;
  }
}
export default class Windy{
  VELOCITY_SCALE:number
  INTENSITY_SCALE_STEP:number
  MAX_WIND_INTENSITY:number
  MAX_PARTICLE_AGE:number
  PARTICLE_LINE_WIDTH:number
  PARTICLE_MULTIPLIER:number
  PARTICLE_REDUCTION:number
  NULL_WIND_VECTOR:[number,number,null]
  pausing:boolean

  CANDRAW:boolean
  buckets:any
  particles:any
  field:any
  indexFor:any
  colorStyles:any
  bounds:any
  canvas:any
  constructor(){
    this.VELOCITY_SCALE = 0.011;               // scale for wind velocity (completely arbitrary--this value looks nice) // default: 0.011
    this.INTENSITY_SCALE_STEP = 10;            // step size of particle intensity color scale // default:10
    this.MAX_WIND_INTENSITY = 40;              // wind velocity at which particle intensity is maximum (m/s)
    this.MAX_PARTICLE_AGE = 100;                // max number of frames a particle is drawn before regeneration // default: 100
    this.PARTICLE_LINE_WIDTH = 1;              // line width of a drawn particle // default: 1
    this.PARTICLE_MULTIPLIER = 1/300;         // particle count scalar (completely arbitrary--this values looks nice) // default: 1/30
    this.PARTICLE_REDUCTION = 0.75;            // reduce particle count to this much of normal for mobile devices
    this.NULL_WIND_VECTOR = [NaN, NaN, null];  // singleton for no wind in the form: [u, v, magnitude]
    this.pausing = true
    this.CANDRAW = false
  }
  // interpolation for vectors like wind (u,v,m)
  bilinearInterpolateVector(x:number, y:number, g00:[number,number], g10:[number,number], g01:[number,number], g11:[number,number]):[number,number,number] {
    let rx = (1 - x)
    let ry = (1 - y)
    let a = rx * ry,  b = x * ry,  c = rx * y,  d = x * y;
    let u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
    let v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
    return [u, v, Math.sqrt(u * u + v * v)];
  }
  createWindBuilder(uComp:{data:[],header:any}|null, vComp:{data:[],header:any}|null) {
    var uData = uComp?.data, vData = vComp?.data;
    return {
      header: uComp?.header,
      //recipe: recipeFor("wind-" + uComp.header.surface1Value),
      data: function(i:number) {
        return [uData?uData[i]:null, vData?vData[i]:null];
      },
      interpolate: this.bilinearInterpolateVector
    }
  }
  createBuilder(data:any[]) {
    var uComp = null, vComp = null, scalar = null;
    data.forEach(record=> {
      switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
        case "2,2":
          uComp = record;
          break;
        case "2,3":
          vComp = record;
          break;
        default:
          scalar = record;
      }
    });
    return this.createWindBuilder(uComp, vComp);
  }
  buildGrid(data:any, callback:Function) {
    var builder = this.createBuilder(data);

    var header = builder.header;
    var λ0 = header.lo1, φ0 = header.la1;  // the grid's origin (e.g., 0.0E, 90.0N)
    var Δλ = header.dx, Δφ = header.dy;    // distance between grid points (e.g., 2.5 deg lon, 2.5 deg lat)
    var ni = header.nx, nj = header.ny;    // number of grid points W-E and N-S (e.g., 144 x 73)
    var date = new Date(header.refTime);
    date.setHours(date.getHours() + header.forecastTime);

    // Scan mode 0 assumed. Longitude increases from λ0, and latitude decreases from φ0.
    // http://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_table3-4.shtml
    var grid:any[] = [], p = 0;
    var isContinuous = Math.floor(ni * Δλ) >= 360;
    for (var j = 0; j < nj; j++) {
      var row = [];
      for (var i = 0; i < ni; i++, p++) {
        row[i] = builder.data(p);
      }
      if (isContinuous) {
        // For wrapped grids, duplicate first column as last column to simplify interpolation logic
        row.push(row[0]);
      }
      grid[j] = row;
    }

    let interpolate = (λ:number, φ:number) => {
      var i = this.floorMod(λ - λ0, 360) / Δλ;  // calculate longitude index in wrapped range [0, 360)
      var j = (φ0 - φ) / Δφ;                 // calculate latitude index in direction +90 to -90

      var fi = Math.floor(i), ci = fi + 1;
      var fj = Math.floor(j), cj = fj + 1;

      var row;
      if ((row = grid[fj])) {
        var g00 = row[fi];
        var g10 = row[ci];
        if (this.isValue(g00) && this.isValue(g10) && (row = grid[cj])) {
          var g01 = row[fi];
          var g11 = row[ci];
          if (this.isValue(g01) && this.isValue(g11)) {
            // All four points found, so interpolate the value.
            return builder.interpolate(i - fi, j - fj, g00, g10, g01, g11);
          }
        }
      }
      return null;
    }
    callback( {
      date: date,
      interpolate: interpolate
    })
  }
  /**
   * @returns {Boolean} true if the specified value is not null and not undefined.
   */
  isValue(x:number):boolean {
    return x !== null && x !== undefined;
  }
  /**
   * @returns {Number} returns remainder of floored division, i.e., floor(a / n). Useful for consistent modulo
   *          of negative numbers. See http://en.wikipedia.org/wiki/Modulo_operation.
   */
  floorMod(a:number, n:number):number {
    return a - n * Math.floor(a / n);
  }
  /**
   * @returns {Number} the value x clamped to the range [low, high].
   */
  clamp(x:number, range:[number,number]):number{
    return Math.max(range[0], Math.min(x, range[1]));
  }
  /**
   * Calculate distortion of the wind vector caused by the shape of the projection at point (x, y). The wind
   * vector is modified in place and returned by this function.
   */
  distort(projection:{}, λ:number, φ:number, x:number, y:number, scale:number, wind:[number,number], windy:{}) {
    var u = wind[0] * scale;
    var v = wind[1] * scale;
    var d = this.distortion(projection, λ, φ, x, y, windy);

    // Scale distortion vectors by u and v, then add.
    wind[0] = d[0] * u + d[2] * v;
    wind[1] = d[1] * u + d[3] * v;
    return wind;
  }
  distortion(projection:{}, λ:number, φ:number, x:number, y:number, windy:{}) {
    var τ = 2 * Math.PI;
    var H = Math.pow(10, -5.2);
    var hλ = λ < 0 ? H : -H;
    var hφ = φ < 0 ? H : -H;

    var pλ = this.project(φ, λ + hλ,windy);
    var pφ = this.project(φ + hφ, λ, windy);

    // Meridian scale factor (see Snyder, equation 4-3), where R = 1. This handles issue where length of 1º λ
    // changes depending on φ. Without this, there is a pinching effect at the poles.
    var k = Math.cos(φ / 360 * τ);
    return [
      (pλ[0] - x) / hλ / k,
      (pλ[1] - y) / hλ / k,
      (pφ[0] - x) / hφ,
      (pφ[1] - y) / hφ
    ];
  }
  createField(columns:any[], bounds:{[key:string]:any}, callback:Function) {
    let field = new Field(columns,bounds,this.NULL_WIND_VECTOR)

    //field.overlay = mask.imageData;
    //return field;
    callback( bounds, field );
  }
  buildBounds( bounds:[[number,number],[number,number]], width:number, height:number ) {
    var upperLeft = bounds[0];
    var lowerRight = bounds[1];
    var x = Math.round(upperLeft[0]); //Math.max(Math.floor(upperLeft[0], 0), 0);
    var y = Math.max(Math.floor(upperLeft[1]), 0);
    var xMax = Math.min(Math.ceil(lowerRight[0]), width - 1);
    var yMax = Math.min(Math.ceil(lowerRight[1]), height - 1);
    this.canvas = document.createElement('canvas')
    this.canvas.width = xMax
    this.canvas.height = yMax
    return {x: x, y: y, xMax: xMax, yMax: yMax, width: width, height: height};
  }
  deg2rad( deg:number ){
    return (deg / 180) * Math.PI;
  }

  rad2deg( ang:number ){
    return ang / (Math.PI/180.0);
  }
  invert(x:number, y:number, windy:{[key:string]:any}){
    var mapLonDelta = windy.east - windy.west;
    var worldMapRadius = windy.width / this.rad2deg(mapLonDelta) * 360/(2 * Math.PI);
    var mapOffsetY = ( worldMapRadius / 2 * Math.log( (1 + Math.sin(windy.south) ) / (1 - Math.sin(windy.south))  ));
    var equatorY = windy.height + mapOffsetY;
    var a = (equatorY-y)/worldMapRadius;

    var lat = 180/Math.PI * (2 * Math.atan(Math.exp(a)) - Math.PI/2);
    var lon = this.rad2deg(windy.west) + x / windy.width * this.rad2deg(mapLonDelta);
    return [lon, lat];
  }
  mercY( lat:number ) {
    return Math.log( Math.tan( lat / 2 + Math.PI / 4 ) );
  }
  project( lat:number, lon:number, windy:{[key:string]:any}) { // both in radians, use deg2rad if neccessary
    var ymin = this.mercY(windy.south);
    var ymax = this.mercY(windy.north);
    var xFactor = windy.width / ( windy.east - windy.west );
    var yFactor = windy.height / ( ymax - ymin );

    var y = this.mercY( this.deg2rad(lat) );
    var x = (this.deg2rad(lon) - windy.west) * xFactor;
    var y = (ymax - y) * yFactor; // y points south
    return [x, y];
  }
  interpolateField( grid:{[key:string]:any}, bounds:{[key:string]:any}, extent:{}, callback:Function ) {
    var projection = {};
    var velocityScale = this.VELOCITY_SCALE;

    var columns:any[] = [];
    var x = bounds.x;

    let interpolateColumn=(x:number)=>{
      var column = [];
      for (var y = bounds.y; y <= bounds.yMax; y += 2) {
        var coord = this.invert( x, y, extent );
        if (coord) {
          var λ = coord[0], φ = coord[1];
          if (isFinite(λ)) {
            var wind = grid.interpolate(λ, φ);
            if (wind) {
              wind = this.distort(projection, λ, φ, x, y, velocityScale, wind, extent);
              column[y+1] = column[y] = wind;

            }
          }
        }
      }
      columns[x+1] = columns[x] = column;
    }
    // let batchInterpolate = () => {
    //   var start = Date.now();
    //   while (x < bounds.width) {
    //       interpolateColumn(x);
    //       x += 2;
    //       if ((Date.now() - start) > 1000) { //MAX_TASK_TIME
    //         setTimeout(batchInterpolate, 25);
    //         return;
    //       }
    //   }
    //   this.createField(columns, bounds, callback);
    // }
    // batchInterpolate()


    while (x < bounds.width) {
      interpolateColumn(x);
      x += 2;
    }
    this.createField(columns, bounds, callback);
  }
  animate(bounds:{[key:string]:any}, field:Field) {

    let asColorStyle = (r:number, g:number, b:number, a:number)=> {
      return "rgba(" + 243 + ", " + 243 + ", " + 238 + ", " + a + ")";
    }

    let hexToR = (h:string)=> {return parseInt((cutHex(h)).substring(0,2),16)}
    let hexToG = (h:string)=> {return parseInt((cutHex(h)).substring(2,4),16)}
    let hexToB = (h:string)=> {return parseInt((cutHex(h)).substring(4,6),16)}
    let cutHex = (h:string)=> {return (h.charAt(0)=="#") ? h.substring(1,7):h}

    let windIntensityColorScale = (step:number, maxWind:number)=>{
      var result = [
        /* blue to red*/
        "rgba(" + hexToR('#178be7') + ", " + hexToG('#178be7') + ", " + hexToB('#178be7') + ", " + 1.0 + ")",
        "rgba(" + hexToR('#8888bd') + ", " + hexToG('#8888bd') + ", " + hexToB('#8888bd') + ", " + 1.0 + ")",
        "rgba(" + hexToR('#b28499') + ", " + hexToG('#b28499') + ", " + hexToB('#b28499') + ", " + 1.0 + ")",
        "rgba(" + hexToR('#cc7e78') + ", " + hexToG('#cc7e78') + ", " + hexToB('#cc7e78') + ", " + 1.0 + ")",
        "rgba(" + hexToR('#de765b') + ", " + hexToG('#de765b') + ", " + hexToB('#de765b') + ", " + 1.0 + ")",
        "rgba(" + hexToR('#ec6c42') + ", " + hexToG('#ec6c42') + ", " + hexToB('#ec6c42') + ", " + 1.0 + ")",
        "rgba(" + hexToR('#f55f2c') + ", " + hexToG('#f55f2c') + ", " + hexToB('#f55f2c') + ", " + 1.0 + ")",
        "rgba(" + hexToR('#fb4f17') + ", " + hexToG('#fb4f17') + ", " + hexToB('#fb4f17') + ", " + 1.0 + ")",
        "rgba(" + hexToR('#fe3705') + ", " + hexToG('#fe3705') + ", " + hexToB('#fe3705') + ", " + 1.0 + ")",
        "rgba(" + hexToR('#ff0000') + ", " + hexToG('#ff0000') + ", " + hexToB('#ff0000') + ", " + 1.0 + ")"
        // "rgba(" + hexToR('#00ffff') + ", " + hexToG('#00ffff') + ", " + hexToB('#00ffff') + ", " + 0.5 + ")",
        // "rgba(" + hexToR('#64f0ff') + ", " + hexToG('#64f0ff') + ", " + hexToB('#64f0ff') + ", " + 0.5 + ")",
        // "rgba(" + hexToR('#87e1ff') + ", " + hexToG('#87e1ff') + ", " + hexToB('#87e1ff') + ", " + 0.5 + ")",
        // "rgba(" + hexToR('#a0d0ff') + ", " + hexToG('#a0d0ff') + ", " + hexToB('#a0d0ff') + ", " + 0.5 + ")",
        // "rgba(" + hexToR('#b5c0ff') + ", " + hexToG('#b5c0ff') + ", " + hexToB('#b5c0ff') + ", " + 0.5 + ")",
        // "rgba(" + hexToR('#c6adff') + ", " + hexToG('#c6adff') + ", " + hexToB('#c6adff') + ", " + 0.5 + ")",
        // "rgba(" + hexToR('#d49bff') + ", " + hexToG('#d49bff') + ", " + hexToB('#d49bff') + ", " + 0.5 + ")",
        // "rgba(" + hexToR('#e185ff') + ", " + hexToG('#e185ff') + ", " + hexToB('#e185ff') + ", " + 0.5 + ")",
        // "rgba(" + hexToR('#ec6dff') + ", " + hexToG('#ec6dff') + ", " + hexToB('#ec6dff') + ", " + 0.5 + ")",
        // "rgba(" + hexToR('#ff1edb') + ", " + hexToG('#ff1edb') + ", " + hexToB('#ff1edb') + ", " + 0.5 + ")"
      ]
      /*
      var result = [];
      for (var j = 225; j >= 100; j = j - step) {
        result.push(asColorStyle(j, j, j, 1));
      }
      */
      let indexFor = (m:number)=> {  // map wind speed to a style
        return Math.floor(Math.min(m, maxWind) / maxWind * (result.length - 1));
      }
      return {colorStyles:result,indexFor};
    }

    var { colorStyles, indexFor } = windIntensityColorScale(this.INTENSITY_SCALE_STEP, this.MAX_WIND_INTENSITY);
    var buckets = colorStyles.map(function():any[] { return []; });

    var particleCount = Math.round(bounds.width * bounds.height * this.PARTICLE_MULTIPLIER);
    var particles:any = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push(field.randomize({age: Math.floor(Math.random() * this.MAX_PARTICLE_AGE) + 0}));
    }

    this.buckets =buckets
    this.particles=particles
    this.field = field
    this.indexFor = indexFor
    this.colorStyles = colorStyles
    this.bounds = bounds
    this.CANDRAW = true
  }


  evolve(){
    this.buckets.forEach(function(bucket:any) { bucket.length = 0; });
    this.particles.forEach((particle:any)=>{
      if (particle.age > this.MAX_PARTICLE_AGE) {
        this.field.randomize(particle).age = 0;
      }
      var x = particle.x;
      var y = particle.y;
      var v = this.field.field(x, y);  // vector at current position
      var m = v[2];
      if (m === null) {
        particle.age = this.MAX_PARTICLE_AGE;  // particle has escaped the grid, never to return...
      }else{
        var xt = x + v[0];
        var yt = y + v[1];
        if (this.field.field(xt, yt)[2] !== null) {
          // Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.
          particle.xt = xt;
          particle.yt = yt;
          this.buckets[this.indexFor(m)].push(particle);
        }else {
          // Particle isn't visible, but it still moves through the field.
          particle.x = xt;
          particle.y = yt;
        }
      }
      particle.age += 1;
    });
  }

  render(obj:any,ctx:CanvasRenderingContext2D){
    if(this.CANDRAW){
      this.evolve()
      let g = this.canvas.getContext('2d')
      g.lineWidth = this.PARTICLE_LINE_WIDTH;


      g.fillStyle = "rgba(255, 255, 255, 0.9)";
      // Fade existing particle trails.
      var prev = g.globalCompositeOperation;
      g.globalCompositeOperation = "destination-in";
      g.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
      g.globalCompositeOperation = prev;



      // Draw new particle trails.
      for(let j=0;j<this.buckets.length;j++){
        let bucket = this.buckets[j]
        if (bucket.length > 0) {
          g.beginPath()
          g.strokeStyle = this.colorStyles[j]
          for(let i=0;i<bucket.length;i++){
            let particle = bucket[i]
            g.moveTo(particle.x, particle.y)
            g.lineTo(particle.xt, particle.yt)
            particle.x = particle.xt
            particle.y = particle.yt
          }
          g.stroke()
        }
      }
      // let imgData = g.getImageData(this.bounds.x,this.bounds.y,this.bounds.width,this.bounds.height)
      ctx.drawImage(this.canvas,0,0)
    }
  }

  start( bounds:[[number,number],[number,number]], width:number, height:number, extent:[[number,number],[number,number]] ){
    var mapBounds = {
      south: this.deg2rad(extent[0][1]),
      north: this.deg2rad(extent[1][1]),
      east: this.deg2rad(extent[1][0]),
      west: this.deg2rad(extent[0][0]),
      width: width,
      height: height
    }
    // build grid
    this.buildGrid( windyData, (grid:{})=>{
      // interpolateFiel
      this.interpolateField( grid, this.buildBounds( bounds, width, height), mapBounds, ( bounds:{[key:string]:any}, field:Field )=>{
        // animate the canvas with random points
        this.animate( bounds, field )
      })
    })
  }
}