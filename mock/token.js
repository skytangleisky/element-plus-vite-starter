const jwt = require('jsonwebtoken');
const secretOrPrivateKey = 'secret'; // 秘钥
const Options = {expiresIn:'1d'}; // token 默认有效时间

module.exports = {
  encrypt:function(data,options) {
    return jwt.sign(data,secretOrPrivateKey,Object.assign({},Options,options));
  },
  decrypt:function(token){
    return jwt.verify(token,secretOrPrivateKey);
  }
}