import { wgs84togcj02 } from './mapUtil.js'
class View{
  constructor(arrayBuffer){
    this.dataView = new DataView(arrayBuffer)
    const buffer = new ArrayBuffer(2);
    const dataView = new DataView(buffer);
    dataView.setInt16(0, 256, true);
    const array = new Int16Array(buffer)
    this.littleEndian =  array[0] === 256;
    this.pos=0;
  }
  getInt8(){
    let val = this.dataView.getInt8(this.pos,this.littleEndian)
    this.pos += 1
    return val
  }
  getUint8(){
    let val = this.dataView.getUint8(this.pos,this.littleEndian)
    this.pos += 1
    return val
  }
  getInt16(){
    let val = this.dataView.getInt16(this.pos,this.littleEndian)
    this.pos += 2
    return val
  }
  getUint16(){
    let val = this.dataView.getUint16(this.pos,this.littleEndian)
    this.pos += 2
    return val
  }
  getInt32(){
    let val = this.dataView.getInt32(this.pos,this.littleEndian)
    this.pos += 4
    return val
  }
  getUint32(){
    let val = this.dataView.getUint32(this.pos,this.littleEndian)
    this.pos += 4
    return val
  }
  getBigInt64(){
    let val = this.dataView.getBigInt64(this.pos,this.littleEndian)
    this.pos += 8
    return val
  }
  getBigUint64(){
    let val = this.dataView.getBigUint64(this.pos,this.littleEndian)
    this.pos += 8
    return val
  }
  getFloat32(){
    let val = this.dataView.getFloat32(this.pos,this.littleEndian)
    this.pos += 8
    return val
  }
  getFloat64(){
    let val = this.dataView.getFloat64(this.pos,this.littleEndian)
    this.pos += 8
    return val
  }
  getBytes(len){
    let arr = new Uint8Array(len)
    for(let i=0;i<len;i++){
      arr[i] = this.dataView.getUint8(this.pos,this.littleEndian)
      this.pos++
    }
    return arr
  }
  seek(pos){
    this.pos = pos
  }
  getPos(){
    return this.pos
  }
}
let MinLng;
let MaxLng;
let MinLat;
let MaxLat;
let isDrawed = false;

const GISTYPE={
  GIS_POINT: 1,
  GIS_LINE: 2,
  GIS_REGION: 3,
  GIS_POINT2: 11,
  GIS_LINE2 : 12,
  GIS_REGION2: 13,
  GIS_AIRLINE: 20,//航线
  GIS_AIRMAPPOINT: 21,//新的点数据文件
  GIS_AIRMAPLINE: 22,//新的点数据文件
  GIS_AIRMAPREGION: 23,//新的点数据文件
  GIS_AIRLINE2: 30,//新定义的航线，增加航段长，航向信息
  GIS_DATA_POINT: 31,//新的面图元数据
  GIS_DATA_LINE: 32,//新的面图元数据
  GIS_DATA_REGION: 33,//新的面图元数据
}
let loadStatus = 'unload'
let UNITS = [];
let queue = [];

