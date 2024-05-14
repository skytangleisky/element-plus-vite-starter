export default {
  "attribution":null,
  "attribution2": "<a href=\"https://www.mapbox.com/about/maps/\" target=\"_blank\" title=\"Mapbox\" aria-label=\"Mapbox\">&copy; Mapbox</a> <a href=\"https://www.openstreetmap.org/about/\" target=\"_blank\" title=\"OpenStreetMap\" aria-label=\"OpenStreetMap\">&copy; OpenStreetMap</a> <a class=\"mapbox-improve-map\" href=\"https://www.mapbox.com/contribute/\" target=\"_blank\" title=\"Improve this map\" aria-label=\"Improve this map\">Improve this map</a> <a href=\"https://www.maxar.com/\" target=\"_blank\" title=\"Maxar\" aria-label=\"Maxar\">&copy; Maxar</a>",
  "autoscale": true,
  "bounds": [
      -180,
      -85,
      180,
      85
  ],
  "cacheControl": "max-age=43200,s-maxage=2592000",
  "center": [
      0,
      0,
      3
  ],
  "created": 1358310600000,
  "id": "mapbox.satellite",
  "mapbox_logo": false,
  "maxzoom": 22,
  "minzoom": 0,
  "modified": 1614877124000,
  "name": "Mapbox Satellite",
  "private": false,
  "scheme": "xyz",
  "tilejson": "2.2.0",
  "tiles": [
    // `https://api.weather.com/v3/TileServer/tile?product=temp&ts=1703471700&xyz={x}:{y}:{z}&apiKey=bbd90b15bb534e3c990b15bb53fe3c03`
    'https://tile.tanglei.site/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}'
    // "https://api.weather.com/v3/TileServer/tile?product=twcRadarMosaic&ts=1703311500&xyz={x}:{y}:{z}&apiKey=bbd90b15bb534e3c990b15bb53fe3c03"//雷达
    // "https://api.weather.com/v3/TileServer/tile?product=sat&ts=1703313000&xyz={x}:{y}:{z}&apiKey=bbd90b15bb534e3c990b15bb53fe3c03"//云图
    // "https://api.weather.com/v3/TileServer/tile?product=temp&ts=1703471700&xyz={x}:{y}:{z}&apiKey=bbd90b15bb534e3c990b15bb53fe3c03"//温度
  ],
  "webpage": "https://dev-studio.tilestream.net/tilesets/mapbox.satellite"
}