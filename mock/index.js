import Mock from 'mockjs';
export default [
  {
    path:'/backend/:路径/test',
    method:'GET',
    response:(req)=>{
      console.log('params',req.params)
      console.log('query',req.query)
      console.log('body',req.body)
      console.log('file',req.files)
      return Mock.mock({
        'list|1-10': [{
            'id|+1': 1
        }]
      })
    }
  },
  {
    path:'/api/weather/wind/avg/:time',
    method:'POST',
    disable: true,
    delay:()=>Math.round(Math.random()*10000),
    response:(req)=>{
      console.log(req.params)
      let mockData = Mock.mock({'list|20':[{
        "timestamp": "2023-10-26T23:50:00+08:00",
        "device_id": "",
        "distance|+39": 70,
        "layers": 19,
        "ex_temp": 0,
        "ex_hum": -1,
        "north_a": 320.61,
        "pitch_a": 1.44,
        "roll_a": 0.23,
        "rws_1": -1000,
        "rate_rws_1": 0,
        "rws_2": -1000,
        "rate_rws_2": 0,
        "rws_3": -1000,
        "rate_rws_3": 0,
        "rws_4": 0.06,
        "rate_rws_4": 0.02,
        "center_h_speed|0-60": 20,
        "rate_center_h_speed": 0,
        "center_h_direction_abs|0-90": 0,
        "vert_airflow": 0,
        "ti_1": -1000,
        "ti_2": -1000,
        "ti_3": -1000,
        "ti_4": 0,
        "hws_up": 0,
        "rate_hws_up": 0,
        "hdir_up_rel": 0,
        "hws_down": 0,
        "rate_hws_down": 0,
        "hdir_down_rel": 0,
        "vw_shear": 0,
        "hw_shear": 0,
        "hws_hub": 0,
        "rate_hws_hub": 0,
        "hdir_hub_Rel": 0,
        "ax_ws": 0,
        "rate_ax_ws": 0,
        "equi_ws": 0,
        "rate_equi_ws": 0
      }]})
      let arr = []
      mockData.list.reverse()
      for(let i=0;i<mockData.list.length;i++){
        let tmp = mockData.list[i]
        arr.push({[tmp.distance]:tmp})
      }
      return Mock.mock({
        "code": 200,
        "message": "请求成功。",
        "data": [
          {
            // "12ba25da-e81c-4ef3-94ff-91591970b5fb": [
            "7e36842c-db83-41fc-8c87-d12d3d30c3b3": [
              {
                "2023-10-26 23:50:00+08:00": arr
              }
            ]
          }
        ]
      })
    }
  }
]