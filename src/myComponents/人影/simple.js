import city from './省界.json?url'
// import url from "./street.json?url"
import data from "./street.js"
let url = URL.createObjectURL(new File([JSON.stringify(data)],"satellite.json",{type:"application/json"}))
import data2 from "./satellite2.js"
let url2 = URL.createObjectURL(new File([JSON.stringify(data2)],"satellite.json",{type:"application/json"}))
import data3 from "./satellite3.js"
let url3 = URL.createObjectURL(new File([JSON.stringify(data3)],"satellite.json",{type:"application/json"}))
import { useSettingStore } from '~/stores/setting';
const setting = useSettingStore()
export default {
	"version": 8,
	"name": "Streets",
	"metadata": {
			// "mapbox:type": "default",
			// "mapbox:origin": "streets-v12",
			// "mapbox:sdk-support": {
			// 		"js": "2.6.0",
			// 		"android": "11.0.0",
			// 		"ios": "11.0.0"
			// },
			// "mapbox:autocomposite": true,
			// "mapbox:trackposition": true,
			// "mapbox:uiParadigm": "global",
			// "mapbox:decompiler": {
			// 		"id": "clons7b5v00dm01prgrblhncs",
			// 		"componentVersion": "18.0.0",
			// 		"strata": [
			// 				{
			// 						"id": "streets-v12",
			// 						"order": [
			// 								["land-and-water", "land"],
			// 								["land-and-water", "water"],
			// 								["land-and-water", "built"],
			// 								["transit", "built"],
			// 								["buildings", "built"],
			// 								["walking-cycling", "tunnels"],
			// 								["road-network", "tunnels"],
			// 								["walking-cycling", "surface"],
			// 								["road-network", "surface"],
			// 								["transit", "surface"],
			// 								["walking-cycling", "barriers-bridges"],
			// 								["road-network", "bridges"],
			// 								["transit", "bridges"],
			// 								["buildings", "extruded"],
			// 								["admin-boundaries", "admin"],
			// 								["land-and-water", "terrain-labels"],
			// 								["buildings", "building-labels"],
			// 								["road-network", "road-labels"],
			// 								["walking-cycling", "walking-cycling-labels"],
			// 								["transit", "ferry-aerialway-labels"],
			// 								["natural-features", "natural-labels"],
			// 								["point-of-interest-labels", "poi-labels"],
			// 								["transit", "transit-labels"],
			// 								["place-labels", "place-labels"]
			// 						]
			// 				}
			// 		],
			// 		"overrides": {
			// 				"place-labels": {
			// 						"continent-label": {
			// 								"layout": {"text-justify": {"remove": true}}
			// 						}
			// 				}
			// 		},
			// 		"components": {
			// 				"road-network": "18.0.0",
			// 				"natural-features": "18.0.0",
			// 				"place-labels": "18.0.0",
			// 				"admin-boundaries": "18.0.0",
			// 				"point-of-interest-labels": "18.0.0",
			// 				"walking-cycling": "18.0.0",
			// 				"transit": "18.0.0",
			// 				"land-and-water": "18.0.0",
			// 				"buildings": "18.0.0"
			// 		},
			// 		"propConfig": {
			// 				"road-network": {
			// 						"colorBase": "hsl(20, 20%, 95%)",
			// 						"colorRoad": "hsl(0, 0%, 100%)",
			// 						"colorRoadOutline": "hsl(220, 20%, 85%)",
			// 						"colorMotorwayTrunk": "hsl(40, 90%, 70%)",
			// 						"colorRoadLabel": "hsl(0,0%, 0%)",
			// 						"turningCircles": true,
			// 						"roadMarkings": true
			// 				},
			// 				"natural-features": {
			// 						"colorBase": "hsl(20, 20%, 95%)",
			// 						"colorWater": "hsl(200, 100%, 80%)",
			// 						"colorPoi": "hsl(210, 20%, 58%)"
			// 				},
			// 				"place-labels": {
			// 						"continentsSize": 1,
			// 						"states": true,
			// 						"settlements": true,
			// 						"continentsFont": [
			// 								"DIN Pro Medium",
			// 								"simkai"
			// 						],
			// 						"settlementSubdivisions": true,
			// 						"colorPlaceLabel": "hsl(220, 30%, 30%)",
			// 						"colorBase": "hsl(20, 20%, 95%)",
			// 						"countries": true,
			// 						"worldview": "CN",
			// 						"language": "Traditional Chinese",
			// 						"settlementSubdivisionsDensity": 3,
			// 						"settlementsDensity": 2,
			// 						"continents": true
			// 				},
			// 				"admin-boundaries": {
			// 						"colorBase": "hsl(20, 20%, 95%)",
			// 						"colorAdminBoundary": "hsl(240, 50%, 60%)"
			// 				},
			// 				"point-of-interest-labels": {
			// 						"colorPoiEntertainment": "hsl(320, 70%, 75%)",
			// 						"colorPoiEducation": "hsl(30, 50%, 55%)",
			// 						"colorPoiFoodAndDrink": "hsl(40, 95%, 55%)",
			// 						"poiIconScale": 0.8,
			// 						"colorPoi": "hsl(210, 20%, 58%)",
			// 						"colorPoiParkLike": "hsl(110, 70%, 40%)",
			// 						"colorPoiMedical": "hsl(0, 70%, 70%)",
			// 						"colorPoiCommercialServices": "hsl(260, 70%, 75%)",
			// 						"poiIconBackground": "Circle",
			// 						"colorPoiStoreLike": "hsl(210, 70%, 70%)",
			// 						"colorBase": "hsl(20, 20%, 95%)",
			// 						"colorPoiSportAndLeisure": "hsl(190, 60%, 60%)"
			// 				},
			// 				"walking-cycling": {
			// 						"colorPoi": "hsl(210, 20%, 58%)",
			// 						"colorBase": "hsl(20, 20%, 95%)",
			// 						"colorGreenspace": "hsl(110, 60%, 80%)",
			// 						"colorPoiParkLike": "hsl(110, 70%, 40%)",
			// 						"colorRoad": "hsl(0, 0%, 100%)",
			// 						"colorRoadOutline": "hsl(220, 20%, 85%)",
			// 						"colorRoadLabel": "hsl(0,0%, 0%)"
			// 				},
			// 				"transit": {
			// 						"poiIconBackground": "Rectangle",
			// 						"poiIconScale": 0.8,
			// 						"colorPoi": "hsl(210, 20%, 58%)",
			// 						"colorBase": "hsl(20, 20%, 95%)",
			// 						"colorTransit": "hsl(225, 60%, 58%)",
			// 						"colorWater": "hsl(200, 100%, 80%)",
			// 						"colorAirport": "hsl(225, 60%, 58%)",
			// 						"colorRoadOutline": "hsl(220, 20%, 85%)"
			// 				},
			// 				"land-and-water": {
			// 						"colorEducation": "hsl(40, 50%, 88%)",
			// 						"colorGreenspace": "hsl(110, 60%, 80%)",
			// 						"colorPoi": "hsl(210, 20%, 58%)",
			// 						"colorPoiParkLike": "hsl(110, 70%, 40%)",
			// 						"colorAirport": "hsl(225, 60%, 58%)",
			// 						"colorIndustrialArea": "hsl(230, 20%, 90%)",
			// 						"colorMedical": "hsl(0, 50%, 92%)",
			// 						"colorBase": "hsl(20, 20%, 95%)",
			// 						"colorWater": "hsl(200, 100%, 80%)",
			// 						"colorCommercialArea": "hsl(45, 55%, 93%)",
			// 						"bathymetry": true
			// 				},
			// 				"buildings": {"colorBase": "hsl(20, 20%, 95%)"}
			// 		}
			// }
	},
	"center": [114.42599917448024, 30.61120726899462],
	"zoom": 12.711177223232953,
	"bearing": 0,
	"pitch": 0,
	// "fog": {
	// 		"range": [2, 20],
	// 		"color": "hsl(0, 0%, 100%)",
	// 		"high-color": "hsl(210, 100%, 80%)",
	// 		"space-color": [
	// 				"interpolate",
	// 				["exponential", 1.2],
	// 				["zoom"],
	// 				5,
	// 				"hsl(210, 40%, 30%)",
	// 				7,
	// 				"hsl(210, 100%, 80%)"
	// 		],
	// 		"horizon-blend": [
	// 				"interpolate",
	// 				["exponential", 1.2],
	// 				["zoom"],
	// 				5,
	// 				0.02,
	// 				7,
	// 				0.08
	// 		],
	// 		"star-intensity": [
	// 				"interpolate",
	// 				["exponential", 1.2],
	// 				["zoom"],
	// 				5,
	// 				0.1,
	// 				7,
	// 				0
	// 		]
	// },
	"sources": {
		"district":{
			"type":"geojson",
			"data": city
		},
		"composite": {
				"url_origin": "mapbox://mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2,mapbox.mapbox-bathymetry-v2",
				"tiles":["https://tanglei.site:3220?lyrs=v&x={x}&y={y}&z={z}"],
				"type": "vector"
		},
		"raster-tiles": {
			"type": "raster",
			url,
			// "tiles": [
			// 	"https://tanglei.site:3210/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}"
			// ],
			"tileSize": 256
		},
		"raster-route": {
			"type": "raster",
			url:url2,
			// "tiles": [
			// 	window.location.origin+"/backend/image?x={x}&y={y}&z={z}"
			// ],
			"tileSize": 256
		},
		"raster-isoline": {
			"type": "raster",
			url:url3,
			// "tiles": [
			// 	window.location.origin+"/backend/image?x={x}&y={y}&z={z}"
			// ],
			"tileSize": 256
		}
	},
	// "terrain": { 'source': 'mapbox-dem', 'exaggeration': 1 },
	"sprite_origin": "mapbox://sprites/tanglei201314/clons7b5v00dm01prgrblhncs/6iqitl5z21pbbxxwuij8b59i2",
	"glyphs_origin": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
	"sprite": window.location.origin+"/resources/sprite",
	"glyphs": window.location.origin+"/resources/glyphs/{fontstack}/{range}.pbf",
	"projection": {"name": "mercator"},//albers, equalEarth, equirectangular, lambertConformalConic, mercator, naturalEarth, winkelTripel, globe
	"layers": [
	],
	"created": "2023-11-07T03:38:34.435Z",
	"modified": "2023-11-14T11:53:57.549Z",
	"id": "clons7b5v00dm01prgrblhncs",
	"owner": "tanglei201314",
	"visibility": "private",
	"protected": false,
	"draft": false
}