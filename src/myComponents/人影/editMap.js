import city from './省界.json?url'
import beijing from './北京市.json?url'
import { useSettingStore } from '~/stores/setting';
const setting = useSettingStore()
export default {
	"version": 8,
	"name": "Streets",
	"metadata": {
			"mapbox:type": "default",
			"mapbox:origin": "streets-v12",
			"mapbox:sdk-support": {
					"js": "2.6.0",
					"android": "11.0.0",
					"ios": "11.0.0"
			},
			"mapbox:autocomposite": false,
			"mapbox:groups": {
					"Transit, transit-labels": {
							"name": "Transit, transit-labels",
							"collapsed": true
					},
					"Administrative boundaries, admin": {
							"name": "Administrative boundaries, admin",
							"collapsed": true
					},
					"Land & water, built": {
							"name": "Land & water, built",
							"collapsed": true
					},
					"Transit, bridges": {"name": "Transit, bridges", "collapsed": true},
					"Buildings, building-labels": {
							"name": "Buildings, building-labels",
							"collapsed": true
					},
					"Transit, surface": {"name": "Transit, surface", "collapsed": true},
					"Land & water, land": {
							"name": "Land & water, land",
							"collapsed": true
					},
					"Road network, bridges": {
							"name": "Road network, bridges",
							"collapsed": true
					},
					"Road network, tunnels": {
							"name": "Road network, tunnels",
							"collapsed": true
					},
					"Road network, road-labels": {
							"name": "Road network, road-labels",
							"collapsed": true
					},
					"Buildings, built": {"name": "Buildings, built", "collapsed": true},
					"Natural features, natural-labels": {
							"name": "Natural features, natural-labels",
							"collapsed": true
					},
					"Road network, surface": {
							"name": "Road network, surface",
							"collapsed": true
					},
					"Walking, cycling, etc., barriers-bridges": {
							"name": "Walking, cycling, etc., barriers-bridges",
							"collapsed": true
					},
					"Place labels, place-labels": {
							"name": "Place labels, place-labels",
							"collapsed": false
					},
					"Point of interest labels, poi-labels": {
							"name": "Point of interest labels, poi-labels",
							"collapsed": true
					},
					"Walking, cycling, etc., tunnels": {
							"name": "Walking, cycling, etc., tunnels",
							"collapsed": true
					},
					"Walking, cycling, etc., walking-cycling-labels": {
							"name": "Walking, cycling, etc., walking-cycling-labels",
							"collapsed": true
					},
					"Walking, cycling, etc., surface": {
							"name": "Walking, cycling, etc., surface",
							"collapsed": true
					},
					"Transit, built": {"name": "Transit, built", "collapsed": true},
					"Land & water, water": {
							"name": "Land & water, water",
							"collapsed": true
					},
					"Transit, ferry-aerialway-labels": {
							"name": "Transit, ferry-aerialway-labels",
							"collapsed": true
					}
			},
			"mapbox:trackposition": true,
			"mapbox:uiParadigm": "global",
			"mapbox:decompiler": {
					"id": "clons7b5v00dm01prgrblhncs",
					"componentVersion": "18.0.0",
					"strata": [
							{
									"id": "streets-v12",
									"order": [
											["land-and-water", "land"],
											["land-and-water", "water"],
											["land-and-water", "built"],
											["transit", "built"],
											["buildings", "built"],
											["walking-cycling", "tunnels"],
											["road-network", "tunnels"],
											["walking-cycling", "surface"],
											["road-network", "surface"],
											["transit", "surface"],
											["walking-cycling", "barriers-bridges"],
											["road-network", "bridges"],
											["transit", "bridges"],
											["buildings", "extruded"],
											["admin-boundaries", "admin"],
											["land-and-water", "terrain-labels"],
											["buildings", "building-labels"],
											["road-network", "road-labels"],
											["walking-cycling", "walking-cycling-labels"],
											["transit", "ferry-aerialway-labels"],
											["natural-features", "natural-labels"],
											["point-of-interest-labels", "poi-labels"],
											["transit", "transit-labels"],
											["place-labels", "place-labels"]
									]
							}
					],
					"overrides": {
							"place-labels": {
									"continent-label": {
											"layout": {"text-justify": {"remove": true}}
									}
							}
					},
					"components": {
							"road-network": "18.0.0",
							"natural-features": "18.0.0",
							"place-labels": "18.0.0",
							"admin-boundaries": "18.0.0",
							"point-of-interest-labels": "18.0.0",
							"walking-cycling": "18.0.0",
							"transit": "18.0.0",
							"land-and-water": "18.0.0",
							"buildings": "18.0.0"
					},
					"propConfig": {
							"road-network": {
									"colorBase": "hsl(20, 20%, 95%)",
									"colorRoad": "hsl(0, 0%, 100%)",
									"colorRoadOutline": "hsl(220, 20%, 85%)",
									"colorMotorwayTrunk": "hsl(40, 90%, 70%)",
									"colorRoadLabel": "hsl(0,0%, 0%)",
									"turningCircles": true,
									"roadMarkings": true
							},
							"natural-features": {
									"colorBase": "hsl(20, 20%, 95%)",
									"colorWater": "hsl(200, 100%, 80%)",
									"colorPoi": "hsl(210, 20%, 58%)"
							},
							"place-labels": {
									"continentsSize": 1,
									"states": true,
									"settlements": true,
									"continentsFont": [
											"DIN Pro Medium",
											"simkai"
									],
									"settlementSubdivisions": true,
									"colorPlaceLabel": "hsl(220, 30%, 30%)",
									"colorBase": "hsl(20, 20%, 95%)",
									"countries": true,
									"worldview": "CN",
									"language": "Traditional Chinese",
									"settlementSubdivisionsDensity": 3,
									"settlementsDensity": 2,
									"continents": true
							},
							"admin-boundaries": {
									"colorBase": "hsl(20, 20%, 95%)",
									"colorAdminBoundary": "hsl(240, 50%, 60%)"
							},
							"point-of-interest-labels": {
									"colorPoiEntertainment": "hsl(320, 70%, 75%)",
									"colorPoiEducation": "hsl(30, 50%, 55%)",
									"colorPoiFoodAndDrink": "hsl(40, 95%, 55%)",
									"poiIconScale": 0.8,
									"colorPoi": "hsl(210, 20%, 58%)",
									"colorPoiParkLike": "hsl(110, 70%, 40%)",
									"colorPoiMedical": "hsl(0, 70%, 70%)",
									"colorPoiCommercialServices": "hsl(260, 70%, 75%)",
									"poiIconBackground": "Circle",
									"colorPoiStoreLike": "hsl(210, 70%, 70%)",
									"colorBase": "hsl(20, 20%, 95%)",
									"colorPoiSportAndLeisure": "hsl(190, 60%, 60%)"
							},
							"walking-cycling": {
									"colorPoi": "hsl(210, 20%, 58%)",
									"colorBase": "hsl(20, 20%, 95%)",
									"colorGreenspace": "hsl(110, 60%, 80%)",
									"colorPoiParkLike": "hsl(110, 70%, 40%)",
									"colorRoad": "hsl(0, 0%, 100%)",
									"colorRoadOutline": "hsl(220, 20%, 85%)",
									"colorRoadLabel": "hsl(0,0%, 0%)"
							},
							"transit": {
									"poiIconBackground": "Rectangle",
									"poiIconScale": 0.8,
									"colorPoi": "hsl(210, 20%, 58%)",
									"colorBase": "hsl(20, 20%, 95%)",
									"colorTransit": "hsl(225, 60%, 58%)",
									"colorWater": "hsl(200, 100%, 80%)",
									"colorAirport": "hsl(225, 60%, 58%)",
									"colorRoadOutline": "hsl(220, 20%, 85%)"
							},
							"land-and-water": {
									"colorEducation": "hsl(40, 50%, 88%)",
									"colorGreenspace": "hsl(110, 60%, 80%)",
									"colorPoi": "hsl(210, 20%, 58%)",
									"colorPoiParkLike": "hsl(110, 70%, 40%)",
									"colorAirport": "hsl(225, 60%, 58%)",
									"colorIndustrialArea": "hsl(230, 20%, 90%)",
									"colorMedical": "hsl(0, 50%, 92%)",
									"colorBase": "hsl(20, 20%, 95%)",
									"colorWater": "hsl(200, 100%, 80%)",
									"colorCommercialArea": "hsl(45, 55%, 93%)",
									"bathymetry": true
							},
							"buildings": {"colorBase": "hsl(20, 20%, 95%)"}
					}
			}
	},
	"center": [114.42599917448024, 30.61120726899462],
	"zoom": 12.711177223232953,
	"bearing": 0,
	"pitch": 0,
	"fog": {
			"range": [2, 20],
			"color": "hsl(0, 0%, 100%)",
			"high-color": "hsl(210, 100%, 80%)",
			"space-color": [
				"interpolate",
				["exponential", 1.2],
				["zoom"],
				5,
				"hsl(210, 40%, 30%)",
				7,
				"hsl(210, 100%, 80%)"
			],
			"horizon-blend": [
				"interpolate",
				["exponential", 1.2],
				["zoom"],
				5,
				0.02,
				7,
				0.08
			],
			// "star-intensity": [
			// 	"interpolate",
			// 	["exponential", 1.2],
			// 	["zoom"],
			// 	5,
			// 	0.1,
			// 	7,
			// 	0
			// ]
	},
	"sources": {
		// 'mapbox-terrain': {
		// 	type: 'vector',
		// 	// url: 'mapbox://mapbox.mapbox-terrain-v2'
		// 	tiles: ['https://dem.tanglei.site?lyrs=d&x={x}&y={y}&z={z}'],
		// },
		"district":{
			"type":"geojson",
			"data": city
		},
		"beijing":{
			"type":"geojson",
			"data": beijing
		},
		// "composite": {
		// 		"url_origin": "mapbox://mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2,mapbox.mapbox-bathymetry-v2",
		// 		"tiles":["https://vector.tanglei.site?lyrs=v&x={x}&y={y}&z={z}"],
		// 		"type": "vector"
		// },
		"raster-tiles": {
			"type": "raster",
			url:null,//代码中设置
			// "tiles": [
			// 	"https://tile.tanglei.site/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}"
			// ],
			"tileSize": 256
		},
		"raster-route": {
			"type": "raster",
			// url:url2,
			"tiles": [
				window.location.origin+"/backend/image?x={x}&y={y}&z={z}"
			],
			"tileSize": 256
		},
		"raster-dem": {
			"type": "raster",
			"tiles": [window.location.origin+"/backend/demImage?lyrs=terrain&x={x}&y={y}&z={z}"],
			// "tiles":["https://terrain.tanglei.site?lyrs=terrain&x={x}&y={y}&z={z}"],
			"tileSize": 512,
			"maxzoom":14
		},
		// "mapbox-dem": {
		// 	"type": "raster-dem",
		// 	"url_origin": 'mapbox://mapbox.mapbox-terrain-dem-v1',
		// 	"tiles":["https://terrain.tanglei.site?lyrs=terrain&x={x}&y={y}&z={z}"],
		// 	// "tiles":[window.location.origin+"/backend/demImage?lyrs=terrain&x={x}&y={y}&z={z}"],
		// 	"tileSize": 512,
		// 	"maxzoom": 14,
		// },
	},
	// "terrain": { 'source': 'mapbox-dem', 'exaggeration': 1 },
	// "sprite_origin": "mapbox://sprites/tanglei201314/clons7b5v00dm01prgrblhncs/6iqitl5z21pbbxxwuij8b59i2",
	"sprite": window.location.origin+"/resources/sprite",
	// "glyphs_origin": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
	"glyphs": window.location.origin+"/resources/glyphs/{fontstack}/{range}.pbf",
	"projection": {"name": "mercator"},//albers, equalEarth, equirectangular, lambertConformalConic, mercator, naturalEarth, winkelTripel, globe
	"layers": [
			{
				"id": "land",
				"type": "background",
				"metadata": {
					"mapbox:featureComponent": "land-and-water",
					"mapbox:group": "Land & water, land"
				},
				"layout": {},
				"paint": {
					"background-color": [
						"interpolate",
						["linear"],
						["zoom"],
						9,
						"#2b2b2b",
						11,
						"#2b2b2b"
					]
				}
			},
			{
				"id": "simple-tiles",
				"type": "raster",
				"source": "raster-tiles",
				"minzoom": 0,
				"maxzoom": 22,
				layout:{
					visibility:setting.人影.监控.loadmap?'visible':'none'
				}
			},
			{
				"id": "demLayer",
				"type": "raster",
				"source": "raster-dem",
				"minzoom": 0,
				"maxzoom": 22,
				layout:{
					visibility:'none'
				}
			},
			{
				'id': 'districtLayer',
				'type': 'fill',
				'source': 'district', // reference the data source
				'layout': {
					visibility:setting.人影.监控.districtOptions.district?'visible':'none'
				},
				'paint': {
					'fill-color': `rgba(${setting.人影.监控.districtOptions.districtFillColor.r},${setting.人影.监控.districtOptions.districtFillColor.g},${setting.人影.监控.districtOptions.districtFillColor.b},${setting.人影.监控.districtOptions.districtFillColor.a})`,
					'fill-opacity': setting.人影.监控.districtOptions.districtFillOpacity,
					'fill-outline-color':'transparent'
				}
			},
			{
				'id': 'districtLineBase',
				'type': 'line',
				'source': 'district',
				'layout': {
					'visibility':setting.人影.监控.districtOptions.districtBase?'visible':'none',
					'line-join':'round',
					'line-cap':'round',
				},
				'paint': {
					'line-color': `rgba(${setting.人影.监控.districtOptions.districtBaseColor.r},${setting.人影.监控.districtOptions.districtBaseColor.g},${setting.人影.监控.districtOptions.districtBaseColor.b},${setting.人影.监控.districtOptions.districtBaseColor.a})`,
					'line-width': setting.人影.监控.districtOptions.districtBaseWidth,
					'line-opacity': setting.人影.监控.districtOptions.districtBaseOpacity,
				}
			},
			{
				'id': 'districtLineOver',
				'type': 'line',
				'source': 'district',
				'layout': {
					'visibility':setting.人影.监控.districtOptions.districtLine?'visible':'none',
					'line-join':'round',
					'line-cap':'round',
				},
				'paint': {
					'line-color': `rgba(${setting.人影.监控.districtOptions.districtLineColor.r},${setting.人影.监控.districtOptions.districtLineColor.g},${setting.人影.监控.districtOptions.districtLineColor.b},${setting.人影.监控.districtOptions.districtLineColor.a})`,
					'line-width': setting.人影.监控.districtOptions.districtLineWidth,
					'line-opacity': setting.人影.监控.districtOptions.districtLineOpacity,
					// 'line-dasharray': [1,1],
				}
			},
			// {
			// 	'id': 'terrain-data',
			// 	'type': 'line',
			// 	'source': 'mapbox-terrain',
			// 	'source-layer': 'contour',
			// 	'layout': {
			// 			'line-join': 'round',
			// 			'line-cap': 'round'
			// 	},
			// 	'paint': {
			// 			'line-color': '#ff69b4',
			// 			'line-width': 1
			// 	}
			// }
	],
	"created": "2023-11-07T03:38:34.435Z",
	"modified": "2023-11-14T11:53:57.549Z",
	"id": "clons7b5v00dm01prgrblhncs",
	"owner": "tanglei201314",
	"visibility": "private",
	"protected": false,
	"draft": false
}