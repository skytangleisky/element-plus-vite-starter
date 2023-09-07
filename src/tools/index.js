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