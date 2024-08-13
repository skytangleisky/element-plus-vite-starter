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
          if(type=='4'){//第四类数据格式，格点数据
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
            result.时效 = Number(secondLine[4])
            result.层次 = Number(secondLine[5])
            let thirdLine = gbkDecoder.decode(view.getLine()).trim().split(/\s+/)
            result.intervalU = Number(thirdLine[0])
            result.intervalV = Number(thirdLine[1])
            result.beginLng = Number(thirdLine[2])
            result.endLng = Number(thirdLine[3])
            result.beginLat = Number(thirdLine[4])
            result.endLat = Number(thirdLine[5])
            let fourthLine = gbkDecoder.decode(view.getLine()).trim().split(/\s+/)
            result.sizeU = Number(fourthLine[0])
            result.sizeV = Number(fourthLine[1])
            result.isolineInterval = Number(fourthLine[2])
            result.isolineBegin = Number(fourthLine[3])
            result.smoothingCoefficient = Number(fourthLine[4])
            result.smoothingCoefficient = Number(fourthLine[5])
            result.bold = Number(fourthLine[6])
            result.data = [];
            for(let i=0;i<result.sizeV;i++){
              let row = []
              for(let j=0;j<result.sizeU;j++){
                row.push(Number(gbkDecoder.decode(view.getOne()).trim()))
              }
              result.data.push(row)
            }
            resolve(result)
          }else if(type=='1'){//第一类数据格式：地面全要素填图数据
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
          }else if(type=='11'){//第十一类数据格式：UV网格数据（绘制流线）
            view.seek(0)
            let result: { [key: string]: any } = {};
            result.symbol = gbkDecoder.decode(view.getOne()).trim(); //diamond （8个字符）
            result.type = gbkDecoder.decode(view.getOne()).trim(); //11 （3个字符）
            result.describe = gbkDecoder.decode(view.getOne()).trim(); //数据说明 （40个字符）
            result.year = gbkDecoder.decode(view.getOne()).trim(); //年 （5个字符）
            result.month = gbkDecoder.decode(view.getOne()).trim(); //月 （3个字符）
            result.day = gbkDecoder.decode(view.getOne()).trim(); //日 （3个字符）
            result.hour = gbkDecoder.decode(view.getOne()).trim(); //时次（3个字符）
            result.ageing = Number(gbkDecoder.decode(view.getOne()))//实效
            result.level = Number(gbkDecoder.decode(view.getOne()))//层次
            result.dLng = Number(gbkDecoder.decode(view.getOne())); //经度格距
            result.dLat = Number(gbkDecoder.decode(view.getOne())); //纬度格距
            result.beginLng = Number(gbkDecoder.decode(view.getOne())); //起始经度
            result.endLng = Number(gbkDecoder.decode(view.getOne())); //终止经度
            result.beginLat = Number(gbkDecoder.decode(view.getOne())); //起始纬度
            result.endLat = Number(gbkDecoder.decode(view.getOne())); //终止纬度
            result.lngCount = Number(gbkDecoder.decode(view.getOne())); //纬向格点数
            result.latCount = Number(gbkDecoder.decode(view.getOne())); //经向格点数
            result.data = []
            for(let i=0;i<result.lngCount*result.latCount*2;i++){
              result.data.push(Number(gbkDecoder.decode(view.getOne())))
            }
            resolve(result)
          }
        }
        reject('type='+type+'，格式不支持')
      }
    };
  })
}


function transpose(arr:Array<Array<number>>) {
  // 获取原始矩阵的行数和列数
  const rows = arr.length;
  const cols = arr[0].length;

  // 创建一个新的二维数组来保存转置后的矩阵
  const transposedMatrix = [];

  // 遍历原始矩阵的列
  for (let j = 0; j < cols; j++) {
      // 创建一个新的一维数组来保存转置后的列
      const newRow = [];
      // 遍历原始矩阵的行
      for (let i = 0; i < rows; i++) {
          // 将原始矩阵的行和列互换，并保存到新的一维数组中
          newRow.push(arr[i][j]);
      }
      // 将新的一维数组添加到转置后的矩阵中
      transposedMatrix.push(newRow);
  }

  // 返回转置后的矩阵
  return transposedMatrix;
}