import layers from './layers.js'
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
			"mapbox:autocomposite": true,
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
			"mapbox:uiParadigm": "layers",
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
											"Arial Unicode MS Regular"
									],
									"settlementSubdivisions": true,
									"colorPlaceLabel": "hsl(220, 30%, 30%)",
									"colorBase": "hsl(20, 20%, 95%)",
									"countries": true,
									"worldview": "CN",
									"language": "Simplified Chinese",
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
			"horizon-blend": [
					"interpolate",
					["exponential", 1.2],
					["zoom"],
					5,
					0.02,
					7,
					0.08
			]
	},
	"sources": {
			"composite": {
					"url": "mapbox://mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2,mapbox.mapbox-bathymetry-v2",
					"type": "vector"
			}
	},
	"sprite": "mapbox://sprites/tanglei201314/clons7b5v00dm01prgrblhncs/6iqitl5z21pbbxxwuij8b59i2",
	"glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
	layers,
	"created": "2023-11-07T03:38:34.435Z",
	"modified": "2023-11-14T07:23:13.138Z",
	"id": "clons7b5v00dm01prgrblhncs",
	"owner": "tanglei201314",
	"visibility": "private",
	"protected": false,
	"draft": false
}