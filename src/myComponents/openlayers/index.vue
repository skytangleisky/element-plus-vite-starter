<template>
  <div id="map" class="map" style="position: absolute;left:0;top:0;width:100vw;height:100vh;"></div>
  <div style="position: absolute;left:0;top:0;background-color: #2b2b2b;display: none;">
    <div>Current sighting: <span id="info"></span></div>
    <div>
      <label for="shape-filter">Filter by UFO shape:</label>
      <select id="shape-filter"></select>
    </div>
  </div>

  <div id="popup" class="ol-popup">
    <div href="#" id="popup-closer" class="ol-popup-closer"></div>
    <div id="popup-content"></div>
  </div>
</template>
<script setup>
import FullScreen from 'ol/control/FullScreen'
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import { fetchList } from '~/api/光恒/station'
import {onMounted,onBeforeUnmount} from 'vue'
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/WebGLTile';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import XYZ from 'ol/source/XYZ';
import {fromLonLat,toLonLat} from 'ol/proj';
import 'ol/ol.css';
import Overlay from 'ol/Overlay'
import {toStringHDMS} from 'ol/coordinate';
import { Style,Fill,Stroke,Circle,Icon } from 'ol/Style'
import ufo_sighting_data from './data/ufo_sighting_data.csv?url'
// import ufo_shapes from './data/ufo_shapes.png?url'
import ufo_shapes from '../../assets/feather.svg?url'
// import ufo_shapes from '../../assets/feather.png?url'
import circle from '../../assets/circle.png?url'
let aid
let POINT = {lng:116.39139324235674,lat:39.90723893689098}
onMounted(()=>{
  /**
   * Elements that make up the popup.
   */
  const container = document.getElementById('popup');
  const content = document.getElementById('popup-content');
  const closer = document.getElementById('popup-closer');
  const mapContainer = document.getElementById('map');
  if(!(container&&content&&closer&&mapContainer))throw Error()

  /**
   * Create an overlay to anchor the popup to the map.
   */
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

  const vector = new VectorLayer({
    // background: '#ffffff',
    source: new VectorSource({
      // url: 'https://openlayers.org/data/vector/us-states.json',
      url: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
      format: new GeoJSON(),
      wrapX: true,
    })
  });

  const attributions =
    '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
    '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
  const map = new Map({
    overlays:[overlay],
    layers: [
      new TileLayer({
        preload: Infinity,
        // source: new XYZ({
        //   attributions: attributions,
        //   url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + "Get your own API key at https://www.maptiler.com/cloud/",
        //   tileSize: 512,
        // }),
        source: new XYZ({
          // attributions: attributions,
          // url: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}',
          url: 'https://wprd0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          tileSize: 256,
        }),
      }),
      vector
    ],
    target: mapContainer,
    view: new View({
      // center: [0, 4000000],
      center:fromLonLat([115.32778147089213, 39.56998593853058]),
      zoom: 13,
      multiWorld: false,
    }),
  });
  map.on('moveend',evt=>{
    // console.log('center:',toLonLat(map.getView().getCenter()),'zoom:',map.getView().getZoom())
  })
  map.addControl(new FullScreen())
  const style = {
    variables: {
      filterShape: 'all',
    },
    filter: [
      'any',
      ['==', ['var', 'filterShape'], 'all'],
      ['==', ['var', 'filterShape'], ['get', 'shape']],
    ],
    symbol: {
      symbolType: 'image',
      src: ufo_shapes,
      size: [16,32],
      color: [
        'interpolate',
        ['linear'],
        ['get', 'speed'],
        0,'#0000ff',4,'#002aff',8,'#0054ff',12,'#007eff',16,'#00a8ff',20,'#00d2ff',24,'#14d474',28,'#a6dd00',32,'#ffe600',36,'#ffb300',40,'#ff8000',44,'#ff4d00',48,'#ff1a00',52,'#e60000',56,'#b30000',58,'#b30000',60,'#b30000',
      ],
      rotateWithView: true,
      rotation:['get', 'deg'],
      offset: [8, 16],
      textureCoord:[
        'match',
        ['get','flag'],
        0,
        [0*(16+20)/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1)),0*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        1,
        [1*(16+20)/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1)),1*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        2,
        [2*(16+20)/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1)),2*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        4,
        [3*(16+20)/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1)),3*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        6,
        [4*(16+20)/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1)),4*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        8,
        [5*(16+20)/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1)),5*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        10,
        [6*(16+20)/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1)),6*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        12,
        [7*(16+20)/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1)),7*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        14,
        [8*(16+20)/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1)),8*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        16,
        [9*(16+20)/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1)),9*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),0*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        18,
        [0*(16+20)/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1)),0*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        20,
        [1*(16+20)/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1)),1*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        22,
        [2*(16+20)/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1)),2*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        24,
        [3*(16+20)/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1)),3*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        26,
        [4*(16+20)/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1)),4*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        28,
        [5*(16+20)/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1)),5*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        30,
        [6*(16+20)/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1)),6*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        32,
        [7*(16+20)/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1)),7*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        34,
        [8*(16+20)/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1)),8*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        36,
        [9*(16+20)/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1)),9*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),1*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        38,
        [0*(16+20)/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1)),0*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        40,
        [1*(16+20)/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1)),1*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        42,
        [2*(16+20)/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1)),2*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        44,
        [3*(16+20)/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1)),3*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        46,
        [4*(16+20)/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1)),4*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        48,
        [5*(16+20)/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1)),5*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        50,
        [6*(16+20)/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1)),6*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        52,
        [7*(16+20)/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1)),7*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        54,
        [8*(16+20)/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1)),8*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        56,
        [9*(16+20)/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1)),9*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        58,
        [0*(16+20)/(16*10+20*(10-1)),3*(32+20)/(32*4+20*(4-1)),0*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),3*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
        [9*(16+20)/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1)),9*(16+20)/(16*10+20*(10-1))+16/(16*10+20*(10-1)),2*(32+20)/(32*4+20*(4-1))+32/(32*4+20*(4-1))],
      ]
      // [
      //   'match',
      //   ['get', 'shape'],
      //   'light',
      //   [0, 0, 0.25, 0.5],
      //   'sphere',
      //   [0.25, 0, 0.5, 0.5],
      //   'circle',
      //   [0.25, 0, 0.5, 0.5],
      //   'disc',
      //   [0.5, 0, 0.75, 0.5],
      //   'oval',
      //   [0.5, 0, 0.75, 0.5],
      //   'triangle',
      //   [0.75, 0, 1, 0.5],
      //   'fireball',
      //   [0, 0.5, 0.25, 1],
      //   [0.75, 0.5, 1, 1],
      // ],
    },
  }



  const style2 = {
    variables: {
      filterShape: 'all',
    },
    filter: [
      'any',
      ['==', ['var', 'filterShape'], 'all'],
      ['==', ['var', 'filterShape'], ['get', 'shape']],
    ],
  "symbol": {
    "symbolType": "circle",
    "size": 10,
    "color": [
      "match",
      [
        "get",
        "hover"
      ],
      1,
      "#ff3f3f",
      "#006688"
    ],
    "rotateWithView": false,
    "offset": [
      0,
      0
    ],
    "opacity": 0.6
  }
  }

  const shapeSelect = document.getElementById('shape-filter');
  shapeSelect.addEventListener('input', function () {
    style.variables.filterShape = shapeSelect.value;
    map.render();
  });
  function getFeather(v){
    return v<=0?0:v<=1?1:v<=2?2:v<=4?4:v<=6?6:v<=8?8:v<=10?10:v<=12?12:v<=14?14:v<=16?16:v<=18?18:v<=20?20:v<=22?22:v<=24?24:v<=26?26:v<=28?28:v<=30?30:v<=32?32:v<=34?34:v<=36?36:v<=38?38:v<=40?40:v<=42?42:v<=44?44:v<=46?46:v<=48?48:v<=50?50:v<=52?52:v<=54?54:v<=56?56:v<=58?58:60
  }
  function fillShapeSelect(shapeTypes) {
    Object.keys(shapeTypes)
      .sort(function (a, b) {
        return shapeTypes[b] - shapeTypes[a];
      })
      .forEach(function (shape) {
        const option = document.createElement('option');
        const sightings = shapeTypes[shape];
        option.text = `${shape} (${sightings} sighting${
          sightings === 1 ? '' : 's'
        })`;
        option.value = shape;
        shapeSelect.appendChild(option);
      });
  }

  const features = [];
  let layer
  fetchList().then(res=>{
    if(res.status==200){
      if(res.data.code==200){
        let data = res.data.data
        data.forEach(item=>{
          const coords = [item.longitude, item.latitude];
          let speed = Math.random()*60

          const feature = new Feature({
            datetime: 1900,
            year: 2023,
            shape: undefined,
            duration: 1000,
            deg:Math.PI/180*parseFloat(item.latitude),
            coords,
            // geometry: new Point(fromLonLat(coords)),
            geometry: new Point(fromLonLat(coords)),
            speed,
            flag: getFeather(speed),
            color:'#f00'
          })
          feature.setStyle(new Style({
            image: new Icon({
              color: '#BADA55',
              crossOrigin: 'anonymous',
              // For Internet Explorer 11
              imgSize: [20, 20],
              src: circle,
            }),
          }))
          features.push(feature)
        })



        map.addLayer(
          new WebGLPointsLayer({
            source: new VectorSource({
              features: features,
              // attributions: 'National UFO Reporting Center',
            }),
            style: style2,
          })
        );
        layer = new WebGLPointsLayer({
          source: new VectorSource({
            features: features,
            // attributions: 'National UFO Reporting Center',
          }),
          style: style,
        })
        map.addLayer(layer)
      }else{
        console.error(res.data)
      }
    }else{
      console.error(res)
    }
  })

  const timer = setInterval(()=>{
    features.forEach(feature=>{
      feature.set('deg', Math.PI/180*Math.random()*360)
      feature.set('speed',Math.random()*60)
    })
  },1000)
  /*
  const client = new XMLHttpRequest();
  client.open('GET', ufo_sighting_data);
  client.addEventListener('load', function () {
    const csv = client.responseText;
    // key is shape name, value is sightings count
    const shapeTypes = {};
    const features = [];
    let prevIndex = csv.indexOf('\n') + 1; // scan past the header line
    let curIndex;
    while ((curIndex = csv.indexOf('\n', prevIndex)) !== -1) {
      const line = csv.substring(prevIndex, curIndex).split(',');
      prevIndex = curIndex + 1;

      const coords = [parseFloat(line[5]), parseFloat(line[4])];
      const shape = line[2];
      shapeTypes[shape] = (shapeTypes[shape] || 0) + 1;
      let speed = Math.random()*60
      features.push(
        new Feature({
          datetime: line[0],
          year: parseInt(/[0-9]{4}/.exec(line[0])[0], 10), // extract the year as int
          shape: shape,
          duration: line[3],
          deg:Math.PI/180*parseFloat(line[4]),
          coords,
          geometry: new Point(fromLonLat(coords)),
          speed,
          flag: getFeather(speed),
          color:'#f00'
        })
      )
    }
    shapeTypes['all'] = features.length;

    map.addLayer(
      new WebGLPointsLayer({
        source: new VectorSource({
          features: features,
          // attributions: 'National UFO Reporting Center',
        }),
        style: style2,
      })
    );
    map.addLayer(
      new WebGLPointsLayer({
        source: new VectorSource({
          features: features,
          // attributions: 'National UFO Reporting Center',
        }),
        style: style,
      })
    )
    fillShapeSelect(shapeTypes);
  });
  client.send();
  */
  onBeforeUnmount(()=>{
    cancelAnimationFrame(aid)
    clearInterval(timer)
  })
  const info = document.getElementById('info');
  let selected = null
  map.on('pointermove',function(evt){
    if(selected!==null){
      selected.set('hover',0)
      selected=null
    }
    map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      feature.set('hover',1)
      selected = feature
      return true
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
    info.innerText = text || '';
  });
  function animate() {
    map.render();
    aid = window.requestAnimationFrame(animate);
  }
  // animate();
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