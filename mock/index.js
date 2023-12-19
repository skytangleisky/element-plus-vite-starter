import loginApi from './loginApi'
import Mock from 'mockjs';
export default [
  {
    url:'/api/stations',
    method:'GET',
    response:(req)=>{
      console.log(req.query)
      return Mock.mock({
        'list|1-10': [{
            'id|+1': 1
        }]
      })
    }
  },
  ...loginApi
]