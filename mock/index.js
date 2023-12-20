import Mock from 'mockjs';
export default [
  {
    url:'/backend/stations',
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
  {
    url:'/api/weather/wind/avg',
    method:'POST',
    response:()=>{
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
      for(let i=0;i<mockData.list.length;i++){
        let tmp = mockData.list[i]
        arr.push({[tmp.distance]:tmp})
      }
      return Mock.mock({
        "code": 200,
        "message": "请求成功。",
        "data": [
          {
            "c31c911e-1bb4-4272-b16e-e141bfaa0985": [
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