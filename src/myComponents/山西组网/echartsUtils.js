import * as echarts from "echarts";
import 'echarts-liquidfill';
import china from './china.json'
const years = ["2016", "2017", "2018", "2019", "2020"];
let observers = []
let charts = []
export default {
  destroy(){
    for(let i=0;i<observers.length;i++){
      observers[i].disconnect()
      observers.splice(i--,1)
    }
    for(let i=0;i<charts.length;i++){
      charts[i].dispose()
      charts.splice(i--,1)
    }
  },
  // 柱状图 and 折线图结合
  initBarAndLineChart(params) {
    let chart = echarts.init(document.getElementById(params.chartName));
    const option = {
      color: ["#605BFF", "#07B2EF"],
      title: {
        text: "专业设置情况",
        textStyle: {
          color: "#03f7fc",
          fontSize: 14,
        },
      },
      legend: {
        show: true,
        icon: "rect",
        orient: "horizontal",
        top: "30",
        itemGap: 5,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 11,
          color: "#fff",
          padding: [2, 0, 0, 0],
        },
        data: [{ name: "新设" }, { name: "撤销" }],
      },
      tooltip: {
        trigger: "axis",
        textStyle: {
          color: "white",
        },
        position: function (pos, params, dom, rect, size) {
          // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
          var obj = { top: 60 };
          obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
          return obj;
        },
        axisPointer: {
          type: "cross",
        },
        backgroundColor: "rgba(50,50,50,0.5)",
        borderColor: "rgba(0, 0, 0, 0)",
      },
      grid: {
        left: 40,
        right: 35,
        // bottom: 20,
        // top: 35,
        height: "65%",
      },
      xAxis: {
        type: "category",
        data: years,
        axisTick: {
          show: false,
        },
        axisLabel: {
          rotate: "0",
          show: true,
          fontFamily: "Microsoft YaHei",
          fontWeight: "normal",
          fontSize: 10,
          color: "rgba(64, 143, 255, 1)",
          fontStyle: "normal",
          textDecoration: "none",
          verticalAlign: "top",
        },
        axisLine: {
          show: true,
          lineStyle: {
            type: "solid",
            width: 1,
            color: "rgba(64, 143, 255, 1)",
          },
        },
        splitLine: {
          show: false,
        },
        splitArea: {
          show: false,
        },
      },
      yAxis: [
        {
          name: "专业开设数量",
          nameTextStyle: {
            fontFamily: "Microsoft YaHei",
            fontWeight: "normal",
            fontSize: 10,
            color: "rgba(1, 211, 142, 1)",
            fontStyle: "normal",
            textDecoration: "none",
            padding: [20, 10, 0, 0],
          },
          type: "value",
          axisTick: {
            show: false,
          },
          axisLabel: {
            rotate: "0",
            show: true,
            fontFamily: "Microsoft YaHei",
            fontWeight: "normal",
            fontSize: 10,
            color: "rgba(1, 211, 142, 1)",
            fontStyle: "normal",
            textDecoration: "none",
            margin: 4,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "solid",
              width: 1,
              color: "rgba(1, 58, 107, 1)",
            },
          },
          splitArea: {
            show: false,
          },
          splitNumber: 4,
        },
        {
          name: "专业开设数量",
          nameTextStyle: {
            fontFamily: "Microsoft YaHei",
            fontWeight: "normal",
            fontSize: 10,
            color: "rgba(64, 143, 255, 1)",
            fontStyle: "normal",
            textDecoration: "none",
            padding: [-20, 0, 0, 0],
          },
          type: "value",
          axisTick: {
            show: false,
          },
          axisLabel: {
            rotate: "0",
            show: true,
            fontFamily: "Microsoft YaHei",
            fontWeight: "normal",
            fontSize: 10,
            color: "rgba(64, 143, 255, 1)",
            fontStyle: "normal",
            textDecoration: "none",
            margin: 4,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "solid",
              width: 1,
              color: "rgba(1, 58, 107, 1)",
            },
          },
          splitArea: {
            show: false,
          },
          splitNumber: 4,
        },
      ],
      series: [
        {
          type: "line",
          yAxisIndex: 0,
          data: params.data.majorNum,
          name: "专业开设数量",
          symbol: "circle",
          symbolSize: 5,
          yAxisIndex: 0,
          itemStyle: {
            color: "rgba(1, 211, 142, 1)",
            borderColor: "#fff",
            borderWidth: 2,
          },
          lineStyle: {
            width: 1,
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(1, 211, 142, 0.3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(0,202,149,0)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(1, 211, 142, 0.9)",
              shadowBlur: 20,
            },
          },
        },
        {
          type: "bar",
          yAxisIndex: 1,
          name: "新设",
          barWidth: 7,
          data: params.data.majorNew,
        },
        {
          type: "bar",
          yAxisIndex: 1,
          name: "撤销",
          barWidth: 7,
          data: params.data.majorRevoke,
        },
      ],
    };
    chart.setOption(option);
    let observer = new ResizeObserver(()=>{
      chart.resize()
    })
    observer.observe(document.getElementById(params.chartName))
    observers.push(observer)
    charts.push(chart)

  },
  // 柱状图 or 线图 （x时间）
  initLineOrBarChart(params) {
    let chart = echarts.init(document.getElementById(params.chartName));
    const option = {
      title: {
        text: params.title,
        textStyle: {
          color: "#03f7fc",
          fontSize: 14,
        },
      },
      tooltip: {
        axisPointer: {
          type: "shadow",
          textStyle: {
            color: "#fff",
          },
        },
      },
      grid: {
        left: 30,
        right: 10,
        bottom: 20,
        top: 70,
        height: "50%",
        // width: "100%",
      },
      xAxis: {
        type: "category",
        data: years,
        axisTick: {
          show: false,
        },
        axisLabel: {
          rotate: "0",
          show: true,
          fontFamily: "Microsoft YaHei",
          fontWeight: "normal",
          fontSize: 10,
          color: "rgba(64, 143, 255, 1)",
          fontStyle: "normal",
          textDecoration: "none",
          verticalAlign: "top",
        },
        axisLine: {
          show: true,
          lineStyle: {
            type: "solid",
            width: 1,
            color: "rgba(64, 143, 255, 1)",
          },
        },
        splitLine: {
          show: false,
        },
        splitArea: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        name: params.unit,
        nameTextStyle: {
          fontFamily: "Microsoft YaHei",
          fontWeight: "normal",
          fontSize: 10,
          color: "rgba(64, 143, 255, 1)",
          fontStyle: "normal",
          textDecoration: "none",
          padding: [20, 20, 0, 0],
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          fontSize: 10,
          verticalAlign: "middle",
          color: "rgba(64, 143, 255, 1)",
          padding: [0, 0, 5, 0],
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "solid",
            width: 1,
            color: "rgba(1, 58, 107, 1)",
          },
        },
      },
    };
    if (params.type == "bar") {
      option.series = [
        {
          type: "bar",
          data: params.data.d1,
          barWidth: 10,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0.6,
                  color: "rgba(22, 228, 248, 1)",
                },
                {
                  offset: 1,
                  color: "rgba(49, 75, 204, 1)",
                },
              ]),
              barBorderRadius: [3, 3, 0, 0],
            },
          },
        },
      ];
    } else {
      option.series = [
        {
          type: "line",
          data: params.data.d1,
          symbol: "circle",
          symbolSize: 5,
          yAxisIndex: 0,
          itemStyle: {
            color: params.color[0],
            color: "rgba(0, 187, 255, 1)",
            borderColor: "#fff",
            borderWidth: 2,
          },
          lineStyle: {
            width: 1,
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: params.color[1],
                  },
                  {
                    offset: 1,
                    color: "rgba(0,202,149,0)",
                  },
                ],
                false
              ),
              shadowColor: params.color[2],
              shadowBlur: 20,
            },
          },
        },
      ];
    }
    chart.setOption(option);
    let observer = new ResizeObserver(()=>{
      chart.resize()
    })
    observer.observe(document.getElementById(params.chartName))
    observers.push(observer)
    charts.push(chart)
  },
  // 单柱状图 （x名称）
  initBarChart(params) {
    const keys = params.data ? params.data.map((item) => item.name) : "";
    const values = params.data ? params.data.map((item) => item.value) : "";
    let chart = echarts.init(document.getElementById(params.chartName));
    const option = {
      title: {
        text: params.title,
        textStyle: {
          color: "#03f7fc",
          fontSize: 14,
        },
      },
      tooltip: {
        axisPointer: {
          type: "shadow",
          textStyle: {
            color: "#fff",
          },
        },
      },
      grid: {
        left: 50,
        right: 10,
        bottom: 20,
        top: 50,
        // height: '70%'
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          axisLine: {
            show: true,
            lineStyle: {
              type: "solid",
              width: 1,
              color: "rgba(64, 143, 255, 1)",
            },
          },
          axisLabel: {
            interval: 0,
            fontSize: 10,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          splitArea: {
            show: false,
          },
          data: keys,
        },
      ],
      yAxis: [
        {
          name: params.yAxisName,
          nameTextStyle: {
            fontFamily: "Microsoft YaHei",
            fontWeight: "normal",
            fontSize: 10,
            color: "rgba(64, 143, 255, 1)",
            fontStyle: "normal",
            textDecoration: "none",
            padding: [20, 20, 0, 0],
          },
          type: "value",
          axisLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 12,
            verticalAlign: "middle",
            color: "rgba(64, 143, 255, 1)",
            padding: [0, 0, 5, 0],
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "solid",
              width: 1,
              color: "rgba(1, 58, 107, 1)",
            },
          },
        },
      ],
      series: [
        {
          name: params.seriesName,
          type: "bar",
          barWidth: 8,
          barGap: "-123%",
          itemStyle: {
            barBorderRadius: [3, 3, 0, 0],
          },
          data: values,
        },
      ],
      color: [params.color],
    };
    chart.setOption(option);
    let observer = new ResizeObserver(()=>{
      chart.resize()
    })
    observer.observe(document.getElementById(params.chartName))
    observers.push(observer)
    charts.push(chart)
  },

  // 堆叠柱状图
  initStackBarChart(params) {
    let chart = echarts.init(document.getElementById(params.chartName));
    const option = {
      title: {
        text: params.title,
        textStyle: {
          color: "#03f7fc",
          fontSize: 14,
        },
      },
      legend: {
        show: true,
        icon: "rect",
        orient: "vertical",
        left: "50%",
        top: "10%",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 10,
          color: "#fff",
        },
      },
      grid: {
        left: 40,
        right: 10,
        bottom: 20,
        top: 50,
        height: "60%",
      },
      tooltip: {
        confine: true,
        textStyle: {
          color: "white",
        },
        axisPointer: {
          type: "shadow",
          textStyle: {
            color: "#fff",
          },
        },
        backgroundColor: "rgba(50,50,50,0.5)",
        borderColor: "rgba(0, 0, 0, 0)",
      },
      xAxis: {
        type: "category",
        data: years,
        axisLine: {
          show: true,
          lineStyle: {
            type: "solid",
            width: 1,
            color: "rgba(64, 143, 255, 1)",
          },
        },
        axisLabel: {
          fontSize: 10,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        splitArea: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        name: params.unit, //单位
        splitNumber: 3,
        // max: 2000,
        nameTextStyle: {
          fontFamily: "Microsoft YaHei",
          fontWeight: "normal",
          fontSize: 10,
          color: "rgba(64, 143, 255, 1)",
          fontStyle: "normal",
          textDecoration: "none",
          padding: [20, 20, 0, 0],
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          fontSize: 10,
          color: "rgba(64, 143, 255, 1)",
          padding: [0, 0, 2, 0],
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "solid",
            width: 1,
            color: "rgba(1, 58, 107, 1)",
          },
        },
      },
      calculable: true,
      series: [
        {
          type: "bar",
          stack: "收入",
          name: params.name1,
          data: params.data.d1,
          barWidth: 10,
          itemStyle: {
            color: "rgba(95, 69, 255, 1)",
          },
        },
        {
          type: "bar",
          stack: "收入",
          data: params.data.d2,
          name: params.name2,
          barWidth: 10,
          itemStyle: {
            color: "rgba(22, 228, 248, 1)",
            barBorderRadius: [3, 3, 0, 0],
          },
        },
      ],
    };
    chart.setOption(option);
    let observer = new ResizeObserver(()=>{
      chart.resize()
    })
    observer.observe(document.getElementById(params.chartName))
    observers.push(observer)
    charts.push(chart)
  },

  // 双柱图 or 双折线图
  initDoubleLineOrBarChart(params) {
    let chart = echarts.init(document.getElementById(params.chartName));
    const option = {
      title: {
        text: params.title,
        textStyle: {
          color: "#03f7fc",
          fontSize: 14,
        },
      },
      legend: {
        show: params.legendShow,
        icon: "rect",
        orient: "vertical",
        right: "0%",
        top: "6%",
        itemGap: 2,
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          fontSize: 11,
          color: "#fff",
        },
      },
      grid: params.grid
        ? params.grid
        : {
            left: 30,
            right: 30,
            bottom: 20,
            top: 50,
            height: "60%",
          },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      xAxis: {
        type: "category",
        data: years,
        axisLine: {
          show: true,
          lineStyle: {
            type: "solid",
            width: 1,
            color: "rgba(64, 143, 255, 1)",
          },
        },
        axisLabel: {
          fontSize: 10,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        splitArea: {
          show: false,
        },
      },
      yAxis: [
        {
          type: "value",
          name: params.yName1 ? params.yName1 : "",
          splitNumber: 3,
          nameTextStyle: {
            fontFamily: "Microsoft YaHei",
            fontWeight: "normal",
            fontSize: 10,
            color: "rgba(64, 143, 255, 1)",
            fontStyle: "normal",
            textDecoration: "none",
            padding: params.yAxisNamePd ? params.yAxisNamePd : [-20, 20, 0, 0],
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            rotate: "0",
            show: true,
            fontFamily: "Microsoft YaHei",
            fontWeight: "normal",
            fontSize: 10,
            color: "rgba(64, 143, 255, 1)",
            fontStyle: "normal",
            textDecoration: "none",
            margin: 4,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "solid",
              width: 1,
              color: "rgba(1, 58, 107, 1)",
            },
          },
          splitArea: {
            show: false,
          },
        },
        {
          type: "value",
          name: params.yName2 ? params.yName2 : "",
          splitNumber: 4,
          axisTick: {
            show: false,
          },
          nameTextStyle: {
            fontFamily: "Microsoft YaHei",
            fontWeight: "normal",
            fontSize: 10,
            color: "rgba(1, 211, 142, 1)",
            fontStyle: "normal",
            textDecoration: "none",
            padding: [20, 30, 0, 0],
          },
          axisLabel: {
            rotate: "0",
            show: true,
            fontFamily: "Microsoft YaHei",
            fontWeight: "normal",
            fontSize: 10,
            color: "rgba(1, 211, 142, 1)",
            fontStyle: "normal",
            textDecoration: "none",
            margin: 4,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "solid",
              width: 1,
              color: "rgba(1, 58, 107, 1)",
            },
          },
          splitArea: {
            show: false,
          },
        },
      ],
    };
    if (params.type == "bar") {
      option.series = [
        {
          type: "bar",
          yAxisIndex: 0,
          barWidth: 7,
          data: params.data.d1,
          name: params.seriesName1 ? params.seriesName1 : "",
          itemStyle: {
            color: params.color1 ? params.color1 : "#605BFF",
          },
        },
        {
          type: "bar",
          yAxisIndex: params.yAxisIndex ? params.yAxisIndex : 0,
          barWidth: 7,
          data: params.data.d2,
          name: params.seriesName2 ? params.seriesName2 : "",
          itemStyle: {
            color: params.color2 ? params.color2 : "#07B2EF",
          },
        },
      ];
    } else {
      if (params.line === 3) {
        option.series = [
          {
            type: "line",
            name: params.seriesName1 ? params.seriesName1 : "",
            data: params.data.d1,
            type: "line",
            symbol: "circle",
            symbolSize: 5,
            yAxisIndex: 0,
            itemStyle: {
              color: "rgba(1, 211, 142, 1)",
              borderColor: "#fff",
              borderWidth: 2,
            },
            lineStyle: {
              width: 1,
            },
            areaStyle: {
              normal: {
                color: echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(1, 211, 142, 0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(0,202,149,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(1, 211, 142, 0.9)",
                shadowBlur: 20,
              },
            },
          },
          {
            type: "line",
            name: params.seriesName2 ? params.seriesName2 : "",
            data: params.data.d2,
            symbol: "circle",
            symbolSize: 5,
            yAxisIndex: params.yAxisIndex ? params.yAxisIndex : 0,
            itemStyle: {
              color: "rgba(0, 187, 255, 1)",
              borderColor: "#fff",
              borderWidth: 2,
            },
            lineStyle: {
              width: 1,
            },
            areaStyle: {
              normal: {
                color: echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 187, 255, 0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(0,202,149,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(0, 187, 255, 0.9)",
                shadowBlur: 20,
              },
            },
          },
          {
            name: params.seriesName3 ? params.seriesName3 : "",
            type: "line",
            symbol: "circle",
            symbolSize: 5,
            yAxisIndex: 0,
            itemStyle: {
              color: "#1BC85E",
              borderColor: "#fff",
              borderWidth: 2,
            },
            lineStyle: {
              width: 1,
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(1, 211, 142, 0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(0,202,149,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(1, 211, 142, 0.9)",
                shadowBlur: 20,
              },
            },
            data: params.data.d3,
          },
        ];
      } else {
        option.series = [
          {
            type: "line",
            name: params.seriesName1 ? params.seriesName1 : "",
            data: params.data.d1,
            type: "line",
            symbol: "circle",
            symbolSize: 5,
            yAxisIndex: 0,
            itemStyle: {
              color: "rgba(1, 211, 142, 1)",
              borderColor: "#fff",
              borderWidth: 2,
            },
            lineStyle: {
              width: 1,
            },
            areaStyle: {
              normal: {
                color: echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(1, 211, 142, 0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(0,202,149,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(1, 211, 142, 0.9)",
                shadowBlur: 20,
              },
            },
          },
          {
            type: "line",
            name: params.seriesName2 ? params.seriesName2 : "",
            data: params.data.d2,
            symbol: "circle",
            symbolSize: 5,
            yAxisIndex: params.yAxisIndex ? params.yAxisIndex : 0,
            itemStyle: {
              color: "rgba(0, 187, 255, 1)",
              borderColor: "#fff",
              borderWidth: 2,
            },
            lineStyle: {
              width: 1,
            },
            areaStyle: {
              normal: {
                color: echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 187, 255, 0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(0,202,149,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(0, 187, 255, 0.9)",
                shadowBlur: 20,
              },
            },
          },
        ];
      }
    }
    chart.setOption(option);
    let observer = new ResizeObserver(()=>{
      chart.resize()
    })
    observer.observe(document.getElementById(params.chartName))
    observers.push(observer)
    charts.push(chart)
  },
  // 条形图复合框
  initCompositeBarChart(params) {
    let nameArr = [];
    let valueArr = [];
    let borderArr = [];
    for (let i = 0; i < params.data.length; i++) {
      nameArr.push(params.data[i].name);
      valueArr.push(parseInt(params.data[i].value));
      params.border ? borderArr.push(480) : borderArr.push(100);
      // borderArr.push(480);
    }
    let chart = echarts.init(document.getElementById(params.chartName));
    const option = {
      title: {
        text: params.title,
        textStyle: {
          color: "#03f7fc",
          fontSize: 14,
        },
      },
      grid: {
        height: "85%",
        top: "15%",
        left: "0%",
      },
      xAxis: [
        {
          type: "value",
          show: false,
        },
        {
          type: "value",
          show: false,
        },
      ],
      dataZoom: [
        {
          width: 8,
          orient: "vertical",
          yAxisIndex: 0,
          show: params.data.length > 3,
          showDetail: false,
          type: "slider",
          startValue: 0,
          endValue: 3,
          borderColor: "rgba(0, 0, 0, 0)",
          zoomLock: true,
          right: 0,
        },
      ],
      yAxis: {
        type: "category",
        inverse: true,
        nameGap: 16,
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          // 值
          type: "bar",
          barWidth: 10,
          data: valueArr,
          z: 2,
          silent: true,
          itemStyle: {
            normal: {
              // barBorderRadius: 16,
              color: {
                type: "bar",
                colorStops: [
                  {
                    offset: 0,
                    color: "#314BCC", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#13F5FD", // 100% 处的颜色
                  },
                ],
                globalCoord: false, // 缺省为 false
              },
            },
          },
          label: {
            show: true,
            position: [180, -20],
            textStyle: {
              color: "#DEDEDE",
              fontSize: 13,
              // lineHeight: -20,
            },
          },
        },
        {
          //框
          type: "bar",
          name: "柱子",
          data: borderArr,
          itemStyle: {
            borderColor: "#183F60",
            borderWidth: 1,
            // barBorderRadius: 15,
            color: "rgba(102, 102, 102,0)",
          },
          z: 0,
          barWidth: 20,
        },
        {
          type: "bar",
          data: params.data,
          xAxisIndex: 1,
          barGap: "-150%",
          itemStyle: {
            barBorderRadius: 0,
            color: "transparent",
          },
          label: {
            show: true,
            position: [0, "-2"],
            textStyle: {
              fontSize: 13,
              color: "#fff",
              //   lineHeight: 0,
            },
            formatter: function (data) {
              var result = `${data.dataIndex + 1}.`;
              //   console.log(data);
              result += data.name;
              //   console.log(result);
              return result;
            },
          },
        },
      ],
    };
    chart.setOption(option);
    let observer = new ResizeObserver(()=>{
      chart.resize()
    })
    observer.observe(document.getElementById(params.chartName))
    observers.push(observer)
    charts.push(chart)
  },

  // 条形图
  initBarTypeChart(params) {
    // console.log(params.data);
    let nationalName = [];
    let nationalValue = [];
    params.data.d1.map((item) => {
      nationalName.push(
        item.name.replace(
          /省|市|自治区|特别行政区|壮族自治区|维吾尔自治区|回族自治区/g,
          ""
        )
      );
      nationalValue.push(item.value);
    });
    // console.log(nationalName);
    // console.log(nationalValue);
    let chart = echarts.init(document.getElementById(params.chartName));
    const option = {
      title: {
        text: params.title,
        textStyle: {
          color: "#03f7fc",
          fontSize: 14,
        },
        left: "0%",
      },
      legend: {
        show: true,
        icon: "rect",
        orient: "horizontal",
        right: "0%",
        itemWidth: 10,
        itemHeight: 10,
        top: "10%",
        textStyle: {
          fontSize: 11,
          color: "#fff",
        },
      },
      dataZoom: [
        {
          width: 8,
          orient: "vertical",
          yAxisIndex: 0,
          show: params.data.d1.length > 4,
          showDetail: false,
          type: "slider",
          startValue: 0,
          // fillerColor: "rgba(0, 0, 0, 0)",
          endValue: 4,
          borderColor: "rgba(0, 0, 0, 0)",
          zoomLock: true,
          // bottom: "1%",
          right: params.dataZoomRight ? params.dataZoomRight : 0,
        },
      ],
      grid: params.grid
        ? params.grid
        : {
            left: 50,
            right: 30,
            top: 35,
            bottom: 20,
          },
      tooltip: {
        trigger: "item",
        textStyle: {
          color: "white",
        },
        backgroundColor: "rgba(50,50,50,0.5)",
        borderColor: "rgba(0, 0, 0, 0)",
      },
      xAxis: {
        type: "value",
        name: params.xAxisName ? params.xAxisName : "",
        nameLocation: "start",
        nameTextStyle: {
          // align: "left",
          fontFamily: "Microsoft YaHei",
          fontWeight: "normal",
          fontSize: 10,
          color: "rgba(64, 143, 255, 1)",
          fontStyle: "normal",
          textDecoration: "none",
          padding: [-20, -5, 0, 0],
        },
        axisLabel: {
          rotate: "0",
          show: true,
          fontFamily: "Microsoft YaHei",
          lineHeight: 0,
          fontWeight: "normal",
          fontSize: 10,
          color: "rgba(64, 143, 255, 1)",
          fontStyle: "normal",
          textDecoration: "none",
          interval: 0,
        },
        axisLine: {
          show: true,
          lineStyle: {
            type: "solid",
            width: 1,
            color: "rgba(64, 143, 255, 1)",
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        splitArea: {
          show: false,
        },
        position: "top",
        splitNumber: 2,
      },
      yAxis: {
        type: "category",
        // name: "(万人)",
        inverse: true,
        data: nationalName,
        nameLocation: "start",
        // gridIndex: i,
        nameTextStyle: {
          fontFamily: "Microsoft YaHei",
          fontWeight: "normal",
          fontSize: 10,
          color: "rgba(64, 143, 255, 1)",
          fontStyle: "normal",
          textDecoration: "none",
          padding: [20, 20, 0, 0],
        },
        axisLine: {
          show: true,
          lineStyle: {
            type: "solid",
            width: 1,
            color: "rgba(64, 143, 255, 1)",
          },
        },
        axisLabel: {
          rotate: "0",
          show: true,
          interval: 0,
          fontFamily: "Microsoft YaHei",
          fontWeight: "normal",
          fontSize: 12,
          color: "#FFF",
          fontStyle: "normal",
          textDecoration: "none",
          width: 20,
          formatter: function (params) {
            let newParamsName = "";
            const paramsNameNumber = params.length;
            const provideNumber = 10; // 一行显示几个字
            const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            if (paramsNameNumber > provideNumber) {
              for (let p = 0; p < rowNumber; p++) {
                let tempStr = "";
                const start = p * provideNumber;
                const end = start + provideNumber;
                if (p === rowNumber - 1) {
                  tempStr = params.substring(start, paramsNameNumber);
                } else {
                  tempStr = params.substring(start, end) + "\n";
                }
                newParamsName += tempStr;
              }
            } else {
              newParamsName = params;
            }
            return newParamsName;
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        splitArea: {
          show: false,
        },
      },
      series: [],
      color: ["#605BFF", "#07B2EF"],
    };
    if (params.data.d2) {
      option.series = [
        {
          type: "bar",
          barWidth: 7,
          name: params.xAxisName1 ? params.xAxisName1 : "",
          data: params.data.d1,
        },
        {
          type: "bar",
          barWidth: 7,
          name: params.xAxisName2 ? params.xAxisName2 : "",

          data: params.data.d2,
        },
      ];
    } else {
      option.series = [
        {
          type: "bar",
          barWidth: 8,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  offset: 0.6,
                  color: "rgba(22, 228, 248, 1)",
                },
                {
                  offset: 1,
                  color: "rgba(49, 75, 204, 1)",
                },
              ]),
              barBorderRadius: [0, 5, 5, 0],
            },
          },
          data: params.data.d1,
        },
      ];
    }
    chart.setOption(option);
    let observer = new ResizeObserver(()=>{
      chart.resize()
    })
    observer.observe(document.getElementById(params.chartName))
    observers.push(observer)
    charts.push(chart)
  },
  // 水球图
  initLiquidfill(params) {
    // console.log(params.data.d1[1]);
    // const data = [parseFloat(params.data.d1[i].replace("%", "")) / 100];
    let chart = echarts.init(document.getElementById(params.chartName));
    const option = {
      title: [],
      xAxis: {
        show: false,
      },
      yAxis: {
        show: false,
      },
      series: [],
    };
    for (let i = 0; i < 5; i++) {
      option.title.push({
        text: params.title[i],
        textStyle: {
          color: "white",
          fontSize: 11,
        },
        left: params.position[i][0],
        top: "60%",
        subtext: params.data.subtitle[i] + "人",
        subtextStyle: {
          color: "#f39800",
          fontSize: 15,
        },
      });
      option.series.push(
        {
          type: "liquidFill",
          data: [parseFloat(params.data.d1[i].replace("%", "")) / 100],
          radius: "45%",
          center: params.center[i],
          outline: {
            show: false,
          },
          color: [
            {
              colorStops: [
                {
                  //填充区渐变色
                  offset: 0,
                  color: "#8E6AF4",
                },
                {
                  offset: 1,
                  color: "#2A3DB3",
                },
              ],
            },
          ],
          label: {
            fontSize: 18,
          },
          backgroundStyle: {
            color: "rgb(255,255, 255, 0)",
          },
        },
        {
          name: "小环",
          type: "gauge",
          splitNumber: 15,
          radius: "90%",
          center: params.center[i],
          startAngle: 90,
          endAngle: -269.9999,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: "#6959DC",
              width: 1,
            },
            length: 3,
            splitNumber: 5,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          detail: {
            show: false,
          },
        }
      );
    }
    chart.setOption(option);
    let observer = new ResizeObserver(()=>{
      chart.resize()
    })
    observer.observe(document.getElementById(params.chartName))
    observers.push(observer)
    charts.push(chart)
  },
  initRadarChart(params){
    let chart = echarts.init(document.getElementById(params.chartName));
    const preValue = [
      params.data[0].xxpp,
      params.data[0].trtj,
      params.data[0].zyah,
      params.data[0].jnpx,
      params.data[0].dlwz,
    ];
    const twValue = [
      params.data[1].xxpp,
      params.data[1].trtj,
      params.data[1].zyah,
      params.data[1].jnpx,
      params.data[1].dlwz,
    ];
    const option = {
      title: {
        text: params.title,
        textStyle: {
          color: "#03f7fc",
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: "item",
        textStyle: {
          color: "white",
        },
        backgroundColor: "rgba(50,50,50,0.5)",
        borderColor: "rgba(0, 0, 0, 0)",
      },
      legend: {
        show: true,
        right: 30,
        top: 20,
        orient: "vertical",
        itemWidth: 11,
        itemHeight: 11,
        textStyle: {
          fontSize: 10,
          color: "#fff",
        },
      },
      radar: {
        name: {
          textStyle: {
            color: "rgba(64, 143, 255, 1)",
            // borderRadius: 3,
            // padding: [3, 5]
            fontSize: 12,
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(64, 143, 255, 1)",
            width: 0.5,
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(64, 143, 255, 1)",
            width: 0.5,
          },
        },
        splitArea: {
          show: false,
        },
        nameGap: 10,
        indicator: [
          { text: "学校品牌", max: 30 },
          { text: "他人推荐", max: 30 },
          { text: "专业爱好", max: 30 },
          { text: "技能培养", max: 30 },
          { text: "地理位置", max: 30 },
        ],
        center: ["48%", "60%"],
        radius: "65%",
      },
      series: [
        {
          type: "radar",
          areaStyle: {
            opacity: 0.5,
          },
          data: [
            {
              value: preValue,
              name: "历年平均",
            },
            {
              value: twValue,
              name: "2020年",
            },
          ],
          color: ["rgba(19, 230, 237, 1)", "rgba(153, 127, 255, 1)"],
        },
      ],
    };
    chart.setOption(option);
    let observer = new ResizeObserver(()=>{
      chart.resize()
    })
    observer.observe(document.getElementById(params.chartName))
    observers.push(observer)
    charts.push(chart)
  },
  initBarAndPieChart(params) {
    let chart = echarts.init(document.getElementById(params.chartName));
    const option = {
      title: [
        {
          text: params.title,
          textStyle: {
            color: "#03f7fc",
            fontSize: 14,
          },
        },
        {
          text: params.title,
          textStyle: {
            color: "rgba(64, 143, 255, 1)",
            fontSize: 11,
          },
          top: "85%",
          left: "center",
        },
      ],
      tooltip: {
        trigger: "item",
        formatter: "{c}%",
      },
      polar: {
        radius: "100%",
        center: ["50%", "50%"],
      },
      radiusAxis: {
        nameLocation: "end",
        nameGap: {
          val: 15,
          isPx: true,
        },
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        splitArea: {
          show: false,
        },
        type: "category",
        show: true,
        axisTick: {
          show: false,
        },
      },
      angleAxis: {
        axisLine: {
          show: true,
          lineStyle: {
            type: "solid",
            width: 1,
            color: "#999",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "solid",
            width: 1,
            color: "#eeeeee",
          },
        },
        splitArea: {
          show: false,
        },
        max: 100,
        show: false,
      },
      legend: {
        show: false,
      },
      series: [
        {
          name: "",
          type: "bar",
          roundCap: true,
          barWidth: 3,
          showBackground: true,
          backgroundColor: "rgba(76, 255, 208, 0.3)",
          coordinateSystem: "polar",
          itemStyle: {
            color: "rgba(76, 255, 208, 1)",
            barBorderRadius: 2,
          },
          label: {
            show: false,
            color: "#fff",
          },
          data: [params.data],
        },
        {
          name: "",
          type: "pie",
          radius: ["40%", "45%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          tooltip: {
            show: false,
          },
          label: {
            show: false,
          },
          emphasis: {
            show: false,
            label: {
              show: true,
              fontSize: "30",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            borderWidth: 0,
            color: "rgba(21, 53, 60, 0.7)",
          },
          data: [
            {
              value: 1,
              name: "",
            },
          ],
        },
        {
          name: "",
          type: "pie",
          radius: ["30%", "35%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          tooltip: {
            show: false,
          },
          label: {
            show: false,
          },
          emphasis: {
            show: false,
            label: {
              show: true,
              fontSize: "30",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            borderWidth: 0,
            color: "rgba(21, 53, 60, 0.7)",
          },
          data: [
            {
              value: 1,
              name: "",
            },
          ],
        },
      ],
    };
    option.title.push({
      text: params.data + "%",
      textStyle: {
        color: "#ABE8F3",
        fontSize: 15,
      },
      left: "center",
      top: "42%",
    });
    chart.setOption(option);
    let observer = new ResizeObserver(()=>{
      chart.resize()
    })
    observer.observe(document.getElementById(params.chartName))
    observers.push(observer)
    charts.push(chart)
  },
  initMapChart(params) {
    let chart = echarts.init(document.getElementById(params.chartName));
    echarts.registerMap("china", china);
    let geoCoordMap = {};
    let allData = [];
    let scatterData = [];
    // let tooltipData = [];
    china["features"].forEach((e) => {
      geoCoordMap[e.properties.name] = e.properties.cp;
    });
    var convertData = function (data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            ...data[i],
            value: geoCoord.concat(data[i].value),
          });
        }
      }
      return res;
    };
    params.data.map((item, index) => {
      allData.push({
        ...item,
        name: item.name.replace(
          /省|市|自治区|特别行政区|壮族自治区|维吾尔自治区|回族自治区/g,
          ""
        ),
        value: item.gnum,
      });
      // tooltipData.push({
      //   name: item.name.replace(
      //     /省|市|自治区|特别行政区|壮族自治区|维吾尔自治区|回族自治区/g,
      //     ""
      //   ),
      //   value: [
      //     {
      //       name: item.name.replace(
      //         /省|市|自治区|特别行政区|壮族自治区|维吾尔自治区|回族自治区/g,
      //         ""
      //       ),
      //       value: item.gnum,
      //     },
      //   ],
      // });
    });
    // scatterData = allData.slice(0, 8);
    scatterData = allData.slice();
    console.log(allData);
    // 地图点击跳转省份
    chart.on("click", (param) => {
      if (param.name) {
        // this.$router.push({
        //   path: "/province",
        //   query: { province: param.name },
        // });
      }
    });
    const option = {
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(50,50,50,0.5)",
        textStyle: {
          color: "white",
        },
        formatter: function (params) {
          // console.log(params);
          const toolTiphtml = `${params.name}</br>
            区域高职院校数量: <span style="color: #13F5FD;">${params.data.gnum}</span></br>
            区域"双高"院校数量: <span style="color: #13F5FD;">${params.data.snum}</span></br>
            区域生师比: <span style="color: #13F5FD;">${params.data.ssb} : 1</span></br>
            区域生均图书量（册）: <span style="color: #13F5FD;">${params.data.tsl}</span></br>
            区域生均设备总额（元）: <span style="color: #13F5FD;">${params.data.ze}</span></br>
            区域生均建筑面积（㎡）: <span style="color: #13F5FD;">${params.data.mj}</span></br>
            区域每百名学生计算机数（台）: <span style="color: #13F5FD;">${params.data.jsj}</span></br>
            `;
          return toolTiphtml;
        },
      },
      // visualMap: {
      //   show: false, // 隐藏筛选大小手柄
      //   min: 0,
      //   max: 2000,
      //   left: "left",
      //   top: "bottom",
      //   text: ["高", "低"], // 文本，默认为数值文本
      //   calculable: true,
      //   seriesIndex: [1],
      //   inRange: {
      //     color: ["rgba(0,134,255,0)", "#0072d4"],
      //   },
      // },
      geo: {
        map: "china",
        roam: true,
        itemStyle: {
          normal: {
            areaColor: "rgba(0,134,255,0.0)",
            borderColor: "#92e9f7",
            shadowBlur: 20,
            shadowColor: "rgba(147, 235, 248, .8)",
          },
          emphasis: {
            areaColor: "#f9c242", //鼠标移入
          },
        },
        select:{
          label:{
            show:false
          }
        },
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          },
        },
      },
      series: [
        {
          type: "map",
          geoIndex: 0,
          data: allData,
          aspectScale: 0.75, //长宽比
          showLegendSymbol: true, // 存在legend时显示'
          itemStyle: {
            normal: {
              areaColor: "#031525",
              borderColor: "#3B5077",
            },
            emphasis: {
              areaColor: "#2B91B7",
            },
          },
          label: {
            normal: {
              show: true,
            },
            emphasis: {
              show: false,
              textStyle: {
                color: "#fff",
              },
            },
          },
        },
        {
          name: "Top 10",
          type: "effectScatter",
          coordinateSystem: "geo",
          symbolSize: 10,
          showEffectOn: "render",
          rippleEffect: {
            brushType: "stroke",
          },
          hoverAnimation: true,
          label: {
            formatter: "{b}",
            position: "right",
            show: true,
            color: "white",
          },
          itemStyle: {
            normal: {
              color: "#00ebf7",
              shadowBlur: 6,
              shadowColor: "#3eaff",
            },
          },
          // zlevel: 3,
          geoIndex: 0,
          data: convertData(scatterData),
        },
      ],
    };
    chart.setOption(option);
    let observer = new ResizeObserver(()=>{
      chart.resize()
    })
    observer.observe(document.getElementById(params.chartName))
    observers.push(observer)
    charts.push(chart)
  },
};