function draw(args){
  let cvs = new OffscreenCanvas(TileWidth,TileWidth);
  var ctx = cvs.getContext("2d",{antialias:true});
  // ctx.rect(0,0,20,10);
  // ctx.moveTo(x,0);
  // ctx.strokeStyle="#ff000088";
  // ctx.fillStyle="#00ff0088";
  // ctx.fill();
  // ctx.stroke();
  args.cvs = cvs;
  args.ctx = ctx;
  args._i=args.i%2**args._LL>=0?args.i%2**args._LL:args.i%2**args._LL+2**args._LL;
  args._j=args.j%2**args._LL>=0?args.j%2**args._LL:args.j%2**args._LL+2**args._LL;


  if(loadStatus=='loaded'){
    test(args);//使用已经缓存的数据
  }else if(loadStatus=='unload'){
    MinLng=+180;
    MaxLng=-180;
    MinLat=+90;
    MaxLat=-90;
    loadStatus='loading'
    var xhr = new XMLHttpRequest()
    xhr.open('GET','https://data.tanglei.top/导航台.map',true)
    xhr.responseType = 'arraybuffer'
    xhr.send()
    xhr.onreadystatechange = function() {
      let res = 'response' in xhr ? xhr.response : xhr.responseText
      if(xhr.readyState === 4 && xhr.status === 200) {
        let view = new View(res);
        let result = {
          filehead:{
            iLayerNum: view.getInt32(), //文件中包含的图层数。（建议一个图层一个文件，iLayerNum=1）/*int*/
            szReserved: view.getBytes(512), //保留字段。/*char[]*/
          },
          tagLayerPara:{
            iLayerID: view.getInt32(), //图层ID。/*int*/
            szLayerName: view.getBytes(128), //图层名称。/*char[]*/
            sLayerType: view.getInt16(),  //图层类型。（1-点、2-线、3-面、其他）/*short*/
            iLayerNotesLen: view.getInt32(),		//图层附加属性长度。/*int*/
            iUnitCount: view.getInt32(),  //图元个数。/*int*/
            iUnitNotesLen: view.getInt32(),	//图元附加属性长度。/*int*/
            iMapLevel: view.getInt32(),  //本图层所属层数。/*int*/
            dMaximumScale: view.getFloat64(),  // /*double*/
            dMinimumScale: view.getFloat64(),  //当Map Scale介于dMinimumScale和dMaximumScale之间时，才显示本图层。/*double*/
            bScaleSymbols: view.getUint8(),  //图层中的Symbol是否随图层放大而放大、随图层缩小而缩小。/*bool*/
            bVisible: view.getInt16(),  //图层是否显示。（1-全显示、2-部分显示、3-不显示）/*bool*/
            bShowLable: view.getInt16(),  //图元标注显示与否。（1-全显示、2-部分显示、3-不显示）/*bool*/
            layerTips:{ //图层标注（预留）。
              x:view.getFloat64(),/*double*/
              y:view.getFloat64(), //(x,y)指定标注位置。/*double*/
              szTips:view.getBytes(128), //标注文本 /*char[]*/
              bShowTips: view.getUint8() //是否显示图层标注 /*bool*/
            },
            spatialReference:{ //投影方式（预留）。
              iProjectMethod: view.getInt32(), //投影方式（1－正圆锥投影、）/*int*/
              dOrgLong: view.getFloat64(),		//投影坐标系坐标原点经度。/度 /*double*/
              dOrgLat: view.getFloat64(),			//投影坐标系坐标原点纬度。/度 /*double*/
              iOrgHeight: view.getInt32(),		//投影坐标系坐标原点高度。/米 /*int*/
              szReserved:view.getBytes(512),	//预留。 /*char[]*/
            },
            layerSource:{ //图层数据源，（预留）。
              sDataType:view.getInt16(),  //数据源类型（0―无源(可能是动态创建的)，1―文件，2―数据库）/*short*/
              DataSource:view.getBytes(128), //数据源。（*.gis）/*char[]*/
              szReserved:view.getBytes(128), //保留 /*char[]*/
              iReserved:view.getInt32()  //保留 /*int*/
            },
            layerEffects:{ //图层显示效果，（预留）。
              Brightness: view.getUint8(),  //明亮度（0～100）/*unsigned char*/
              Constrast: view.getUint8(),  //对比度（0～100）/*unsigned char*/
              Tranceparency: view.getUint8(),  //透明度（0～100）/*unsigned char*/
              bSupportsBrightnessChange: view.getUint8(),  //是否支持明亮度变化 /*bool*/
              bSupportsConstrastChange: view.getUint8(),  //是否支持对比度变化 /*bool*/
              bSupportsTranceparency: view.getUint8(),  //是否支持透明度 /*bool*/
              bSupportsInteractive: view.getUint8(),    //Indicates if the layer supports interactive effects changes /*bool*/
            }
          },
        }
        switch (result.tagLayerPara.sLayerType){
          // case GISTYPE.GIS_POINT:
          // case GISTYPE.GIS_POINT2:
          //   layerPara.m_cLayerType = GIS_POINT;
          //   bReadUnitOK = ReadPointLayer(rfile, pLayer, layerPara);
          //   break;
          // case GISTYPE.GIS_LINE:
          case GISTYPE.GIS_LINE2://如岛屿
            // layerPara.m_cLayerType = GIS_LINE;
            // bReadUnitOK = ReadLineLayer(rfile, pLayer, layerPara);
            console.log(view.getInt32())
            break;
          // case GISTYPE.GIS_REGION:
          // case GISTYPE.GIS_REGION2:
          //   layerPara.m_cLayerType = GIS_REGION;
          //   bReadUnitOK = ReadRegionLayer(rfile, pLayer, layerPara);
          //   break;
          case GISTYPE.GIS_AIRLINE:
            // layerPara.m_cLayerType = GIS_AIRLINE;
            // bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
            console.log(view.getBytes(view.getInt32()))
            break;
          case GISTYPE.GIS_AIRMAPPOINT:
            // layerPara.m_cLayerType = GIS_AIRMAPPOINT;
            // bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
            let iDataLen = view.getInt32()
            if(iDataLen<=0){
              return;
            }
            let utf8Decoder = new TextDecoder('utf8')
            let tagPara = {
              m_clearType:view.getInt16(),
              m_strLayerName:utf8Decoder.decode(view.getBytes(view.getUint16())),
              iUnitNum:view.getInt32(),
            }
            let vecUnit = []
            for(let i=0;i<tagPara.iUnitNum;i++){//tagPara.iUnitNum
              let pUnit = {
                iID: view.getInt32(),//图元ID
                strCode: utf8Decoder.decode(view.getBytes(view.getUint16())),//图元名称
                tagRGB:{///图元颜色
                  sBlue: view.getUint8(),
                  sGreen: view.getUint8(),
                  sRed: view.getUint8(),
                },
                tagText:{///标注信息
                  strText:utf8Decoder.decode(view.getBytes(view.getUint16())),//标注内容
                  tagPos:{//标注位置
                    dLong:view.getFloat64(),//Longitude 经度
                    dLat:view.getFloat64(),//Latitude	纬度
                    dHeight:view.getFloat64(),//Height 海拔高度 米
                  },
                },
                ubyType:view.getUint8(),///类型，0未知，1点，2线，3面
                ubyShow:view.getUint8(),///是否显示
                ubyLevel:view.getUint8(),///图元等级
                tagPos:{//点的空间属性
                  dLong:view.getFloat64(),//Longitude 经度
                  dLat:view.getFloat64(),//Latitude	纬度
                  dHeight:view.getFloat64(),//Height 海拔高度 米
                },
                ubyPointStyle:view.getUint8(),///点的形状
                ubyDataType:view.getUint8(),///地标类型，
                ubyAirLinePt:view.getUint8(),///航线航路过点
              }
              MinLng = MinLng<pUnit.tagPos.dLong?MinLng:pUnit.tagPos.dLong
              MinLat = MinLat<pUnit.tagPos.dLat?MinLat:pUnit.tagPos.dLat
              MaxLng = MinLng<pUnit.tagPos.dLong?MinLng:pUnit.tagPos.dLong
              MaxLat = MinLat<pUnit.tagPos.dLat?MinLng:pUnit.tagPos.dLat
              vecUnit.push(pUnit)
            }
            UNITS = vecUnit
            loadStatus = 'loaded'
            test(args);//第一次使用后台返回的数据
            for(let i=0;i<queue.length;i++){
              let args = queue.splice(i--,1)[0]
              test(args)
            }
            break;
          case GISTYPE.GIS_DATA_POINT:
          case GISTYPE.GIS_DATA_LINE://如飞行管制分区
          case GISTYPE.GIS_DATA_REGION://如禁区
          //   layerPara.m_cLayerType = tagLayerPara.sLayerType;
          //   bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
            break;
          default:
            throw new Error('Unknow GISTYPE: '+result.tagLayerPara.sLayerType)
        }
      }
    }
  }else if(loadStatus=='loading'){//数据加载中
    queue.push(args)
  }
  // self.close();
}
let imgX,imgY;
let imgScale;
let TileWidth;
self.onmessage =function(evt){
  imgX = evt.data.imgX;
  imgY = evt.data.imgY;
  imgScale = evt.data.imgScale;
  TileWidth = evt.data.TileWidth;
  draw(evt.data.args);
}

