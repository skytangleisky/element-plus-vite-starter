<template>
  <div id="mapContainer" class="map" style="position: absolute;left:0;top:0;width:100%;height:100%;"></div>
  <div id="popup" class="ol-popup">
    <div href="#" id="popup-closer" class="ol-popup-closer"></div>
    <div id="popup-content" style="display: flex;flex-direction: column;"></div>
  </div>
</template>
<script setup>
import FullScreen from 'ol/control/FullScreen'
import { onMounted,onBeforeUnmount,watch } from 'vue';
import GeoJSON from 'ol/format/GeoJSON.js';
import Layer from 'ol/layer/Layer.js';
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
// import TileLayer from 'ol/layer/WebGLTile.js';
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
// import ufo_shapes from '~/assets/feather.png?url'
import circle from '~/assets/circle.svg?url'
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import { eventbus } from '~/eventbus';
import { useStationStore } from '~/stores/station';
import {ScaleLine, defaults as defaultControls} from 'ol/control';

const station = useStationStore()
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
    // url: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}',
    url:'https://wprd0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
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
    rotation:['get','rad','number'],
    color: [
      'interpolate',
      ['linear'],
      ['get', 'flag'],
      0,'#0000ff',4,'#002aff',8,'#0054ff',12,'#007eff',16,'#00a8ff',20,'#00d2ff',24,'#14d474',28,'#a6dd00',32,'#ffe600',36,'#ffb300',40,'#ff8000',44,'#ff4d00',48,'#ff1a00',52,'#e60000',56,'#b30000',58,'#b30000',60,'#b30000',
    ],
    rotateWithView: true,
    offset: [
      'match',
      ['get','flag'],
      0,
      [0, 0],
      [8, 16]
    ],
    textureCoord: [
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
  eventbus.on('将站点移动到屏幕中心',flyTo)
  const container = document.getElementById('popup');
  const content = document.getElementById('popup-content');
  const closer = document.getElementById('popup-closer');
  if(!(container&&content&&closer))throw Error()
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
    target: document.getElementById('mapContainer'),
    view: new View({
      // center: fromLonLat([105,30]),
      // zoom:8,
      center: fromLonLat([115.43123283436979, 39.56864128657364]),
      zoom: 12,
    }),
    //加载控件到地图容器中
    controls: defaultControls({
        zoom: false,
        rotate: false,
        attribution: false
    }).extend([
      new ScaleLine({bar: true, text: true, minWidth: 125})
    ])
  });
  function flyTo(v) {
    console.log(v)
    let zoom = map.getView().getZoom()
    const duration = 2000;
    // map.getView().animate({
    //   center:fromLonLat([110,30]),
    //   duration:2000
    // })
    map.getView().cancelAnimations()
    map.getView().animate(
      {
        zoom: 16,
        center:fromLonLat([v.longitude,v.latitude]),
        duration: duration,
      }
    )
  }
  // map.addControl(new FullScreen())
  let selected = null
  map.getView().on('pointermove',evt=>{
    if(selected!==null){
      selected.set('hover')
      selected=null
    }
    map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      if(selected&&selected!=feature){
        selected.set('hover',0)
      }
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
        content.innerHTML =
        '<span style="color:#e83e8c;">名&emsp;称：' + feature.get('name') + '</span>' +
        '<span style="color:#e83e8c;">状&emsp;态：' + feature.get('is_online') + '</span>' +
        '<span style="color:#e83e8c;">速&emsp;度：' + (feature.get('speed')).toFixed(2) + 'm/s</span>' +
        '<span style="color:#e83e8c;">经&emsp;度：' + feature.get('coords')[0] + '°</span>' +
        '<span style="color:#e83e8c;">纬&emsp;度：' + feature.get('coords')[1] + '°</span>' +
        '<span style="color:#e83e8c;">方向角：' + (feature.get('rad')*180/Math.PI).toFixed(2) + '°</span>';
        overlay.setPosition(fromLonLat(feature.get('coords')));

        const datetime = feature.get('datetime');
        const duration = feature.get('duration');
        const shape = feature.get('shape');
        return `On ${datetime}, lasted ${duration} seconds and had a "${shape}" shape.`;
      }
    });
  });
  map.on('moveend',function(){
    let view = map.getView()
    // console.log(view.getZoom(),toLonLat(view.getCenter()))
  })
  watch(station,newValue=>{
    console.log(newValue.result)
    const data = newValue.result
    source.getFeatures().forEach(feature=>source.removeFeature(feature))
    source2.getFeatures().forEach(feature=>source2.removeFeature(feature))
    for(let i=0;i<data.length;i++){
      const speed = Math.random()*60
      const rad = Math.PI/180*Math.random()*360
      let lngLat = [data[i].longitude,data[i].latitude]
      source.addFeature(new Feature({
        rad,
        flag:getFeather(speed),
        geometry: new Point(fromLonLat(lngLat))
      }))
      source2.addFeature(new Feature({
        name:data[i].name,
        is_online:data[i].is_online?'在线':'离线',
        speed,
        rad,
        coords:lngLat,
        geometry: new Point(fromLonLat(lngLat))
      }))
    }
  },{deep:true})
  station.FetchList()
  const source = new VectorSource()
  const source2= new VectorSource()
  map.addLayer(new WebGLPointsLayer({
    source:source2,
    style:style2,
  }))
  map.addLayer(new WebGLPointsLayer({
    source,
    style,
  }))
  // timer = setInterval(()=>{
  //   source.getFeatures().forEach(feature=>{
  //     feature.set('rad',Math.PI/180*Math.random()*360)
  //     let geometry = feature.get('geometry')
  //     geometry.setCoordinates(fromLonLat([110,30]))
  //     feature.set('geometry',geometry)
  //   })
  // },1000)


  function processData(data){
    for(let i=0;i<data.length;i++){
      let lngLat = [data[i].longitude,data[i].latitude]
      const rad = Math.PI/180*Math.random()*360
      source.addFeature(new Feature({
        rad,
        flag:getFeather(Math.random()*60),
        geometry: new Point(fromLonLat(lngLat))
      }))
      source2.addFeature(new Feature({
        coords:lngLat,
        geometry: new Point(fromLonLat(lngLat))
      }))
    }
  }
  processData(station.result)

  onBeforeUnmount(()=>{
    eventbus.off('将站点移动到屏幕中心',flyTo)
    clearInterval(timer)
  })
})

</script>

<style>
.ol-popup {
  width:200px;
  height: 120px;
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  padding: 5px;
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

#popup-conternt span{
  font-family: Menlo,Consolas,Monaco;
}
</style>