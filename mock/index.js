const Token = require('./token');
const { v4: uuidv4 } = require('uuid');
import Mock from 'mockjs';
const users = {
  admin:{
    username:'admin',
    password:'',
    avatar:'',
    remember_token:'',
    login_type:'',
    nickname:'',
    user_path:'',
  }
}
export default [
  {
    url:'/api/stations',
    type:'get',
    response:(req)=>{
      return Mock.mock({
        'list|1-10': [{
            'id|+1': 1
        }]
      })
    }
  }
  // {
  //   url: "/api/libs/db/src/login.php",
  //   type: "post",
  //   rawResponse: async(req,res) => {
  //     console.dir(res)
  //     await new Promise((resolve) => {
  //       let str = ''
  //       req.on('data', (chunk) => {
  //         str += chunk
  //       })
  //       req.on('end', () => {
  //         try{
  //           req.body = JSON.parse(str)
  //         }catch{
  //           req.body = str
  //         }
  //         resolve(req,res)
  //       })
  //     })
  //     if(users[req.body.username]){
  //       let token = Token['encrypt']({username:req.body.username},{expiresIn:'1d'})
  //       res.cookie('Admin-Token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365,sameSite:req.body.secure?'None':null,secure:req.body.secure});
  //       res.send({
  //         code: 20000
  //       })
  //     }else{
  //       res.send({
  //         code: 60204,
  //         message: 'Account or password are incorrect.'
  //       })
  //     }
  //   }
  // }
]