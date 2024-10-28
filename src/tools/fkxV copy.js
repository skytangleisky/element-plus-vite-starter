import * as echarts from 'echarts'
import { getColor } from "~/tools"
const getFeatherColor = (v)=>getColor(v)
export default function DBS() {
  let showType = '风羽' // 风羽|风矢
  var option = null
  var feathers = [
    'M7.5,12.5A2.5,2.5,0,1,0,10,15,2.5,2.5,0,0,0,7.5,12.5Zm0,4A1.5,1.5,0,1,1,9,15,1.5,1.5,0,0,1,7.5,16.5Z', // 0
    'M1,30H0V0H1Z', // 1
    'M0,0,0,30,1,30,1,1,8,1,8,0,0,0Z', // 2
    'M15,1H1V30H0V0H15Z', // 4
    'M1,1V5H8V6H1V30H0V0H15V1Z', // 6
    'M1,1V5H15V6H1V30H0V0H15V1Z', // 8
    'M1,1V5H15V6H1v4H8v1H1V30H0V0H15V1Z', // 10
    'M1,1V5H15V6H1v4H15v1H1V30H0V0H15V1Z', // 12
    'M1,1V5H15V6H1v4H15v1H1v4H8v1H1V30H0V0H15V1Z', // 14
    'M1,1V5H15V6H1v4H15v1H1v4H15v1H1V30H0V0H15V1Z', // 16
    'M1,1V5H15V6H1v4H15v1H1v4H15v1H1v4H8v1H1v9H0V0H15V1Z', // 18
    'M14.5,0H0V30H1V5.85L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0ZM1,4.79V1H11.61Z', // 20
    'M14.5,0H0V30H1V6H8V5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0ZM1,4.79V1H11.61Z', // 22
    'M15,5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0H0V30H1V6H15ZM1,1H11.61L1,4.79Z', // 24
    'M15,6V5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0H0V30H1V11H8V10H1V6ZM1,1H11.61L1,4.79Z', // 26
    'M15,6V5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0H0V30H1V11H15V10H1V6ZM1,1H11.61L1,4.79Z', // 28
    'M15,6V5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0H0V30H1V16H8V15H1V11H15V10H1V6ZM1,1H11.61L1,4.79Z', // 30
    'M15,6V5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0H0V30H1V16H15V15H1V11H15V10H1V6ZM1,1H11.61L1,4.79Z', // 32
    'M15,6V5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0H0V30H1V21H8V20H1V16H15V15H1V11H15V10H1V6ZM1,1H11.61L1,4.79Z', // 34
    'M15,6V5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0H0V30H1V21H15V20H1V16H15V15H1V11H15V10H1V6ZM1,1H11.61L1,4.79Z', // 36
    'M15,6V5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0H0V30H1V26H8V25H1V21H15V20H1V16H15V15H1V11H15V10H1V6ZM1,1H11.61L1,4.79Z', // 38
    'M14.5,5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0H0V30H1V10.85L14.67,6A.5.5,0,0,0,15,5.41.49.49,0,0,0,14.5,5ZM1,1H11.61L1,4.79ZM1,9.79V6H11.61Z', // 40
    'M14.5,5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0H0V30H1V11H8V10H3.39L14.67,6A.5.5,0,0,0,15,5.41.49.49,0,0,0,14.5,5ZM1,1H11.61L1,4.79ZM1,9.79V6H11.61Z', // 42
    'M15,10H3.39L14.67,6A.5.5,0,0,0,15,5.41.49.49,0,0,0,14.5,5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0H0V30H1V11H15ZM1,9.79V6H11.61ZM1,1H11.61L1,4.79Z', // 44
    'M15,11V10H3.39L14.67,6A.5.5,0,0,0,15,5.41.49.49,0,0,0,14.5,5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0H0V30H1V15H8V14H1V11ZM1,9.79V6H11.61ZM1,1H11.61L1,4.79Z', // 46
    'M15,11V10H3.39L14.67,6A.5.5,0,0,0,15,5.41.49.49,0,0,0,14.5,5H3.39L14.67,1A.5.5,0,0,0,15,.41.49.49,0,0,0,14.5,0H0V30H1V15H15V14H1V11ZM1,9.79V6H11.61ZM1,1H11.61L1,4.79Z', // 48
    'M15,.41a.5.5,0,0,1-.32.56L1,5.85V30H0V0H14.5A.49.49,0,0,1,15,.41Z', // 50
    'M15,.41a.5.5,0,0,1-.32.56L3.39,5H8V6H1V30H0V0H14.5A.49.49,0,0,1,15,.41Z', // 52
    'M15,6H1V30H0V0H14.5A.49.49,0,0,1,15,.42a.49.49,0,0,1-.32.55L3.39,5H15Z', // 54
    'M1,6v4H8v1H1V30H0V0H14.5A.49.49,0,0,1,15,.42a.49.49,0,0,1-.32.55L3.39,5H15V6Z', // 56
    'M1,6v4H15v1H1V30H0V0H14.5A.49.49,0,0,1,15,.42a.49.49,0,0,1-.32.55L3.39,5H15V6Z', // 58
    'M1,6v4H15v1H1v4H8v1H1V30H0V0H14.5A.49.49,0,0,1,15,.42a.49.49,0,0,1-.32.55L3.39,5H15V6Z' // 60
  ]

  var arrows = [
    'M10.86.92l.73.68L7.5,6,3.41,1.6,4.14.92,7,4V0H8V4Z', // 0
    'M10.86,1.67l.73.68L7.5,6.75,3.41,2.35l.73-.68L7,4.74V0H8V4.74Z', // 1
    'M10.86,2.42l.73.68L7.5,7.5,3.41,3.1l.73-.68L7,5.49V0H8V5.49Z', // 2
    'M10.86,3.17l.73.68L7.5,8.25,3.41,3.85l.73-.68L7,6.24V0H8V6.24Z', // 4
    'M10.86,3.92l.73.68L7.5,9,3.41,4.6l.73-.68L7,7V0H8V7Z', // 6
    'M10.86,4.67l.73.68L7.5,9.75,3.41,5.35l.73-.68L7,7.74V0H8V7.74Z', // 8
    'M7.5,10.5,3.41,6.1l.73-.68L7,8.49V0H8V8.49l2.86-3.07.73.68Z', // 10
    'M10.86,6.17l.73.68L7.5,11.25,3.41,6.85l.73-.68L7,9.24V0H8V9.24Z', // 12
    'M10.86,6.92l.73.68L7.5,12,3.41,7.6l.73-.68L7,10V0H8V10Z', // 14
    'M10.86,7.67l.73.68L7.5,12.75,3.41,8.35l.73-.68L7,10.74V0H8V10.74Z', // 16
    'M10.86,8.42l.73.68L7.5,13.5,3.41,9.1l.73-.68L7,11.49V0H8V11.49Z', // 18
    'M10.86,9.17l.73.68L7.5,14.25,3.41,9.85l.73-.68L7,12.24V0H8V12.24Z', // 20
    'M10.86,9.92l.73.68L7.5,15,3.41,10.6l.73-.68L7,13V0H8V13Z', // 22
    'M10.86,10.67l.73.68L7.5,15.75l-4.09-4.4.73-.68L7,13.74V0H8V13.74Z', // 24
    'M10.86,11.42l.73.68L7.5,16.5,3.41,12.1l.73-.68L7,14.49V0H8V14.49Z', // 26
    'M10.86,12.17l.73.68L7.5,17.25l-4.09-4.4.73-.68L7,15.24V0H8V15.24Z', // 28
    'M10.86,12.92l.73.68L7.5,18,3.41,13.6l.73-.68L7,16V0H8V16Z', // 30
    'M10.86,13.67l.73.68L7.5,18.75l-4.09-4.4.73-.68L7,16.74V0H8V16.74Z', // 32
    'M10.86,14.42l.73.68L7.5,19.5,3.41,15.1l.73-.68L7,17.49V0H8V17.49Z', // 34
    'M10.86,15.17l.73.68L7.5,20.25l-4.09-4.4.73-.68L7,18.24V0H8V18.24Z', // 36
    'M10.86,15.92l.73.68L7.5,21,3.41,16.6l.73-.68L7,19V0H8V19Z', // 38
    'M10.86,16.67l.73.68L7.5,21.75l-4.09-4.4.73-.68L7,19.74V0H8V19.74Z', // 40
    'M10.86,17.42l.73.68L7.5,22.5,3.41,18.1l.73-.68L7,20.49V0H8V20.49Z', // 42
    'M10.86,18.17l.73.68L7.5,23.25l-4.09-4.4.73-.68L7,21.24V0H8V21.24Z', // 44
    'M10.86,18.92l.73.68L7.5,24,3.41,19.6l.73-.68L7,22V0H8V22Z', // 46
    'M10.86,19.67l.73.68L7.5,24.75l-4.09-4.4.73-.68L7,22.74V0H8V22.74Z', // 48
    'M10.86,20.42l.73.68L7.5,25.5,3.41,21.1l.73-.68L7,23.49V0H8V23.49Z', // 50
    'M10.86,21.17l.73.68L7.5,26.25l-4.09-4.4.73-.68L7,24.24V0H8V24.24Z', // 52
    'M10.86,21.92l.73.68L7.5,27,3.41,22.6l.73-.68L7,25V0H8V25Z', // 54
    'M10.86,22.67l.73.68L7.5,27.75l-4.09-4.4.73-.68L7,25.74V0H8V25.74Z', // 56
    'M10.86,23.42l.73.68L7.5,28.5,3.41,24.1l.73-.68L7,26.49V0H8V26.49Z', // 58
    'M10.86,24.17l.73.68L7.5,29.25l-4.09-4.4.73-.68L7,27.24V0H8V27.24Z' // 60
  ]

  function verticalFlowColor(v) {
    const colors = ['#0000ff', '#001cff', '#0038ff', '#0054ff', '#0070ff', '#008cff', '#00a8ff', '#00c4ff', '#00e0ff', '#78ffff', '#ffff50', '#ffe600', '#ffbf00', '#ff9800', '#ff7100', '#ff4a00', '#ff2300', '#fb0000', '#d40000', '#ad0000']
    return v <= -5.4 ? colors[0] : v <= -4.8 ? colors[1] : v <= -4.2 ? colors[2] : v <= -3.6 ? colors[3] : v <= -3 ? colors[4] : v <= -2.4 ? colors[5] : v <= -1.8 ? colors[6] : v <= -1.2 ? colors[7] : v <= -0.6 ? colors[8] : v <= 0 ? colors[9] : v <= 0.6 ? colors[10] : v <= 1.2 ? colors[11] : v <= 1.8 ? colors[12] : v <= 2.4 ? colors[13] : v <= 3 ? colors[14] : v <= 3.6 ? colors[15] : v <= 4.2 ? colors[16] : v <= 4.8 ? colors[17] : v <= 5.4 ? colors[18] : colors[19]
  }
  var getFeather = v => v <= 0 ? 0 : v <= 1 ? 1 : v <= 2 ? 2 : v <= 4 ? 3 : v <= 6 ? 4 : v <= 8 ? 5 : v <= 10 ? 6 : v <= 12 ? 7 : v <= 14 ? 8 : v <= 16 ? 9 : v <= 18 ? 10 : v <= 20 ? 11 : v <= 22 ? 12 : v <= 24 ? 13 : v <= 26 ? 14 : v <= 28 ? 15 : v <= 30 ? 16 : v <= 32 ? 17 : v <= 34 ? 18 : v <= 36 ? 19 : v <= 38 ? 20 : v <= 40 ? 21 : v <= 42 ? 22 : v <= 44 ? 23 : v <= 46 ? 24 : v <= 48 ? 25 : v <= 50 ? 26 : v <= 52 ? 27 : v <= 54 ? 28 : v <= 56 ? 29 : v <= 58 ? 30 : 31
  var data = [
    [0, 0, 0],
    [0, 1, 1],
    [0, 2, 2],
    [0, 3, 3],
    [0, 4, 4],
    [0, 5, 5],
    [0, 6, 6],
    [0, 7, 7],
    [0, 8, 8],
    [0, 9, 9],
    [0, 10, 10],
    [0, 11, 11],
    [0, 12, 12],
    [0, 13, 13],
    [0, 14, 14],
    [0, 15, 15],
    [0, 16, 16],
    [0, 17, 17],
    [0, 18, 18],
    [0, 19, 19],
    [0, 20, 20],
    [0, 21, 21],
    [0, 22, 22],
    [0, 23, 23],
    [1, 0, 24],
    [1, 1, 25],
    [1, 2, 26],
    [1, 3, 27],
    [1, 4, 28],
    [1, 5, 29],
    [1, 6, 30],
    [1, 7, 31],
    [1, 8, 32],
    [1, 9, 33],
    [1, 10, 34],
    [1, 11, 35],
    [1, 12, 36],
    [1, 13, 37],
    [1, 14, 38],
    [1, 15, 39],
    [1, 16, 40],
    [1, 17, 41],
    [1, 18, 42],
    [1, 19, 43],
    [1, 20, 44],
    [1, 21, 45],
    [1, 22, 46],
    [1, 23, 47],
    [2, 0, 48],
    [2, 1, 49],
    [2, 2, 50],
    [2, 3, 51],
    [2, 4, 52],
    [2, 5, 53],
    [2, 6, 54],
    [2, 7, 55],
    [2, 8, 56],
    [2, 9, 57],
    [2, 10, 58],
    [2, 11, 59],
    [2, 12, 60],
    [2, 13, undefined],
    [2, 14, 8],
    [2, 15, 10],
    [2, 16, 6],
    [2, 17, 5],
    [2, 18, 5],
    [2, 19, 5],
    [2, 20, 7],
    [2, 21, 4],
    [2, 22, 2],
    [2, 23, 4],
    [3, 0, 7],
    [3, 1, 3],
    [3, 2, 0],
    [3, 3, 0],
    [3, 4, 0],
    [3, 5, 0],
    [3, 6, 0],
    [3, 7, 0],
    [3, 8, 1],
    [3, 9, 0],
    [3, 10, 5],
    [3, 11, 4],
    [3, 12, 7],
    [3, 13, 14],
    [3, 14, 13],
    [3, 15, 12],
    [3, 16, 9],
    [3, 17, 5],
    [3, 18, 5],
    [3, 19, 10],
    [3, 20, 6],
    [3, 21, 4],
    [3, 22, 4],
    [3, 23, 1],
    [4, 0, 1],
    [4, 1, 3],
    [4, 2, 0],
    [4, 3, 0],
    [4, 4, 0],
    [4, 5, 1],
    [4, 6, 0],
    [4, 7, 0],
    [4, 8, 0],
    [4, 9, 2],
    [4, 10, 4],
    [4, 11, 4],
    [4, 12, 2],
    [4, 13, 4],
    [4, 14, 4],
    [4, 15, 14],
    [4, 16, 12],
    [4, 17, 1],
    [4, 18, 8],
    [4, 19, 5],
    [4, 20, 3],
    [4, 21, 7],
    [4, 22, 3],
    [4, 23, 0],
    [5, 0, 2],
    [5, 1, 1],
    [5, 2, 0],
    [5, 3, 3],
    [5, 4, 0],
    [5, 5, 0],
    [5, 6, 0],
    [5, 7, 0],
    [5, 8, 2],
    [5, 9, 0],
    [5, 10, 4],
    [5, 11, 1],
    [5, 12, 5],
    [5, 13, 10],
    [5, 14, 5],
    [5, 15, 7],
    [5, 16, 11],
    [5, 17, 6],
    [5, 18, 0],
    [5, 19, 5],
    [5, 20, 3],
    [5, 21, 4],
    [5, 22, 2],
    [5, 23, 0],
    [6, 0, 1],
    [6, 1, 0],
    [6, 2, 0],
    [6, 3, 0],
    [6, 4, 0],
    [6, 5, 0],
    [6, 6, 0],
    [6, 7, 0],
    [6, 8, 0],
    [6, 9, 0],
    [6, 10, 1],
    [6, 11, 0],
    [6, 12, 2],
    [6, 13, 1],
    [6, 14, 3],
    [6, 15, 4],
    [6, 16, 0],
    [6, 17, 0],
    [6, 18, 0],
    [6, 19, 0],
    [6, 20, 1],
    [6, 21, 2],
    [6, 22, 2],
    [6, 23, 6]
  ].map(function(item) {
    return [item[1], item[0], item[2] === undefined ? '-' : item[2]]
  })
  data = []
  // data[0] = ["2017-06-27T11:00:00.000Z",8,"NNW",2.64]
  // data[1] = ["2017-06-27T11:00:00.000Z",9,"NNW",2.64]
  // data[2] = ["2017-06-27T11:00:00.000Z",10,"NNW",2.64]
  // weatherData[0] = ["2017-06-28", 0, "images/cloudy_128.png", 4, 13]
  const colors = ['#0000FF', '#001BFE', '#0135FF', '#0054FF', '#006FFF', '#008CFF', '#00A8FF', '#00C4FE', '#00E0FF', '#14D473', '#A6DC00', '#FFE600', '#FFBE00', '#FF9800', '#FF7100', '#FF4A00', '#FF2300', '#FB0000', '#D40000', '#AD0000']
  option = {
    animation: false,
    visualMap: [{
      type: 'piecewise',
      show: false,
      orient: 'vertical',
      top: 'center',
      left: 10,
      itemGap: 0,
      itemWidth: 40,
      itemHeight: 20,
      itemSymbol: 'rect',
      pieces: [
        {
          gte: 0,
          lt: 1,
          color: colors[0],
          label: '1'
        },
        {
          gte: 1,
          lt: 2,
          color: colors[1],
          label: '2'
        },
        {
          gte: 2,
          lt: 3,
          color: colors[2],
          label: '3'
        },
        {
          gte: 3,
          lt: 4,
          color: colors[3],
          label: '4'
        },
        {
          gte: 4,
          lt: 5,
          color: colors[4],
          label: '5'
        },
        {
          gte: 5,
          lt: 6,
          color: colors[5],
          label: '6'
        },
        {
          gte: 6,
          lt: 7,
          color: colors[6],
          label: '7'
        },
        {
          gte: 7,
          lt: 8,
          color: colors[7],
          label: '8'
        },
        {
          gte: 8,
          lt: 9,
          color: colors[8],
          label: '9'
        },
        {
          gte: 9,
          lt: 10,
          color: colors[9],
          label: '10'
        },
        {
          gte: 10,
          lt: 12,
          color: colors[10],
          label: '12'
        },
        {
          gte: 12,
          lt: 14,
          color: colors[11],
          label: '14'
        },
        {
          gte: 14,
          lt: 16,
          color: colors[12],
          label: '16'
        },
        {
          gte: 16,
          lt: 18,
          color: colors[13],
          label: '18'
        },
        {
          gte: 18,
          lt: 20,
          color: colors[14],
          label: '20'
        },
        {
          gte: 20,
          lt: 22,
          color: colors[15],
          label: '22'
        },
        {
          gte: 22,
          lt: 24,
          color: colors[16],
          label: '24'
        },
        {
          gte: 24,
          lt: 26,
          color: colors[17],
          label: '26'
        },
        {
          gte: 26,
          lt: 28,
          color: colors[18],
          label: '28'
        },
        {
          gte: 28,
          lt: 30,
          color: colors[19],
          label: '30'
        }
      ],
      textStyle: {}
    }],
    title: {
      text: '标题',
      subtext: '副标题',
      left: 'center'
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return [
          echarts.format.formatTime('yyyy-MM-dd hh:mm:ss', params.value[0]),
          '高度：' + params.value[1].toFixed(2) + 'm',
          '风向：' + params.value[2].toFixed(2) + '°',
          '风速：' + params.value[3].toFixed(2) + 'm/s'
        ].join('<br />')
      }
    },
    // grid: {
    // 	top: 100,
    // 	bottom: 50,
    // 	right:60,
    // 	left:50,
    // },
    xAxis: {
      type: 'time',
      boundaryGap: true,
      minInterval: 5000,
      maxInterval: 5000,
      interval: 5000,
      inverse: true,
      // min: function(value) {
      // 	return value.min - 1000;
      // },
      // max: function(value) {
      // 	return value.max + 1000;
      // },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#ddd'
        },
        interval: '5000'
      },
      axisLabel: {
        rotate: 360,
        // formatter: function(value, index){
        // 	return echarts.format.formatTime('hh:mm:ss', new Date(value));
        // }
      }
    },
    yAxis: [{
      name: '高度（米）',
      nameLocation: 'end',
      nameGap: 35,
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#ddd'
        }
      }
    }],
    dataZoom: [
      // {
      // type: 'inside',
      // xAxisIndex: 0,
      // minSpan: 5
      // },
      // {
      // 	type: 'slider',
      // 	xAxisIndex: 0,
      // 	minSpan: 5,
      // 	height: 20,
      // 	bottom: 50,
      // 	handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      // 	handleSize: '120%'
      // },
      {
        type: 'inside',
        zoomOnMouseWheel:'ctrl',
        yAxisIndex: 0,
        minSpan: 1,
      },
      {
        type: 'slider',
        right: 10,
        yAxisIndex: 0
      }
    ],
    series: [{
      name: 'Punch Card',
      type: 'heatmap',
      data: data,
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  var hours = [
    '0', '1', '2', '3', '4', '5', '6',
    '7', '8', '9', '10', '11',
    '12', '13', '14', '15', '16', '17',
    '18', '19', '20'
  ]

  function height(val) {
    if (val === '-') return 0
    return Number(val) * 0.75 + 6
  }
  option = {
    animation: false,
    backgroundColor:'transparent',
    tooltip: {
      position: 'top',
      // trigger: 'item',
      formatter: function(params) {
        return [
          '时间：' + params.value[3].time,
          '高度：' + params.value[3].fHei.toFixed(2) + 'm',
          '风向：' + params.value[3].fHAngle.toFixed(2) + '°',
          '风速：' + params.value[3].fHSpeed.toFixed(2) + 'm/s',
          '垂直气流：' + params.value[3].fVSpeed.toFixed(2) + 'm/s'
        ].join('<br />')
      }
    },
    grid: {
      bottom: '70px',
      left: '120px',
      right: '40px'
    },
    xAxis: {
      type: 'category',
      // type: 'time',
      // boundaryGap:true,
      // minInterval:5000,
      // maxInterval:5000,
      // interval:5000,
      // inverse:true,
      // min: function(value) {
      // 	return value.min - 1000;
      // },
      // max: function(value) {
      // 	return value.max + 1000;
      // },
      // splitLine: {
      // 	show: true,
      // 	lineStyle: {
      // 		color: '#ddd'
      // 	},
      // 	interval:'5000'
      // },
      data: hours,
      axisLabel: {
        rotate: 360,
        // formatter: function(value, index){
        // 	return echarts.format.formatTime('hh:mm:ss', new Date(value));
        // }
      }
    },
    // yAxis: {
    // 	type: 'category',
    // 	data: days,
    // 	splitArea: {
    // 		show: true
    // 	}
    // },
    yAxis: [{
      name: '高度（米）',
      type: 'category',
      nameLocation: 'end',
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#ddd'
        }
      },
      splitArea: {
        show: true
      }
    }],
    visualMap: [{
      seriesIndex: [-1],
      type: 'piecewise',
      show: true,
      orient: 'vertical',
      bottom: 'center',
      itemGap: -2,
      itemWidth: 20,
      itemHeight: 40,
      itemSymbol: 'rect',
      pieces: [{
        gte: 0,
        lt: 1,
        color: getFeatherColor(1),
        label: '1'
      },
      {
        gte: 1,
        lt: 2,
        color: getFeatherColor(2),
        label: '2'
      },
      {
        gte: 2,
        lt: 4,
        color: getFeatherColor(4),
        label: '4'
      },
      {
        gte: 4,
        lt: 6,
        color: getFeatherColor(6),
        label: '6'
      },
      {
        gte: 6,
        lt: 8,
        color: getFeatherColor(8),
        label: '8'
      },
      {
        gte: 8,
        lt: 10,
        color: getFeatherColor(10),
        label: '10'
      },
      {
        gte: 10,
        lt: 12,
        color: getFeatherColor(12),
        label: '12'
      },
      {
        gte: 12,
        lt: 14,
        color: getFeatherColor(14),
        label: '14'
      },
      {
        gte: 14,
        lt: 16,
        color: getFeatherColor(16),
        label: '16'
      },
      {
        gte: 16,
        lt: 18,
        color: getFeatherColor(18),
        label: '18'
      },
      {
        gte: 18,
        lt: 20,
        color: getFeatherColor(20),
        label: '20'
      }
      ],
      textStyle: {}
    },
    {
      seriesIndex: [-1],
      type: 'piecewise',
      show: false,
      orient: 'vertical',
      top: 'center',
      left: 10,
      itemGap: -2,
      itemWidth: 20,
      itemHeight: 20,
      itemSymbol: 'rect',
      pieces: [
        {
          gte: -6,
          lt: -4.8,
          color: verticalFlowColor(-4.8),
          label: '-4.8'
        },
        {
          gte: -4.8,
          lt: -4.2,
          color: verticalFlowColor(-4.2),
          label: '-4.2'
        },
        {
          gte: -4.2,
          lt: -3.6,
          color: verticalFlowColor(-3.6),
          label: '-3.6'
        },
        {
          gte: -3.6,
          lt: -3,
          color: verticalFlowColor(-3),
          label: '-3'
        },
        {
          gte: -3,
          lt: -2.4,
          color: verticalFlowColor(-2.4),
          label: '-2.4'
        },
        {
          gte: -2.4,
          lt: -1.8,
          color: verticalFlowColor(-1.8),
          label: '-1.8'
        },
        {
          gte: -1.8,
          lt: -1.2,
          color: verticalFlowColor(-1.2),
          label: '-1.2'
        },
        {
          gte: -1.2,
          lt: -0.6,
          color: verticalFlowColor(-0.6),
          label: '-0.6'
        },
        {
          gte: -0.6,
          lt: 0,
          color: verticalFlowColor(0),
          label: '0'
        },
        {
          gte: 0,
          lt: 0.6,
          color: verticalFlowColor(0.6),
          label: '0.6'
        },
        {
          gte: 0.6,
          lt: 1.2,
          color: verticalFlowColor(1.2),
          label: '1.2'
        },
        {
          gte: 1.2,
          lt: 1.8,
          color: verticalFlowColor(1.8),
          label: '1.8'
        },
        {
          gte: 1.8,
          lt: 2.4,
          color: verticalFlowColor(2.4),
          label: '2.4'
        },
        {
          gte: 2.4,
          lt: 3,
          color: verticalFlowColor(3),
          label: '3'
        },
        {
          gte: 3,
          lt: 3.6,
          color: verticalFlowColor(3.6),
          label: '3.6'
        },
        {
          gte: 3.6,
          lt: 4.2,
          color: verticalFlowColor(4.2),
          label: '4.2'
        },
        {
          gte: 4.2,
          lt: 4.8,
          color: verticalFlowColor(4.8),
          label: '4.8'
        },
        {
          gte: 4.8,
          lt: 5.4,
          color: verticalFlowColor(5.4),
          label: '5.4'
        },
        {
          gte: 5.4,
          lt: 6,
          color: verticalFlowColor(6),
          label: '6'
        }
      ],
      textStyle: {}
    }
    ],
    series: [{
      type: 'heatmap',
      data: data,
      label: {
        // show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      itemStyle: {
        color: function(params) {
          const obj = params.value[3]
          let color = (obj.fVSpeed === undefined||obj.fVSpeed==999) ? 'transparent' : verticalFlowColor(Number(obj.fVSpeed))
          return  color
        }
      }
    },
    {
      type: 'scatter',
      data: data,
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      symbol: function(value) {
        const obj = value[3]
        if (obj.fHSpeed === '-' || obj.fHSpeed <= 0||obj.fHSpeed == 999) { return 'path://' }
        if (showType === '风羽') {
          return 'path://' + feathers[getFeather(obj.fHSpeed)]
        } else {
          return 'path://' + arrows[getFeather(obj.fHSpeed)]
        }
      },
      symbolSize(value) {
        const obj = value[3]
        if (showType === '风羽') {
          if (getFeather(obj.fHSpeed) === 0) {
            return [10, 10]
          } else if (getFeather(obj.fHSpeed) === 1) {
            return [1, 30]
          } else if (getFeather(obj.fHSpeed) === 2) {
            return [10, 30]
          } else {
            return [15, 30]
          }
        } else {
          return [8.15, height(obj.fHSpeed)]
        }
      },
      symbolOffset: function(value) {
        const obj = value[3]
        const symbolRotate = -(obj.fHAngle === undefined ? 330 : obj.fHAngle)
        const cos = Math.cos(symbolRotate / 180 * Math.PI)
        const sin = Math.sin(symbolRotate / 180 * Math.PI)
        if (showType === '风羽') {
          if (getFeather(obj.fHSpeed === 0)) {
            return [0, 0]
          } else if (getFeather(obj.fHSpeed) === 1) {
            return [0.5 * cos - 15 * sin, -0.5 * sin - 15 * cos]
          } else if (getFeather(obj.fHSpeed) === 2) {
            return [5 * cos - 15 * sin, -5 * sin - 15 * cos]
          } else {
            return [7.5 * cos - 15 * sin, -7.5 * sin - 15 * cos]
          }
        } else {
          return [height(obj.fHSpeed) / 2 * sin, height(obj.fHSpeed) / 2 * cos]
        }
      },
      symbolRotate: function(value) {
        const obj = value[3]
        return -(obj.fHAngle === undefined ? 330 : obj.fHAngle)
      },
      itemStyle: {
        color: function(params) {
          const obj = params.value[3]
          return getFeatherColor(obj.fHSpeed)
        }
      }
    }
    ],
    dataZoom: [
      // {
      // type: 'inside',
      // xAxisIndex: 0,
      // minSpan: 5
      // },
      // {
      // 	type: 'slider',
      // 	xAxisIndex: 0,
      // 	minSpan: 5,
      // 	height: 20,
      // 	bottom: 50,
      // 	handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      // 	handleSize: '120%'
      // },
      {
        type: 'inside',
        xAxisIndex: 0,
        minSpan: 1,
        zoomOnMouseWheel:'ctrl'
      },
      {
        type: 'slider',
        xAxisIndex: 0
      },
      {
        type: 'inside',
        yAxisIndex: [0, 1],
        minSpan: 1,
        zoomOnMouseWheel:'shift'
      },
      {
        type: 'slider',
        right: 10,
        yAxisIndex: [0, 1]
      }
    ]
  }
  this.setTitle = function(arg) {
    arg.text
    arg.subtext
    if (myChart) {
      myChart.setOption({
        title: arg
      }, false, true)
    }
  }

  this.process = function(fData, type1, diejia, type2) {
    showType = type2
    option.series[1].data = []
    option.series[0].data = []
    if (!Array.isArray(fData)) {
      fData = [fData]
    }
    for (let i = 0; i < this.size; i++) {
      if (i < fData.length) {
        for (let index = 0; index < fData[i]. data.length; index++) {
          fData[i].data[index].time = fData[i].timestamp.substring(9,18)
          var fHei = fData[i]. data[index].fHei
          var fHSpeed = fData[i].data[index].fHSpeed
          var fVSpeed = fData[i].data[index].fVSpeed
          if (type1 === '垂直气流') {
            option.series[0].data.push([i, fHei, fVSpeed, fData[i].data[index]])
          }
          if (type1 === '水平风' || (diejia && type1 !== '水平风')) {
            option.series[1].data.push([i, fHei, fVSpeed, fData[i]. data[index]])
          }
          option.xAxis.data[i] = fData[i].timestamp.substring(9,18)
        }
      } else {
        option.xAxis.data[i] = ''
      }
    }
    if(type1==='水平风'){
      option.visualMap[0].show = true
      option.visualMap[1].show = false
    }else{
      option.visualMap[0].show = false
      option.visualMap[1].show = true
    }
    if (myChart) {
      myChart.setOption({
        series: option.series,
        visualMap:option.visualMap,
        xAxis: option.xAxis
      }, false, true)
    }
  }
  var myChart
  var resizeObserver
  this.init = function(setting) {
    this.size = setting.size;
    hours = []
    for(let i=0;i<this.size;i++){
      hours.push(i+1)
    }
    option.xAxis.data = hours
    if(setting.isDark){
      myChart = echarts.init(setting.el,"dark")
    }else{
      myChart = echarts.init(setting.el)
    }
    resizeObserver = new ResizeObserver((entries) => {
      myChart.resize();
    });
    resizeObserver.observe(setting.el);
    myChart.group = 'group'
    echarts.connect('group')
    myChart.setOption(option, false,true)
  }
  this.clear = function(){
    option.series[0].data=[]
    option.series[1].data=[]
    option.xAxis.data.map((v,k)=>{
      option.xAxis.data[k]=''
    })
    myChart.setOption(option,false,true)
  }
  this.destroy=function(){
    resizeObserver.disconnect()
    echarts.dispose(myChart)
  }
}