const modules = import.meta.glob('~/**/*.vue')
/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export const array2components = array => {
  const arr = deepClone(array)
  arr.map((v,k)=>{
    v.path='/'+v.path
  })
  const fn = l => {
    l.map(v => {
      if(v.children instanceof Array){
        fn(v.children)
      }
      v.component = modules[v.component]
    })
  }
  fn(arr)
  return arr
}
Date.prototype.Format = function(format){
  let that = this;
  if(format==undefined) format = "yyyy-MM-dd HH:mm:ss";
  return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS|S/g, function(a){
    switch(a){
      case 'yyyy':
        return function(i){return (i < 10 ? '0' : '') + i}(that.getFullYear());
      case 'MM':
        return function(i){return (i < 10 ? '0' : '') + i}(that.getMonth() + 1);
      case 'dd':
        return function(i){return (i < 10 ? '0' : '') + i}(that.getDate());
      case 'HH':
        return function(i){return (i < 10 ? '0' : '') + i}(that.getHours());
      case 'mm':
        return function(i){return (i < 10 ? '0' : '') + i}(that.getMinutes());
      case 'ss':
        return function(i){return (i < 10 ? '0' : '') + i}(that.getSeconds());
      case 'S':
        return function(i){return i}(Math.floor(that.getMilliseconds()*10/1000));
      case 'SSS':
        return function(i){return (i < 10 ? '00' : i<100 ? '0' : '') + i}(that.getMilliseconds());
      case 'q':
        return Math.floor((that.getMonth() + 3) / 3)+'';
    }
  });
};