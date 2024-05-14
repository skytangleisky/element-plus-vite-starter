export default {
	"version": 8,
	"name": "Mapbox Streets",
	"metadata": {
		"mapbox:type": "default",
		"mapbox:origin": "streets-v11",
		"mapbox:autocomposite": true,
		"mapbox:groups": {
			"1444855786460.0557": {
				"name": "Roads",
				"collapsed": true
			},
			"1444934295202.7542": {
				"name": "Admin boundaries",
				"collapsed": true
			},
			"1444855799204.86": {
				"name": "Bridges",
				"collapsed": true
			},
			"1444855769305.6016": {
				"name": "Tunnels",
				"collapsed": true
			}
		}
	},
	"sources": {
    "raster-tiles": {
      "type": "raster",
      "tiles": [
        "https://tile.tanglei.site/maps/vt?lyrs=y&gl=CN&x={x}&y={y}&z={z}"
      ],
      "tileSize": 256
    }
	},
	"center": [0, 0],
	"zoom": 3,
	"sprite": "https://dev.tanglei.top/mapboxgl/resources/sprite/sprite@2x",
	"glyphs": "https://dev.tanglei.top/mapboxgl/resources/glyphs/{fontstack}/{range}.pbf",
	"layers": [{
		"id": "land",
		"type": "background",
		"metadata": {},
		"layout": {},
		"paint": {
			"background-color": ["interpolate", ["linear"],
				["zoom"], 11, "#2b2b2b", 13, "#2b2b2b"
			]
		}
	},{
    "id": "simple-tiles",
    "type": "raster",
    "source": "raster-tiles",
    "minzoom": 0,
    "maxzoom": 22
  }],
	"visibility": "public",
	"created": "1970-01-01T00:00:00.000Z",
	"modified": "1970-01-01T00:00:00.000Z",
	"owner": "mapbox",
	"id": "streets-v11",
	"draft": false
}