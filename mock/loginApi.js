//模拟登录登出接口
const Token = require('./token');
const { v4: uuidv4 } = require('uuid');
const users = {
    admin:{
        "id": 406,
        "createtime": "2022-02-15 13:09:48",
        "updatetime": "2022-11-17 16:58:02",
        "uuid": uuidv4(),
        "username": "admin",
        "introduction": "I am a super administrator",
        "nickname": "超级用户",
        "login_type": "普通登录",
        "email": null,
        "email_verified_at": null,
        "password": "admin",
        "two_factor_secret": null,
        "two_factor_recovery_codes": null,
        "remember_token": "",
        // "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        // "avatar": "https://img2.baidu.com/it/u=483398814,2966849709&fm=253&fmt=auto&app=138&f=JPEG",
        "avatar": "/favicon.svg",
        "user_path": "/",
        "debug_enable": "true",
        "roles": [
            "admin"
        ]
    }
}
// export default [{
//     path: '/backend/libs/db/src/login.php',
//     method: 'POST',
//     response: (req,res) => {
//         if(users[req.body.username]&&users[req.body.username].password == req.body.password){
//         let token = Token.encrypt({username:req.body.username},{expiresIn:'1d'})
//         res.cookie('Admin-Token', token, { path:'/', httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365,sameSite:req.body.secure?'None':null,secure:req.body.secure});
//         return{
//             code: 20000
//         }
//         }else{
//             res.status(400).send({
//                 message: 'Account or password are incorrect.'
//             })
//         }
//     }
// },
// {
//     path: '/backend/libs/db/src/login.php',
//     method: 'GET',
//     response: (req,res) => {
//         let token = req.cookies['Admin-Token']
//         if(token){
//             const { username } = Token.decrypt(token)
//             if(users[username]){
//                 return {
//                 code: 20000,
//                 data:users[username]
//                 }
//             }
//         }
//         res.status(400).send({
//             message: 'invalid token!'
//         })
//     }
// },
// {
//     path: '/backend/libs/db/src/login.php',
//     method: 'DELETE',
//     response: (req,res) => {
//         res.clearCookie('Admin-Token')
//         return {
//             message: 'success'
//         }
//     }
// }]