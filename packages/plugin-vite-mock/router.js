const chokidar = require('chokidar')
const cookie = require('cookie')
const fg = require('fast-glob')
const colors = require('picocolors')
const { bundleRequire }  = require('bundle-require')
const bodyParser = require('body-parser')
const multer = require('multer')
const mockPath = process.cwd() + '/mock'
const uploadPath = process.cwd() + '/uploads'
async function sleep(timeout=0){
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve(timeout)
    },timeout)
  })
}
function loggerOutput(title, msg, type = 'info') {
  const tag = type === 'info' ? colors.cyan(`[vite:mock]`) : colors.red(`[vite:mock-server]`)
  console.log(`${colors.dim(new Date().toLocaleTimeString())} ${tag} ${colors.green(title)} ${colors.dim( msg)}`)
}
const watcher = chokidar.watch(mockPath, {
  ignoreInitial: true
})
let routes = []
watcher.on('all', async (event, file) => {
  loggerOutput(`mock file ${event}`, file)
  routes=[];
  (await Promise.all(fg.globSync(`**/*.{ts,mjs,js}`, {cwd: mockPath,}).map(async(name)=>await bundleRequire({filepath: mockPath + '/' + name})))).map(item=>{
    if(item.mod.default instanceof Array){
      routes = routes.concat(item.mod.default)
    }
  })
})
function parseQuery(queryString) {
  var query = {};
  let arr = queryString.split("&");
  for(var i = 0; i < arr.length; i++) {
    let tmp = arr[i].split("=")
    if(tmp[1]){
      tmp[1] = decodeURIComponent(tmp[1])
    }else{
      tmp[1] = undefined
    }
    query[tmp[0]] = tmp[1]
  }
  return query;
}
module.exports = async(req, res, next) => {
  if(!res.status){
    res.status = (statusCode)=>{
      res.statusCode = statusCode
      return res
    }
  }
  res.cookie = (name,value,options)=>{
    res.setHeader('Set-Cookie',cookie.serialize(name, value, options))
  }
  res.clearCookie = (name, options = {}) => {
    res.setHeader('Set-Cookie', `${name}=; Path=${options.path || '/'}; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`);
  }
  req.params = {}
  req.files = []
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
module.exports.dispose = () => {
  watcher.unwatch(mockPath)
}
module.exports.init = async(resolvedConfig,opts)=>{
  routes=[];
  (await Promise.all(fg.globSync(`**/*.{ts,mjs,js}`, {cwd: mockPath}).map(async(name)=>await bundleRequire({filepath: mockPath + '/' + name})))).map(item=>{
    if(item.mod.default instanceof Array){
      routes = routes.concat(item.mod.default)
    }
  })
  loggerOutput(`load mock data from`, mockPath)
}
async function matchRoute(req,res,next,routes){
  for(let i=0;i<routes.length;i++){
    let match = routes[i].path.split('/')
    if(!routes[i].disable&&(routes[i].method!=undefined&&routes[i].method!=null)
      &&(req.method.toUpperCase() == routes[i].method.toUpperCase()||(routes[i].method instanceof Array && routes[i].method.slice().map(item=>item.toUpperCase()).indexOf(req.method.toUpperCase())>=0))){
      let reqMatch = req.path.split('/')
      if(reqMatch.length == match.length){
        let bool = match.every((value,index,arr)=>{
          let tmp = value.match(/(?<=^:).*$/g)
          if(tmp){
            req.params[tmp[0]] = reqMatch[index]
            return true;
          }else{
            return value == reqMatch[index]
          }
        })
        if(bool){
          await urlencoded(req,res)
          await json(req,res)
          await text(req,res)
          await raw(req,res)
          await multipart(req,res)
          let delay = Object.prototype.toString.call(routes[i].delay)==='[object Function]'?routes[i].delay():routes[i].delay
          let beginTime = performance.now()
          await sleep(delay)
          if(Object.prototype.toString.call(routes[i].response)==='[object Object]'){
            res.setHeader('Content-Type','application/json')
            res.write(JSON.stringify(routes[i].response))
            res.end()
            loggerOutput('request invoke', req.method.padEnd(10,' ') + ((performance.now()-beginTime).toFixed(2)+'ms').padEnd(10,' ') + req.url)
            return true
          }else if(Object.prototype.toString.call(routes[i].response)==='[object Function]'){
            let tmp = routes[i].response(req, res,next)
            if(typeof tmp == 'object'){
              res.setHeader('Content-Type','application/json')
              res.write(JSON.stringify(tmp))
              res.end()
            }
            loggerOutput('request invoke', req.method.padEnd(10,' ') + ((performance.now()-beginTime).toFixed(2)+'ms').padEnd(10,' ') + req.url)
            return true
          } else if(Object.prototype.toString.call(routes[i].response)==='[object AsyncFunction]'){
            let tmp = await routes[i].response(req,res,next)
            if(typeof tmp == 'object'){
              res.setHeader('Content-Type','application/json')
              res.write(JSON.stringify(tmp))
              res.end()
            }
            loggerOutput('request invoke', req.method.padEnd(10,' ') + ((performance.now()-beginTime).toFixed(2)+'ms').padEnd(10,' ') + req.url)
            return true
          }else throw Error(`${Object.prototype.toString.call(routes[i].response)} not support!!!`)
        }
      }
    }
    if(routes[i].children instanceof Array){
      return await arguments.callee(req,res,next,routes[i].children);
    }
  }
  return false
}
let jsonParser = bodyParser.json()
async function json(req,res){
  return new Promise(resolve=>{
    jsonParser(req,res,()=>{
      resolve(undefined)
    })
  })
}
let textParser = bodyParser.text()
async function text(req,res){
  return new Promise(resolve=>{
    textParser(req,res,()=>{
      resolve(undefined)
    })
  })
}
let rawParser = bodyParser.raw()
async function raw(req,res){
  return new Promise(resolve=>{
    rawParser(req,res,()=>{
      resolve(undefined)
    })
  })
}
let urlencodedParser = bodyParser.urlencoded({extended:true})
async function urlencoded(req,res){
  return new Promise(resolve=>{
    urlencodedParser(req,res,()=>{
      resolve(undefined)
    })
  })
}
const upload = multer({
  storage:multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  }),
  fileFilter:(req, file, cb) => {
    cb(null, true)
    // cb(null, false)
    // cb(new Error('I don\'t have a clue!'))
  }
})
let multerParser = upload.any()
async function multipart(req,res){
  return new Promise(resolve=>{
    multerParser(req,res,()=>{
      req.body = JSON.parse(JSON.stringify(req.body))
      resolve(undefined)
    })
  })
}