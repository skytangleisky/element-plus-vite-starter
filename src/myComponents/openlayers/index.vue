<template>
  <div id="map" class="map" style="position: absolute;left:0;top:0;width:100vw;height:100vh;"></div>
  <div id="popup" class="ol-popup">
    <div href="#" id="popup-closer" class="ol-popup-closer"></div>
    <div id="popup-content"></div>
  </div>
</template>
<script setup>
import FullScreen from 'ol/control/FullScreen'
import { onMounted,onBeforeUnmount } from 'vue';
import GeoJSON from 'ol/format/GeoJSON.js';
import Layer from 'ol/layer/Layer.js';
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import 'ol/ol.css'
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {toStringHDMS} from 'ol/coordinate';
import {fromLonLat,toLonLat} from 'ol/proj';
import Overlay from 'ol/Overlay'
// import ufo_shapes from './data/ufo_shapes.png?url'
import ufo_shapes from '~/assets/feather.svg?url'
import circle from '~/assets/circle.svg?url'
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';

/** @type {import('ol/style/literal.js').LiteralStyle} */

class WebGLLayer extends Layer {
  createRenderer() {
    return new WebGLVectorLayerRenderer(this, {
      style:{
        'stroke-color': ['*', ['get', 'COLOR'], [220, 220, 220]],
        'stroke-width': 1,
        'fill-color': ['*', ['get', 'COLOR'], [0, 0, 0, 0.2]],
      },
    });
  }
}

const osm = new TileLayer({
  preload:Infinity,
  source: new XYZ({
    url: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}',
    // url:'https://wprd0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
  })
});

const vectorLayer = new WebGLLayer({
  source: new VectorSource({
    // url: 'https://openlayers.org/data/vector/ecoregions.json',
    url: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
    format: new GeoJSON()
  }),
});
let timer
const getCoord = (i,j) => [i*(16+20)/(16*10+20*(10-1)),j*(32+20)/(32*4+20*(4-1)),i*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),j*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))]
const getFeather = v => v<=0?0:v<=1?1:v<=2?2:v<=4?4:v<=6?6:v<=8?8:v<=10?10:v<=12?12:v<=14?14:v<=16?16:v<=18?18:v<=20?20:v<=22?22:v<=24?24:v<=26?26:v<=28?28:v<=30?30:v<=32?32:v<=34?34:v<=36?36:v<=38?38:v<=40?40:v<=42?42:v<=44?44:v<=46?46:v<=48?48:v<=50?50:v<=52?52:v<=54?54:v<=56?56:v<=58?58:60

const style = {
  symbol: {
    symbolType: 'image',
    src: ufo_shapes,
    size: [16,32],
    rotation:['get','deg','number'],
    color:[
      'interpolate',
      ['linear'],
      ['get', 'flag'],
      0,'#0000ff',4,'#002aff',8,'#0054ff',12,'#007eff',16,'#00a8ff',20,'#00d2ff',24,'#14d474',28,'#a6dd00',32,'#ffe600',36,'#ffb300',40,'#ff8000',44,'#ff4d00',48,'#ff1a00',52,'#e60000',56,'#b30000',58,'#b30000',60,'#b30000',
    ],
    rotateWithView: true,
    offset: [8, 16],
    textureCoord:
    [
      'match',
      ['get','flag'],
      0,getCoord(0,0),
      1,getCoord(1,0),
      2,getCoord(2,0),
      4,getCoord(3,0),
      6,getCoord(4,0),
      8,getCoord(5,0),
      10,getCoord(6,0),
      12,getCoord(7,0),
      14,getCoord(8,0),
      16,getCoord(9,0),
      18,getCoord(0,1),
      20,getCoord(1,1),
      22,getCoord(2,1),
      24,getCoord(3,1),
      26,getCoord(4,1),
      28,getCoord(5,1),
      30,getCoord(6,1),
      32,getCoord(7,1),
      34,getCoord(8,1),
      36,getCoord(9,1),
      38,getCoord(0,2),
      40,getCoord(1,2),
      42,getCoord(2,2),
      44,getCoord(3,2),
      46,getCoord(4,2),
      48,getCoord(5,2),
      50,getCoord(6,2),
      52,getCoord(7,2),
      54,getCoord(8,2),
      56,getCoord(9,2),
      58,getCoord(0,3),
      getCoord(1,3),
    ]
  },
};
const style2 = {
  symbol: {
    symbolType: 'circle',
    size: 10,
    color: ['match', ['get', 'hover'], 1, '#ff3f3f', '#006688'],
    rotateWithView: false,
    offset: [0, 0],
    opacity: 1,
  }
}
onMounted(()=>{
  const container = document.getElementById('popup');
  const content = document.getElementById('popup-content');
  const closer = document.getElementById('popup-closer');
  const mapContainer = document.getElementById('map');
  if(!(container&&content&&closer&&mapContainer))throw Error()
  const overlay = new Overlay({
    element: container,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });
  closer.onclick=function(){
    overlay.setPosition(undefined)
    closer.blur();
    return false
  }
  const map = new Map({
    overlays:[overlay],
    layers: [osm, vectorLayer],
    target: 'map',
    view: new View({
      center: fromLonLat([105,30]),
      zoom: 8,
    }),
  });
  map.addControl(new FullScreen())
  let selected = null
  map.on('pointermove',function(evt){
    if(selected!==null){
      selected.set('hover',0)
      selected=null
    }
    map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      feature.set('hover',1)
        selected = feature
    });
  })
  map.on('pointerdown', function (evt) {
    if (map.getView().getInteracting() || map.getView().getAnimating()) {
      return;
    }
    const text = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      // const coordinate = evt.coordinate;
      // const hdms = toStringHDMS(toLonLat(coordinate));
      if(feature.get('coords')){
        const hdms = toStringHDMS(feature.get('coords'));
        content.innerHTML = '<p>You clicked here:</p><span style="color:#e83e8c;">' + hdms + '</span>';
        overlay.setPosition(fromLonLat(feature.get('coords')));

        const datetime = feature.get('datetime');
        const duration = feature.get('duration');
        const shape = feature.get('shape');
        return `On ${datetime}, lasted ${duration} seconds and had a "${shape}" shape.`;
      }
    });
  });
  const features = []
  const features2 = []
  for(let i=0;i<800;i++){
    let lngLat = [105+(Math.random()-0.5)*10,30+(Math.random()-0.5)*10]
    const speed = Math.random()*60
    features.push(new Feature({
      speed,
      deg:Math.PI/180*Math.random()*360,
      flag:getFeather(speed),
      geometry: new Point(fromLonLat(lngLat))
    }))

    features2.push(new Feature({
      coords:lngLat,
      geometry: new Point(fromLonLat(lngLat))
    }))
  }

  map.addLayer(new WebGLPointsLayer({
    source: new VectorSource({
      features:features2
    }),
    style:style2,
  }))
  map.addLayer(new WebGLPointsLayer({
    source:new VectorSource({
      features
    }),
    style,
  }))
  timer = setInterval(()=>{
    features.forEach(feature=>{
      // feature.set('deg',Math.PI/180*Math.random()*360)
      feature.set('deg',Math.PI/180*Math.random()*360)
    })
  },1000)
})
onBeforeUnmount(()=>{
  
  clearInterval(timer)
})
</script>

<style>
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
  color: black;
}
.ol-popup:after, .ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 49px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 49px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  color: var(--ep-color-primary);
  content: "✖";
}
</style>