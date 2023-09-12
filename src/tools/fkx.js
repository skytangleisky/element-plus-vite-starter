import * as echarts from 'echarts';
export default function DBS() {
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

  function getFeatherColor(speed) {
    return speed <= 4 ? '#0000ff' : speed <= 8 ? '#002aff' : speed <= 12 ? '#0054ff' : speed <= 16 ? '#007eff' : speed <= 20 ? '#00a8ff' : speed <= 24 ? '#00d2ff' : speed <= 28 ? '#14d474' : speed <= 32 ? '#a6dd00' : speed <= 36 ? '#ffe600' : speed <= 40 ? '#ffb300' : speed <= 44 ? '#ff8000' : speed <= 48 ? '#ff4d00' : speed <= 52 ? '#ff1a00' : speed <= 56 ? '#e60000' : '#b30000'
  }
  var getFeather = v => v <= 0 ? 0 : v <= 1 ? 1 : v <= 2 ? 2 : v <= 4 ? 3 : v <= 6 ? 4 : v <= 8 ? 5 : v <= 10 ? 6 : v <= 12 ? 7 : v <= 14 ? 8 : v <= 16 ? 9 : v <= 18 ? 10 : v <= 20 ? 11 : v <= 22 ? 12 : v <= 24 ? 13 : v <= 26 ? 14 : v <= 28 ? 15 : v <= 30 ? 16 : v <= 32 ? 17 : v <= 34 ? 18 : v <= 36 ? 19 : v <= 38 ? 20 : v <= 40 ? 21 : v <= 42 ? 22 : v <= 44 ? 23 : v <= 46 ? 24 : v <= 48 ? 25 : v <= 50 ? 26 : v <= 52 ? 27 : v <= 54 ? 28 : v <= 56 ? 29 : v <= 58 ? 30 : 31
  let data = []
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
        color: 'black'
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
        yAxisIndex: 0,
        minSpan: 1
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
    '0', '1', '2', '3', '4', '5'
  ]

  option = {
    animation: false,
    tooltip: {
      hideDelay:0,
      position: 'top',
      // trigger: 'item',
      formatter: function(params) {
        return [
          '时间：' + params.value[2].time,
          '高度：' + params.value[1] + 'm',
          '风向：' + params.value[2].fHAngle + '°',
          '风速：' + params.value[2].fHSpeed + 'm/s',
          '垂直气流：' + params.value[2].fVSpeed + 'm/s'
        ].join('<br />')
      }
    },
    grid: {
      bottom: '20px',
      left: '110px',
      right: '40px'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
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
        color: 'black'
        // formatter: function(value, index){
        // 	return echarts.format.formatTime('hh:mm:ss', new Date(value));
        // }
      }
    },
    // yAxis: {
    //   type: 'category',
    //   data: days,
    //   splitArea: {
    //     show: true
    //   }
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
    visualMap: {
      seriesIndex: [1000],
      type: 'piecewise',
      show: true,
      orient: 'vertical',
      bottom: 0,
      left: 10,
      itemGap: -2,
      itemWidth: 20,
      itemHeight: 10,
      itemSymbol: 'rect',
      pieces: [{
        gte: 0,
        lt: 4,
        color: getFeatherColor(4),
        label: '4'
      },
      {
        gte: 4,
        lt: 8,
        color: getFeatherColor(8),
        label: '8'
      },
      {
        gte: 8,
        lt: 12,
        color: getFeatherColor(12),
        label: '12'
      },
      {
        gte: 12,
        lt: 16,
        color: getFeatherColor(16),
        label: '16'
      },
      {
        gte: 16,
        lt: 20,
        color: getFeatherColor(20),
        label: '20'
      },
      {
        gte: 20,
        lt: 24,
        color: getFeatherColor(24),
        label: '24'
      },
      {
        gte: 24,
        lt: 28,
        color: getFeatherColor(28),
        label: '28'
      },
      {
        gte: 28,
        lt: 32,
        color: getFeatherColor(32),
        label: '32'
      },
      {
        gte: 32,
        lt: 36,
        color: getFeatherColor(36),
        label: '36'
      },
      {
        gte: 36,
        lt: 40,
        color: getFeatherColor(40),
        label: '40'
      },
      {
        gte: 40,
        lt: 44,
        color: getFeatherColor(44),
        label: '44'
      },
      {
        gte: 44,
        lt: 48,
        color: getFeatherColor(48),
        label: '48'
      },
      {
        gte: 48,
        lt: 52,
        color: getFeatherColor(52),
        label: '52'
      },
      {
        gte: 52,
        lt: 56,
        color: getFeatherColor(56),
        label: '56'
      },
      {
        gte: 52,
        lt: 60,
        color: getFeatherColor(60),
        label: '60'
      }
      ],
      textStyle: {}
    },
    series: [{
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
        const obj = value[2]
        if(obj){
          return 'path://' + feathers[getFeather(Number(obj.fHSpeed))]
        }else{
          return 'path://'
        }
      },
      symbolSize(value) {
        const obj = value[2]
        if (getFeather(Number(obj.fHSpeed)) === 0) {
          return [10, 10]
        } else if (getFeather(Number(obj.fHSpeed)) === 1) {
          return [1, 30]
        } else if (getFeather(Number(obj.fHSpeed)) === 2) {
          return [10, 30]
        } else {
          return [15, 30]
        }
      },
      symbolOffset: function(value) {
        const obj = value[2]
        const symbolRotate = -(Number(obj.fHAngle) === undefined ? 330 : Number(obj.fHAngle)) + 180
        const cos = Math.cos(symbolRotate / 180 * Math.PI)
        const sin = Math.sin(symbolRotate / 180 * Math.PI)
        if (getFeather(Number(obj.fHSpeed) === 0)) {
          return [0, 0]
        } else if (getFeather(Number(obj.fHSpeed)) === 1) {
          return [0.5 * cos - 15 * sin, -0.5 * sin - 15 * cos]
        } else if (getFeather(Number(obj.fHSpeed)) === 2) {
          return [5 * cos - 15 * sin, -5 * sin - 15 * cos]
        } else {
          return [7.5 * cos - 15 * sin, -7.5 * sin - 15 * cos]
        }
      },
      symbolRotate: function(value) {
        const obj = value[2]
        return 180 - Number(obj.fHAngle)
      },
      itemStyle: {
        color: function(params) {
          const obj = params.value[2]
          return getFeatherColor(Number(obj.fHSpeed))
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
        yAxisIndex: [0, 1],
        minSpan: 1
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
  this.process = function(fData) {
    option.series[0].data = []
    console.log(fData.timestamp)
        for (let index = 0; index < fData.data.length; index++) {
          fData.data[index].time = fData.timestamp
          var fHei = fData.data[index].fHei
          // var fHorChange = fData[index].fHorChange
          // var fHAngle = fData.data[index].fHAngle
          var fHSpeed = fData.data[index].fHSpeed
          // var fSDev = fData.data[index].fSDev
          var fVSpeed = fData.data[index].fVSpeed
          // var fVerChange = fData.data[index].fVerChange
          // var iBelieveable = fData.data[index].iBelieveable
          if (Number(fHSpeed) === 999) continue
          // option.series[1].data.push([1, fHei, fVSpeed, fData.data[index]])
          option.series[0].data.push([0, fHei,fData.data[index]])
          option.xAxis.data[0] = fData.timestamp.substr(11,8)
        }
    if (myChart) {
      myChart.setOption({
        series: option.series,
        xAxis: option.xAxis
      }, false, true)
    }
  }
  var myChart
  this.init = function(setting) {
    // size = setting.size;
    myChart = echarts.init(setting.el)
    myChart.group = 'group'
    echarts.connect('group')
    myChart.setOption(option, false)
    new ResizeObserver(entries => {
      myChart.resize()
    }).observe(setting.el)
  }
}

export const Fdata = {
  'data': [{
    'fHei': '42.00',
    'fHorChange': '999.00',
    'fHAngle': '23.90',
    'fHSpeed': '14.03',
    'fSDev': '0.00',
    'fVSpeed': '0.16',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '70.00',
    'fHorChange': '999.00',
    'fHAngle': '30.70',
    'fHSpeed': '13.55',
    'fSDev': '0.00',
    'fVSpeed': '-0.98',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '98.00',
    'fHorChange': '999.00',
    'fHAngle': '32.60',
    'fHSpeed': '14.58',
    'fSDev': '0.00',
    'fVSpeed': '-1.50',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '126.00',
    'fHorChange': '999.00',
    'fHAngle': '32.40',
    'fHSpeed': '15.94',
    'fSDev': '0.00',
    'fVSpeed': '-1.67',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '155.00',
    'fHorChange': '999.00',
    'fHAngle': '31.70',
    'fHSpeed': '17.04',
    'fSDev': '0.00',
    'fVSpeed': '-1.70',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '183.00',
    'fHorChange': '999.00',
    'fHAngle': '31.20',
    'fHSpeed': '17.77',
    'fSDev': '0.00',
    'fVSpeed': '-1.68',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '211.00',
    'fHorChange': '999.00',
    'fHAngle': '31.10',
    'fHSpeed': '18.15',
    'fSDev': '0.00',
    'fVSpeed': '-1.67',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '239.00',
    'fHorChange': '999.00',
    'fHAngle': '31.60',
    'fHSpeed': '18.32',
    'fSDev': '0.00',
    'fVSpeed': '-1.67',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '267.00',
    'fHorChange': '999.00',
    'fHAngle': '32.50',
    'fHSpeed': '18.47',
    'fSDev': '0.00',
    'fVSpeed': '-1.68',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '296.00',
    'fHorChange': '999.00',
    'fHAngle': '33.70',
    'fHSpeed': '18.67',
    'fSDev': '0.00',
    'fVSpeed': '-1.71',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '324.00',
    'fHorChange': '999.00',
    'fHAngle': '35.10',
    'fHSpeed': '19.03',
    'fSDev': '0.00',
    'fVSpeed': '-1.73',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '352.00',
    'fHorChange': '999.00',
    'fHAngle': '36.50',
    'fHSpeed': '19.53',
    'fSDev': '0.00',
    'fVSpeed': '-1.75',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '380.00',
    'fHorChange': '999.00',
    'fHAngle': '37.90',
    'fHSpeed': '20.14',
    'fSDev': '0.00',
    'fVSpeed': '-1.77',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '408.00',
    'fHorChange': '999.00',
    'fHAngle': '39.20',
    'fHSpeed': '20.77',
    'fSDev': '0.00',
    'fVSpeed': '-1.78',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '436.00',
    'fHorChange': '999.00',
    'fHAngle': '40.40',
    'fHSpeed': '21.37',
    'fSDev': '0.00',
    'fVSpeed': '-1.79',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '465.00',
    'fHorChange': '999.00',
    'fHAngle': '41.60',
    'fHSpeed': '21.82',
    'fSDev': '0.00',
    'fVSpeed': '-1.79',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '493.00',
    'fHorChange': '999.00',
    'fHAngle': '42.70',
    'fHSpeed': '22.08',
    'fSDev': '0.00',
    'fVSpeed': '-1.79',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '521.00',
    'fHorChange': '999.00',
    'fHAngle': '43.80',
    'fHSpeed': '22.11',
    'fSDev': '0.00',
    'fVSpeed': '-1.80',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '549.00',
    'fHorChange': '999.00',
    'fHAngle': '45.00',
    'fHSpeed': '21.88',
    'fSDev': '0.00',
    'fVSpeed': '-1.82',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '577.00',
    'fHorChange': '999.00',
    'fHAngle': '46.30',
    'fHSpeed': '21.42',
    'fSDev': '0.00',
    'fVSpeed': '-1.84',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '606.00',
    'fHorChange': '999.00',
    'fHAngle': '47.60',
    'fHSpeed': '20.76',
    'fSDev': '0.00',
    'fVSpeed': '-1.87',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '634.00',
    'fHorChange': '999.00',
    'fHAngle': '48.90',
    'fHSpeed': '19.96',
    'fSDev': '0.00',
    'fVSpeed': '-1.89',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '662.00',
    'fHorChange': '999.00',
    'fHAngle': '50.20',
    'fHSpeed': '19.08',
    'fSDev': '0.00',
    'fVSpeed': '-1.92',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '690.00',
    'fHorChange': '999.00',
    'fHAngle': '51.40',
    'fHSpeed': '18.17',
    'fSDev': '0.00',
    'fVSpeed': '-1.93',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '718.00',
    'fHorChange': '999.00',
    'fHAngle': '52.30',
    'fHSpeed': '17.34',
    'fSDev': '0.00',
    'fVSpeed': '-1.94',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '747.00',
    'fHorChange': '999.00',
    'fHAngle': '52.90',
    'fHSpeed': '16.56',
    'fSDev': '0.00',
    'fVSpeed': '-1.93',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '775.00',
    'fHorChange': '999.00',
    'fHAngle': '53.00',
    'fHSpeed': '15.92',
    'fSDev': '0.00',
    'fVSpeed': '-1.92',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '803.00',
    'fHorChange': '999.00',
    'fHAngle': '52.80',
    'fHSpeed': '15.41',
    'fSDev': '0.00',
    'fVSpeed': '-1.90',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '831.00',
    'fHorChange': '999.00',
    'fHAngle': '52.30',
    'fHSpeed': '15.03',
    'fSDev': '0.00',
    'fVSpeed': '-1.88',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '859.00',
    'fHorChange': '999.00',
    'fHAngle': '51.50',
    'fHSpeed': '14.80',
    'fSDev': '0.00',
    'fVSpeed': '-1.85',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '888.00',
    'fHorChange': '999.00',
    'fHAngle': '50.50',
    'fHSpeed': '14.67',
    'fSDev': '0.00',
    'fVSpeed': '-1.83',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '916.00',
    'fHorChange': '999.00',
    'fHAngle': '49.70',
    'fHSpeed': '14.63',
    'fSDev': '0.00',
    'fVSpeed': '-1.81',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '944.00',
    'fHorChange': '999.00',
    'fHAngle': '48.90',
    'fHSpeed': '14.63',
    'fSDev': '0.00',
    'fVSpeed': '-1.79',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '972.00',
    'fHorChange': '999.00',
    'fHAngle': '48.40',
    'fHSpeed': '14.63',
    'fSDev': '0.00',
    'fVSpeed': '-1.78',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1000.00',
    'fHorChange': '999.00',
    'fHAngle': '48.20',
    'fHSpeed': '14.62',
    'fSDev': '0.00',
    'fVSpeed': '-1.78',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1028.00',
    'fHorChange': '999.00',
    'fHAngle': '48.40',
    'fHSpeed': '14.55',
    'fSDev': '0.00',
    'fVSpeed': '-1.78',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1057.00',
    'fHorChange': '999.00',
    'fHAngle': '48.70',
    'fHSpeed': '14.40',
    'fSDev': '0.00',
    'fVSpeed': '-1.78',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1085.00',
    'fHorChange': '999.00',
    'fHAngle': '49.10',
    'fHSpeed': '14.19',
    'fSDev': '0.00',
    'fVSpeed': '-1.79',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1113.00',
    'fHorChange': '999.00',
    'fHAngle': '49.60',
    'fHSpeed': '13.92',
    'fSDev': '0.00',
    'fVSpeed': '-1.80',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1141.00',
    'fHorChange': '999.00',
    'fHAngle': '49.90',
    'fHSpeed': '13.57',
    'fSDev': '0.00',
    'fVSpeed': '-1.80',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1169.00',
    'fHorChange': '999.00',
    'fHAngle': '49.90',
    'fHSpeed': '13.17',
    'fSDev': '0.00',
    'fVSpeed': '-1.80',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1198.00',
    'fHorChange': '999.00',
    'fHAngle': '49.50',
    'fHSpeed': '12.72',
    'fSDev': '0.00',
    'fVSpeed': '-1.79',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1226.00',
    'fHorChange': '999.00',
    'fHAngle': '48.50',
    'fHSpeed': '12.21',
    'fSDev': '0.00',
    'fVSpeed': '-1.77',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1254.00',
    'fHorChange': '999.00',
    'fHAngle': '47.20',
    'fHSpeed': '11.66',
    'fSDev': '0.00',
    'fVSpeed': '-1.75',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1282.00',
    'fHorChange': '999.00',
    'fHAngle': '45.10',
    'fHSpeed': '11.04',
    'fSDev': '0.00',
    'fVSpeed': '-1.72',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1310.00',
    'fHorChange': '999.00',
    'fHAngle': '42.50',
    'fHSpeed': '10.37',
    'fSDev': '0.00',
    'fVSpeed': '-1.69',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1339.00',
    'fHorChange': '999.00',
    'fHAngle': '39.50',
    'fHSpeed': '9.64',
    'fSDev': '0.00',
    'fVSpeed': '-1.65',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1367.00',
    'fHorChange': '999.00',
    'fHAngle': '36.00',
    'fHSpeed': '8.83',
    'fSDev': '0.00',
    'fVSpeed': '-1.60',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1395.00',
    'fHorChange': '999.00',
    'fHAngle': '32.10',
    'fHSpeed': '7.99',
    'fSDev': '0.00',
    'fVSpeed': '-1.55',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1423.00',
    'fHorChange': '999.00',
    'fHAngle': '27.70',
    'fHSpeed': '7.08',
    'fSDev': '0.00',
    'fVSpeed': '-1.48',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1451.00',
    'fHorChange': '999.00',
    'fHAngle': '22.30',
    'fHSpeed': '6.16',
    'fSDev': '0.00',
    'fVSpeed': '-1.41',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1480.00',
    'fHorChange': '999.00',
    'fHAngle': '15.40',
    'fHSpeed': '5.28',
    'fSDev': '0.00',
    'fVSpeed': '-1.32',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1508.00',
    'fHorChange': '999.00',
    'fHAngle': '5.90',
    'fHSpeed': '4.54',
    'fSDev': '0.00',
    'fVSpeed': '-1.23',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1536.00',
    'fHorChange': '999.00',
    'fHAngle': '353.80',
    'fHSpeed': '4.09',
    'fSDev': '0.00',
    'fVSpeed': '-1.14',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1564.00',
    'fHorChange': '999.00',
    'fHAngle': '340.20',
    'fHSpeed': '3.98',
    'fSDev': '0.00',
    'fVSpeed': '-1.05',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1592.00',
    'fHorChange': '999.00',
    'fHAngle': '328.20',
    'fHSpeed': '4.27',
    'fSDev': '0.00',
    'fVSpeed': '-0.98',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1620.00',
    'fHorChange': '999.00',
    'fHAngle': '319.50',
    'fHSpeed': '4.79',
    'fSDev': '0.00',
    'fVSpeed': '-0.95',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1649.00',
    'fHorChange': '999.00',
    'fHAngle': '314.10',
    'fHSpeed': '5.40',
    'fSDev': '0.00',
    'fVSpeed': '-0.95',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1677.00',
    'fHorChange': '999.00',
    'fHAngle': '311.20',
    'fHSpeed': '5.93',
    'fSDev': '0.00',
    'fVSpeed': '-0.99',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1705.00',
    'fHorChange': '999.00',
    'fHAngle': '309.90',
    'fHSpeed': '6.23',
    'fSDev': '0.00',
    'fVSpeed': '-1.05',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1733.00',
    'fHorChange': '999.00',
    'fHAngle': '310.10',
    'fHSpeed': '6.29',
    'fSDev': '0.00',
    'fVSpeed': '-1.10',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1761.00',
    'fHorChange': '999.00',
    'fHAngle': '311.60',
    'fHSpeed': '6.36',
    'fSDev': '0.00',
    'fVSpeed': '-1.11',
    'fVerChange': '999.00',
    'iBelieveable': '1'
  }, {
    'fHei': '1790.00',
    'fHorChange': '999.00',
    'fHAngle': '311.40',
    'fHSpeed': '6.98',
    'fSDev': '0.00',
    'fVSpeed': '1.11',
    'fVerChange': '999.00',
    'iBelieveable': '0'
  }],
  'timestamp': '1623296282000',
  'type': '风廓线实时数据'
}
