import {View} from '~/tools'
let gbkDecoder = new TextDecoder("gbk");
export const getMicapsData = (dataUrl:string) => {
  return new Promise((resolve,reject)=>{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", dataUrl, true);
    xhr.responseType = "arraybuffer";
    xhr.send();
    xhr.onreadystatechange = () => {
      let res = xhr.response;
      if (xhr.readyState === 4 && xhr.status === 200) {
        let view = new View(res);
        let result: { [key: string]: any } = {};
        let symbol = gbkDecoder.decode(view.getOne()).trim()
        let type = gbkDecoder.decode(view.getOne()).trim()
        if(symbol=='diamond'){
          if(type=='1'){//第一类数据格式：地面全要素填图数据
            view.seek(0)
            let firstLine = gbkDecoder.decode(view.getLine()).trim().split(/\s+/)
            result.symbol = firstLine[0]
            result.type = firstLine[1]
            result.describe = firstLine[2]
            let secondLine = gbkDecoder.decode(view.getLine()).trim().split(/\s+/)
            result.year = secondLine[0]
            result.month = secondLine[1]
            result.day = secondLine[2]
            result.hour = secondLine[3]
            result.count = Number(secondLine[4])
            result.data = []
            for(let i=0;i<result.count;i++){
              let item = (gbkDecoder.decode(view.getLine()).trim() + ' ' + gbkDecoder.decode(view.getLine()).trim()).split(/\s+/)
              let obj:{[key:string]:any} = {}
              obj.区站号 = item[0]//区站号（长整数）
              obj.经度 = Number(item[1])//经度
              obj.纬度 = Number(item[2])//纬度
              obj.海拔高度 = Number(item[3])//拔海高度
              obj.站点级别 = Number(item[4])//站点级别
              obj.总云量 = Number(item[5])//总云量
              obj.风向 = Number(item[6])//风向
              obj.风速 = Number(item[7])//风速
              obj.海平面气压 = Number(item[8])//海平面气压（或本站气压）
              obj['3小时变压']=Number(item[9])//3小时变压
              obj.过去天气1=item[10]//过去天气1
              obj.过去天气2=item[11]//过去天气2
              obj['6小时降水']=Number(item[12])//6小时降水
              obj.低云状=item[13]//低云状
              obj.低云量=item[14]//低云量
              obj.低云高=item[15]//低云高
              obj.露点=Number(item[16])//露点
              obj.能见度=Number(item[17])//能见度
              obj.现在天气=item[18]//现在天气
              obj.温度=Number(item[19])//温度
              obj.中云状=item[20]//中云状
              obj.高云状=item[21]//高云状
              obj.标志1=Number(item[22])//标志1
              obj.标志2=Number(item[23])//标志2
              obj['24小时变温']=item[24]//24小时变温
              obj['24小时变压']=item[25]//24小时变压
              result.data.push(obj)
            }
            resolve(result)
          }else if(type=='13'){//第十三类数据格式：图象数据（云图、雷达拼图、地形图）
            view.seek(0)
            let result: { [key: string]: any } = {};
            result.symbol = gbkDecoder.decode(view.getBytes(8)); //diamond （8个字符）
            result.type = gbkDecoder.decode(view.getBytes(3)); //13 （3个字符）
            result.describe = gbkDecoder.decode(view.getBytes(40)); //数据说明 （40个字符）
            result.year = gbkDecoder.decode(view.getBytes(5)); //年 （5个字符）
            result.month = gbkDecoder.decode(view.getBytes(3)); //月 （3个字符）
            result.day = gbkDecoder.decode(view.getBytes(3)); //日 （3个字符）
            result.hour = gbkDecoder.decode(view.getBytes(3)); //时次（3个字符）
            result.xCount = Number(gbkDecoder.decode(view.getBytes(5))); //X方向图象大小 （5个字符）
            result.yCount = Number(gbkDecoder.decode(view.getBytes(5))); //Y方向图象大小 （5个字符）
            result.minLng = Number(gbkDecoder.decode(view.getBytes(8))); //图象左下角经度坐标 （8个字符）
            result.minLat = Number(gbkDecoder.decode(view.getBytes(8))); //图象左下角纬度坐标 （8个字符）
            result.projection = gbkDecoder.decode(view.getBytes(2)); //投影方式（2个字符，1-lambert  2-mecator  3-北半球  4-南半球）
            result.scale = Number(gbkDecoder.decode(view.getBytes(5))); //放缩系数（5个字符）
            result.imageType = gbkDecoder.decode(view.getBytes(2)); //图象类型（2个字符，1—红外云图 2—雷达拼图 3—地形图 4—可见光云图 5—水汽图）
            result.physicalQuantityFileName = gbkDecoder.decode(view.getBytes(12)); //象素值与相应物理量对照表文件名（12个字符）
            result.cenLng = Number(gbkDecoder.decode(view.getBytes(8))); //中心经度（8个字符）
            result.cenLat = Number(gbkDecoder.decode(view.getBytes(8))); //中心纬度（8个字符）
            result.pixelData = view.getBytes(result.xCount * result.yCount);//数据：（数据格式为二进制数据），一个象素点占一个字节，先沿X方向后Y方向。
            resolve(result)
          }
        }
        reject('格式不支持')
      }
    };
  })
}
