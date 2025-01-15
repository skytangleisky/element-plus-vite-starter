import { Layer, TileSource, RenderType, DecodeType, RenderFrom, MaskType } from '@sakitam-gis/mapbox-wind';
const source = new TileSource('wind', {
  // url: 'https://blog.sakitam.com/wind-layer/data/tiles/2023111700/2023111703/{z}/{x}/{y}/wind-surface.jpeg',
  url: window.location.origin+'/wind-layer/2023111703/{z}/{y}/{x}.jpeg',
  tileSize: 256,
  minZoom: 0,
  maxZoom: 2,
  roundZoom: true,
  decodeType: DecodeType.imageWithExif,
  wrapX: true,
});

const windColor = [
  [0, [98, 113, 183, 255]],
  [1, [57, 97, 159, 255]],
  [3, [74, 148, 169, 255]],
  [5, [77, 141, 123, 255]],
  [7, [83, 165, 83, 255]],
  [9, [53, 159, 53, 255]],
  [11, [167, 157, 81, 255]],
  [13, [159, 127, 58, 255]],
  [15, [161, 108, 92, 255]],
  [17, [129, 58, 78, 255]],
  [19, [175, 80, 136, 255]],
  [21, [117, 74, 147, 255]],
  [24, [109, 97, 163, 255]],
  [27, [68, 105, 141, 255]],
  [29, [92, 144, 152, 255]],
  [36, [125, 68, 165, 255]],
  [46, [231, 215, 215, 256]],
  [51, [219, 212, 135, 256]],
  [77, [205, 202, 112, 256]],
  [104, [128, 128, 128, 255]],
];

const interpolateColor = windColor.reduce(
  (result: any[], item: any[], key) => result.concat(item[0], `rgba(${item[1].join(',')})`),
  [],
);
let layer = new Layer('wind', source, {
  styleSpec: {
    'fill-color': ['interpolate', ['linear'], ['get', 'value'], ...interpolateColor],
    opacity: 0.4,
  },
  renderFrom: RenderFrom.rg,
  widthSegments: 1,
  heightSegments: 1,
  displayRange: [0, 104],
  renderType: RenderType.colorize,
});
const particlesConfig = {
  speedFactor: ['interpolate', ['exponential', 0.5], ['zoom'], 0, 1, 15, 0.01],
  fadeOpacity: 0.93,
  dropRate: 0.003,
  dropRateBump: 0.002,
};

const windParticles = new Layer('wind-particles', source, {
  styleSpec: {
    // 'fill-color': ['interpolate', ['step', 1], ['get', 'value'], 0, '#fff', 104, '#fff'],
    'fill-color': ['interpolate', ['linear'], ['get', 'value'], 0, '#ff0', 10, '#f00'],
    opacity: ['interpolate', ['exponential', 0.5], ['zoom'], 1, 1, 2, 1],
    numParticles: [
      'interpolate',
      ['exponential', 0.5],
      ['zoom'],
      0, // zoom
      65535 / 8, // numParticles
      8, // zoom
      65535 / 16, // numParticles
    ],
    ...particlesConfig,
  },
  renderFrom: RenderFrom.rg,
  displayRange: [0, 104],
  renderType: RenderType.particles,
  // mask: {
  //   data: clip,
  //   // type: mapboxWind.MaskType.outside,
  //   type: mapboxWind.MaskType.inside, // 默认是 inside，即只显示范围内的
  // }
});
export {layer,windParticles}
