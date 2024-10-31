import 'echarts-gl'
export default{
    geo3D:{
        map:'chongqing',
        "itemStyle": {
            "color": "#007aff",
            "opacity": 0.8,
            "borderWidth": 2.4,
            "borderColor": "#fff"
        },
        roam:"true",
        // 视觉控制相关
        "viewControl": {
            "autoRotate": false,
            "autoRotateAfterStill": 3,
            "distance": 160,
            "minAlpha": 5,
            "maxAlpha": 90,
            "minBeta": -360,
            "maxBeta": 360000,
            "animation": true,
            "autoRotateSpeed": 3
        },
        // 鼠标悬浮强调相关
        "emphasis": {
            "label": {
                "show": true,
                "color": "#000",
                "fontSize": 18
            },
            "itemStyle": {
                "color": "#3CABFA"
            }
        },
        "itemStyle": {
                areaColor: 'rgb(10,60,83)',
                borderColor: 'rgba(147, 235, 248, 1)',
                borderWidth: 1,
                areaColor: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.8,
                    colorStops: [
                        {
                            offset: 0,
                            color: 'rgba(143, 235, 231, 0)' // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: 'rgba(143, 235, 231, .2)' // 100% 处的颜色
                        }
                    ],
                    globalCoord: false // 缺省为 false
                },
                shadowColor: 'rgba(128, 217, 248, 1)',
            // color:'#1D5C71',
            borderWidth:1,
            borderColor:'#93EBF8'
        },
        // 地图区域标题相关
        "label": {
            "show": false,
            "position": "bottom",
            "color": "#000",
            "fontSize": 14,
            "lineHeight": 18
        },
        // shading值为color时light配置无效
        "shading": "lambert",
        "light": {
            "main": {
                "intensity": 1,
                "shadow": true,
                "shadowQuality": "medium",
                "alpha": 120,
                "beta": 120
            },
            "ambient": {
                "intensity": 0.6
            },
            "ambientCubemap": {
                "diffuseIntensity": 66,
                "specularIntensity": 97
            }
        }
    },
    series: [
        // {
        //     type: 'map3D',
        //     coordinateSystem: 'geo3D',
        //     map: 'chongqing',
        //     regionHeight: 0.5,
        //     shading: 'lambert'
        // }
    ]
}