import WindGL from '../mapbox/WindGL/index';
import {mat4} from 'gl-matrix';

export default class CustomLayer {
  constructor(json,png,show) {
    this.id = 'null-island';
    this.type = 'custom';
    this.renderingMode = '3d';
    this.json = json
    this.png = png
    console.log('->',show)
    this.show = show
  }
  onAdd(map, gl) {
    this.map = map
    this.projectionName = this.map.getProjection().name
    this.wind = new WindGL(gl,{boundaries:this.json.boundaries})
    this.wind.numParticles = 1024
    let windData = this.json
    const windImage = new Image();
    windImage.width = windData.width
    windImage.height=windData.height
    windData.image = windImage;
    windImage.src = this.png;
    windImage.onload = () => {
        this.wind.setWind(windData);
    };
    this.map.on("wheel", () => {
      this.wind.resize();
    });
    this.map.on("dragstart", () => {
      this.wind.resize();
    });
    this.map.on("move", () => {
      this.wind.resize();
    });
  }
  render(gl, projectionMatrix, projection, globeToMercMatrix, transition, centerInMercator, pixelsPerMeterRatio) {
    if(this.show){
      if (this.wind.windData) {
        if (projection && projection.name === 'globe') {
          if(this.projectionName!='globe'){
            this.wind.resize()
            this.projectionName='globe'
          }
          gl.enable(gl.BLEND);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          mat4.multiply(projectionMatrix,projectionMatrix,globeToMercMatrix)
          this.wind.draw(projectionMatrix,1);
        }else{
          if(this.projectionName!='mercator'){
            this.wind.resize()
            this.projectionName='mercator'
          }
          gl.enable(gl.BLEND);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          this.wind.draw(projectionMatrix,0);
        }
        this.map.triggerRepaint();
      }
    }
  }
}