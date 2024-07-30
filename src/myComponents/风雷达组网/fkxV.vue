<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column">
    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <div style="font-size: 20px; color: rgb(78, 129, 184)">风廓线</div>
      <div style="color: grey">{{ currentTime }}</div>
    </div>
    <div ref="fkxContainer" class="w-full flex-1 h-full"></div>
  </div>
</template>
<script lang="ts" setup>
let radar_id = location.href.substring(location.href.lastIndexOf('/')+1,location.href.length)
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import DBS from "~/tools/fkxV.js";
import { isDark } from "~/composables";
import { useBus } from "~/myComponents/bus";
const bus = useBus();
const fkxContainer = ref(null);
import { eventbus } from "~/eventbus";
watch(isDark, (isDark) => {
  if (dbs) {
    dbs.destroy();
  }
  setDBS(isDark);
});
let dbs: DBS;
onMounted(() => {
  setDBS(isDark.value);
  eventbus.on("处理风廓线数据"+radar_id, 处理风廓线数据);
});
const currentTime = ref("");
let timer: number;
import moment from "moment";
import {View} from '~/tools/index'
const encoder = new TextEncoder()
const decoder = new TextDecoder()
let opts:Array<any> = []
const 处理风廓线数据 = (data: any, type1: string, diejia: string, type2: string) => {
  opts=[data,type1,diejia,type2]
  dbs && dbs.clear();
  if (data) {
    /*level2
    let result:{[key:string]:any} = {}
    const view = new View(encoder.encode(data).buffer)
    let firstLine = decoder.decode(view.getLine()).trim().replace(RegExp(/,$/g),'')
    result.HeaderInfo = {}
    firstLine.split(',').map((str:string)=>{
      let item = str.split(':')
      if(item.length==2){
        result.HeaderInfo[item[0]]=item[1]
      }
    })
    let secondLine = decoder.decode(view.getLine()).trim().replace(RegExp(/,$/g),'')
    result.radials = []
    while(!view.reachEnd()){
      let item:{[key:string]:any} = {}
      let thirdLine = decoder.decode(view.getLine()).trim().replace(RegExp(/,$/g),'')
      for(let i=0;i<12;i++){
        item[secondLine.split(',')[i]] = thirdLine.split(',')[i]
      }
      item.list = []
      for(let i=12;i<thirdLine.split(',').length;i+=4){
        let lib = thirdLine.split(',')
        let distance = Number(secondLine.split(',')[i+0].split(' ')[0].substring(0,secondLine.split(',')[i+0].split(' ')[0].length-1))
        item.list.push({
          distance,
          [secondLine.split(',')[i+0].split(' ')[1]]:Number(lib[i+0]),
          [secondLine.split(',')[i+1].split(' ')[1]]:Number(lib[i+1]),
          [secondLine.split(',')[i+2].split(' ')[1]]:Number(lib[i+2]),
          [secondLine.split(',')[i+3].split(' ')[1]]:Number(lib[i+3]),
        })
      }
      result.radials.push(item)
    }
    console.log(result)*/

    /* level3 */
    let view:View|null = new View(encoder.encode(data).buffer)
    let result:{[key:string]:any} = {HeaderInfo:{},radials:[]}
    let firstLine = decoder.decode(view.getLine()).replace(/,\r\n$/,'').split(',')
    for(let i=1;i<firstLine.length;i++){
      let item = firstLine[i].split(':')
      if(item.length==2){
        result.HeaderInfo[item[0]] = item[1]
      }
    }
    let secondLine = decoder.decode(view.getLine()).replace(/,\r\n$/,'').split(',')
    while(!view.reachEnd()){
      let radial:{[key:string]:any} = {list:[]}
      let thirdLine = decoder.decode(view.getLine()).replace(/,\r\n$/g,'').split(',')
      for(let i=0;i<9;i++){
        radial[secondLine[i]] = thirdLine[i]
      }
      for(let i=9;i<secondLine.length;i+=9){
        radial.list.push({
          distance:Number(secondLine[i].split(' ')[0].substring(0,secondLine[i].split(' ')[0].length-1)),
          [secondLine[i+0].split(' ').slice(1).join(' ')]:Number(thirdLine[i+0]),
          [secondLine[i+1].split(' ').slice(1).join(' ')]:Number(thirdLine[i+1]),
          [secondLine[i+2].split(' ').slice(1).join(' ')]:Number(thirdLine[i+2]),
          [secondLine[i+3].split(' ').slice(1).join(' ')]:Number(thirdLine[i+3]),
          [secondLine[i+4].split(' ').slice(1).join(' ')]:Number(thirdLine[i+4]),
          [secondLine[i+5].split(' ').slice(1).join(' ')]:Number(thirdLine[i+5]),
          [secondLine[i+6].split(' ').slice(1).join(' ')]:Number(thirdLine[i+6]),
          [secondLine[i+7].split(' ').slice(1).join(' ')]:Number(thirdLine[i+7]),
          [secondLine[i+8].split(' ').slice(1).join(' ')]:Number(thirdLine[i+8]),
        })
      }
      result.radials.unshift(radial)
    }
    let Fdatas: any[] = [];
    result.radials.map((v: any, k: number) => {
      if (k === 0) {
        currentTime.value = moment(v.Date_time,'YYYYMMDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
      }
      let data_time = v.Date_time;
      let data_list = v.list;
      let fData: { [key: string]: any } = {};
      fData.timestamp = data_time;
      fData.data = [];
      data_list.map((item: any) => {
        fData.data.push({
          fHei: item.distance,
          fHAngle: item.WindDirection,
          fHSpeed: item.WindSpeed,
          fVSpeed: item.ZWind,
          iBelieveable: item.MeanSNR,
        });
      });
      Fdatas.push(fData);
    });
    dbs.process(Fdatas, type1, diejia, type2);
  }
};
const setDBS = (isDark: boolean) => {
  dbs = new DBS();
  dbs.init({
    el: fkxContainer.value,
    size: 144,
    isDark,
  });
  处理风廓线数据(...opts)
  // Fdata.timestamp = new Date(Math.floor(new Date().getTime() / 5000) * 5000).Format();
  // dbs.process(Object.assign({}, Fdata));
  // timer = setInterval(() => {
  //   Fdata.timestamp = new Date(Math.floor(new Date().getTime() / 5000) * 5000).Format();
  //   dbs.process(Object.assign({}, Fdata));
  //   // clearInterval(timer);
  // }, 5000);
};
onBeforeUnmount(() => {
  eventbus.off("处理风廓线数据"+radar_id, 处理风廓线数据);
  clearInterval(timer);
  dbs.destroy();
});
</script>
