import routes from '../../mock/index';
const cookie = require('cookie')
function parseQuery(queryString) {
  var query = {};
  let arr = queryString.split("&");
  for(var i = 0; i < arr.length; i++) {
    let tmp = arr[i].split("=")
    if(tmp[1]=='true'){
      tmp[1] = true
    }else if(tmp[1]=='false'){
      tmp[1] = false
    }else if(tmp[1]=='NaN'){
      tmp[1] = NaN
    }else if(tmp[1]=='-NaN'){
      tmp[1] = -NaN
    }else if(tmp[1]=='Infinity'){
      tmp[1]=Infinity
    }else if(tmp[1]=='-Infinity'){
      tmp[1]=-Infinity
    }else if(!isNaN(parseFloat(tmp[1])&&isFinite(tmp[1]))){
      tmp[1] = Number(tmp[1]);
    }else if(tmp[1]){
      tmp[1] = decodeURIComponent(tmp[1])
    }else{
      tmp[1] = undefined
    }
    query[tmp[0]] = tmp[1]
  }
  return query;
}
module.exports = async function(req, res, next){
  res.cookie = (name,value,options)=>{
    res.setHeader('Set-Cookie',cookie.serialize(name, value, options))
  }
  res.clearCookie = (name, options = {}) => {
    res.setHeader('Set-Cookie', `${name}=; Path=${options.path || '/'}; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`);
  }
  req.path = decodeURIComponent(req._parsedUrl.pathname)
  if(req._parsedUrl.query){
    req.query = parseQuery(req._parsedUrl.query)
  }else{
    req.query = {}
  }
  if(!await matchRoute(req,res,next,routes)){
    next()
  }
};
async function matchRoute(req,res,next,routes){
  for(let i=0;i<routes.length;i++){
    if((routes[i].method!=undefined&&routes[i].method!=null)&&(req.method == routes[i].method||(routes[i].method instanceof Array && routes[i].method.indexOf(req.method)>=0)) && (req.path === routes[i].url || req.path.match(RegExp(`^${routes[i].url}`)))){
      await new Promise((resolve) => {
        let body = undefined
        req.on('data', (chunk) => {
          if(body==undefined){
            body=""
          }
          body += chunk
        })
        req.on('end', () => {
          try {
            body = JSON.parse(body)
          } catch {}
          resolve(body)
        })
      }).then(body=>{
        req.body = body
      })
      if(Object.prototype.toString.call(routes[i].response)==='[object Object]'){
        res.write(JSON.stringify(routes[i].response))
        res.end()
        return true
      }else if(Object.prototype.toString.call(routes[i].response)==='[object Function]'){
        let tmp = routes[i].response(req, res,next)
        if(typeof tmp == 'object'){
          res.write(JSON.stringify(tmp))
          res.end()
        }
        return true
      } else if(Object.prototype.toString.call(routes[i].response)==='[object AsyncFunction]'){
        let tmp = await routes[i].response(req,res,next)
        if(typeof tmp == 'object'){
          res.write(JSON.stringify(tmp))
          res.end()
        }
        return true
      }else throw Error(`${Object.prototype.toString.call(routes[i].response)} not support!!!`)
    }
    if(routes[i].children instanceof Array){
      return await arguments.callee(req,res,next,routes[i].children);
    }
  }
  return false
}
