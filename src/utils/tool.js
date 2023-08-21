export const getQuery = () => getParam('?')
export const getHash = () => getParam('#')
const getParam = (symbol='?') => {
  let params = {}
  var vars = window.location.toString().substring(window.location.toString().indexOf(symbol)+1).split('&');
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    params[pair[0]] = decodeURIComponent(pair[1])
  }
  return params
}