function test(args){
  isDrawed = false;
  args.ctx.save()
  for(let i=0;i<UNITS.length;i++){
    let unit = UNITS[i]
    let convert = wgs84togcj02(unit.tagPos.dLong,unit.tagPos.dLat)
    let x = (lng2Pixel(convert[0]) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth;
    let y = (lat2Pixel(convert[1]) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth;
    if(-200<x&&x<args.cvs.width+200&&-200<y&&y<args.cvs.height+200){
      args.ctx.strokeStyle='red'
      args.ctx.fillStyle='red'
      args.ctx.font='16px Arial'
      args.ctx.beginPath()
      args.ctx.strokeRect(x-5,y-5,10,10)
      args.ctx.beginPath()
      args.ctx.arc(x,y,1,0,Math.PI*2)
      args.ctx.stroke()
      args.ctx.beginPath()
      args.ctx.textAlign='center'
      args.ctx.fillText(unit.tagText.strText,x,y-8)
      isDrawed = true
    }
  }
  args.ctx.restore()
  if(isDrawed){
    postMessage({i:args.i,j:args.j,_LL:args._LL,bitmap:args.cvs.transferToImageBitmap(),isDrawed,beginTime:args.beginTime,x:args._i,y:args._j});
  }else{
    postMessage({i:args.i,j:args.j,_LL:args._LL,bitmap:0,isDrawed,beginTime:args.beginTime,x:args._i,y:args._j});
  }
  delete args.cvs
}

	function lngLat2Pixel(lng,lat){
    return{
      x:lng2Pixel(lng),
      y:lat2Pixel(lat),
    }
	}
	function lng2Pixel(lng){
    return imgX + TileWidth*imgScale*(lng+180)/360;
	}
	function lat2Pixel(lat){
	  return imgY + (1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 * TileWidth*imgScale;
	}