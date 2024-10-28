import * as echarts from 'echarts'
import 宁波地形图地址 from './imgs/宁波.jpg?url'
import a from './imgs/a.png?url'
import b from './imgs/b.png?url'
import c from './imgs/c.png?url'
import d from './imgs/d.png?url'
let scatterData = []
let serData = []

const options = () => {
   return {
      geo3D: {
         map: '宁波市',
         show: true,
         roam: true,
         viewControl: {
            distance: 150,
            center: [-2, -5, 0],
         },
         itemStyle: {
            color: 'rgba(255,255,255,1)',
            borderWidth: 2,
            borderColor: `rgba(255,255,255,1)`,
         },
         shading: 'lambert',
         lambertMaterial: {
            detailTexture: 宁波地形图地址,
         },
         emphasis: {
            label: {
               show: false
            },
            itemStyle: {
               color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                     {
                        offset: 0,
                        color: '#CCF8F9',
                     },
                     {
                        offset: 1,
                        color: '#7EA9D9',
                     },
                  ],
                  false
               ),
               borderWidth: 3,
               borderColor: '#fff',
            },
         },
         data: [],
         regions: [],
         z: 100,
      },
      series: [],
   }
}

const mapPoint = [
   {
      name: '慈溪市',
      tags: '接入率',
      lon: ['121.308052', '30.277142'],
      textLon: ['121.278052', '30.147142'],
      numLon: ['121.278052', '30.185142'],
      iconLon: ['121.208052', '30.289142'],
      value: 150, proportion: 12
   },
   {
      name: '余姚市',
      tags: '接入率',
      lon: ['121.056294', '30.135404'],
      textLon: ['121.036294', '30.005404'],
      numLon: ['121.036294', '30.045404'],
      iconLon: ['120.956294', '30.147404'],
      value: 150, proportion: 12
   },
   {
      name: '象山县',
      tags: '接入率',
      lon: ['121.867091', '29.400206'],
      textLon: ['121.837091', '29.270206'],
      numLon: ['121.837091', '29.310206'],
      iconLon: ['121.767091', '29.413206'],
      value: 150, proportion: 12
   },
   {
      name: '宁海县',
      tags: '接入率',
      lon: ['121.472606', '29.369836'],
      textLon: ['121.442606', '29.231836'],
      numLon: ['121.442606', '29.282836'],
      iconLon: ['121.372606', '29.382836'],
      value: 150, proportion: 12
   },
   {
      name: '北仑区',
      tags: '接入率',
      lon: ['121.871303', '29.87944'],
      textLon: ['121.844303', '29.73944'],
      numLon: ['121.844303', '29.79244'],
      iconLon: ['121.778303', '29.89244'],
      value: 150, proportion: 12
   },
   {
      name: '鄞州区',
      tags: '接入率',
      lon: ['121.708436', '29.751662'],
      textLon: ['121.678436', '29.411662'],
      numLon: ['121.679436', '29.676662'],
      iconLon: ['121.618436', '29.764662'],
      value: 150, proportion: 12
   },
   {
      name: '奉化区',
      tags: '接入率',
      lon: ['121.41089', '29.652348'],
      textLon: ['121.38089', '29.312348'],
      numLon: ['121.38089', '29.567348'],
      iconLon: ['121.32089', '29.667348'],
      value: 150, proportion: 12
   },
   {
      name: '镇海区',
      tags: '接入率',
      lon: ['121.653162', '30.002107'],
      textLon: ['121.620162', '29.866107'],
      numLon: ['121.626162', '29.916107'],
      iconLon: ['121.563162', '30.016107'],
      value: 150, proportion: 12
   },
   {
      name: '江北区',
      tags: '接入率',
      lon: ['121.489282', '29.968361'],
      textLon: ['121.459282', '29.828361'],
      numLon: ['121.459282', '29.888361'],
      iconLon: ['121.399282', '29.980361'],
      value: 150, proportion: 12
   },
   {
      name: '海曙区',
      tags: '接入率',
      lon: ['121.359698', '29.824452'],
      textLon: ['121.329698', '29.690452'],
      numLon: ['121.329698', '29.742452'],
      iconLon: ['121.269698', '29.837452'],
      value: 150, proportion: 12
   },
]


const map3D = () => {
   return {
      type: 'map3D',
      map: '宁波市',
      regionHeight: 8,
      show: true,
      roam: false,
      label: {
         show: false,
      },
      itemStyle: {
         opacity: 0,
      },
      viewControl: {
         distance: 150,
         center: [-2, -5, 0],
      },
      zlevel: 100,
      silent: false,
   }
}

scatterData = mapPoint.map((item) => {
   return {
      name: item.name,
      imgbg: a,
      img: b,
      data: [
         { name: item.name, value: item.lon },
         { name: item.tags, value: item.numLon, num: item.proportion + '%' },
      ],
      tooltip: [
         {
            name: '已接入',
            value: item.accessSchoolNum,
            icon: c,
         },
         {
            name: '未接入',
            value: item.unaccessSchoolNum,
            icon: d,
         },
      ],
   }
})


scatterData.forEach((item) => {
   serData.push({
      name: `${item.name}`,
      type: 'scatter3D',
      coordinateSystem: 'geo3D',
      effectType: 'ripple',
      showEffectOn: 'render',
      symbol: 'none',
      emphasis: {
         scale: true,
      },
      label: {
         show: true,
         position: 'top',
         formatter: (params) => {
            if (params.data.num) return `{bgn|${params.data.name}   ${params.data.num}}  `
            else return `{bgt|${params.data.name}} `
         },
         distance: -1,
         rich: {
            bgn: {
               color: '#fff',
               fontSize: 14,
               backgroundColor: {
                  image: item.imgbg,
               },
               textAline: 'center',
               height: 35,
               width: 100,
               padding: [0, 0, 0, 20],
            },
            bgt: {
               color: '#fff',
               fontSize: 16,
               backgroundColor: {
                  image: item.img,
               },
               textAline: 'center',
               height: 30,
               width: 100,
               padding: [0, 0, 0, 20],
            },
         },
      },
      data: item.data,
   })
})

import json from './宁波市.json'
echarts.registerMap('宁波市', json)
let option = options()

option.series.push(...serData)

option.series.push(map3D())

option.tooltip = {
   show: true,
   backgroundColor: '#193369',
   borderColor: '#193369',
   formatter: (params) => {
      // const { tooltip } = scatterData.value.find((item) => item.name === params.data.name)
      // if (!tooltip) return
      // return tooltip
      //    .map((item) => {
      //       return `<div style="display: flex; align-items: center; justify-content: space-between; color: #fff; font-size: 14px; ">
      //               <img src="${item.icon}" alt="" style="margin-right: 10px;" />
      //               <div style="margin-right: 10px;" >${item.name}</div>
      //               <div style="margin-right: 10px;" >${item.value}所</div>
      //             </div>`
      //    })
      //    .join('')
      return 'xxx'
   },
}

export default option;