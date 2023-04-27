function convert2gps84(lng, lat) {
   var PI = 3.1415926535897932384626;
   var a = 6378245.0;
   var ee = 0.00669342162296594323;
   var dlat = transformlat(lng - 105.0, lat - 35.0);
   var dlng = transformlng(lng - 105.0, lat - 35.0);
   var radlat = lat / 180.0 * PI;
   var magic = Math.sin(radlat);
   magic = 1 - ee * magic * magic;
   var sqrtmagic = Math.sqrt(magic);
   dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
   dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
   var mglat = lat + dlat;
   var mglng = lng + dlng;
   return [lng * 2 - mglng, lat * 2 - mglat]
}
var transformlat = function(lng, lat) {
   var PI = 3.1415926535897932384626;
   var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
   ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
   ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
   ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
   return ret;
}
var transformlng = function(lng, lat) {
   var PI = 3.1415926535897932384626;
   var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 *
   Math.sqrt(Math.abs(lng));
   ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
   ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
   ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
   return ret;
}

/**
* 84坐标系转火星坐标系
* @param lng
* @param lat
* @returns {*[]}
*/
export function wgs84togcj02(lng, lat) {
   var PI = 3.1415926535897932384626;
   var ee = 0.00669342162296594323;
   var a = 6378245.0;
   var dlat = transformlat(lng - 105.0, lat - 35.0);
   var dlng = transformlng(lng - 105.0, lat - 35.0);
   var radlat = lat / 180.0 * PI;
   var magic = Math.sin(radlat);
   magic = 1 - ee * magic * magic;
   var sqrtmagic = Math.sqrt(magic);
   dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
   dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
   var mglat = parseFloat(lat) + parseFloat(dlat);
   var mglng = parseFloat(lng) + parseFloat(dlng);
   return [mglng, mglat]
}

/**
* 度分秒转经纬度
* @param du
* @param fen
* @param miao
* @returns {string}
*/
var degreeConvertBack = function(du,fen,miao) {
   return Math.abs(du) + (Math.abs(fen)/60 + Math.abs(miao)/3600);
}

/**
* 将度转换成为度分秒
* @param value
* @returns {string}
*/
var formatDegree = function (value) {
   value = Math.abs(value);
   var v1 = Math.floor(value);//度
   var v2 = Math.floor((value - v1) * 60);//分
   var v3 = Math.round((value - v1) * 3600 % 60);//秒
   return [v1, v2, v3];
};