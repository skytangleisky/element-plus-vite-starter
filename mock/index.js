import radarsData from './radars.json'
import radialData from './radial.json'
import Mock from 'mockjs';
Date.prototype.Format = function(format){
    let that = this;
    if(format==undefined) format = "yyyy-MM-dd HH:mm:ss";
    return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS|SS|S/g, function(a){
        switch(a){
        case 'yyyy':
            return function(i){return (i < 10 ? '0' : '') + i}(that.getFullYear());
        case 'MM':
            return function(i){return (i < 10 ? '0' : '') + i}(that.getMonth() + 1);
        case 'dd':
            return function(i){return (i < 10 ? '0' : '') + i}(that.getDate());
        case 'HH':
            return function(i){return (i < 10 ? '0' : '') + i}(that.getHours());
        case 'mm':
            return function(i){return (i < 10 ? '0' : '') + i}(that.getMinutes());
        case 'ss':
            return function(i){return (i < 10 ? '0' : '') + i}(that.getSeconds());
        case 'S':
            return function(i){return i}(Math.floor(that.getMilliseconds()*10/1000));
        case 'SS':
            return function(i){return i.toFixed().padStart(2,'0')}(Math.floor(that.getMilliseconds()*100/1000));
        case 'SSS':
            return function(i){return i.toFixed().padStart(3,'0')}(that.getMilliseconds());
        case 'q':
            return Math.floor((that.getMonth() + 3) / 3)+'';
        }
    });
};
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
        // delay:()=>Math.round(Math.random()*10000),
        response:(req)=>{
        console.log(req.params)
        let mockData = Mock.mock({'list|40':[{
            "timestamp": "2023-10-26T23:50:00+08:00",
            "device_id": "",
            "distance|+39": 70,
            "layers": 19,
            "ex_temp": 0,
            "ex_hum": Math.random(),
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
                // "7e36842c-db83-41fc-8c87-d12d3d30c3b3": [
                "a0024732-ee5e-4d14-b98c-feb418b198bd": [
                {
                    [new Date().Format('yyyy-MM-dd HH:mm:ss')]: arr,
                    [new Date(Date.now() - 1000).Format('yyyy-MM-dd HH:mm:ss')]: arr,
                    // "2023-10-27 00:00:00+08:00": arr,
                    // "2023-10-26 23:50:00+08:00": arr,
                }
                ],
                "c6e49c9d-140f-4496-b02a-9c645c3bf7ea": [
                {
                    "2023-10-26 23:50:00+08:00": arr
                }
                ]
            }
            ]
        })
        }
    },
    {
        path:'/api/radars/count',
        method:'POST',
        disable:true,
        response:()=>{
            return {
                "code": 200,
                "message": "请求成功。",
                "data": {
                    "radar_count": {
                        "radar_count_jc": 32,
                        "radar_count_ts": 23,
                        "radar_count_3d": 0
                    },
                    "online_radar_count": {
                        "online_radar_count_jc": 3,
                        "online_radar_count_ts": 1,
                        "online_radar_count_3d": 0
                    },
                    "offline_radar_count": {
                        "offline_radar_count_jc": 29,
                        "offline_radar_count_ts": 22,
                        "offline_radar_count_3d": 0
                    },
                    "new_radar_count": {
                        "new_radar_count_jc": 12,
                        "new_radar_count_ts": 20,
                        "new_radar_count_3d": 0
                    }
                }
            }
        }
    },
    {
        path:'/api/radars',
        method:'POST',
        disable:true,
        response:()=>{
            return radarsData
        }
    },
    {
        path:'/api/weather/wind/latest-radial',
        disable:true,
        method:'POST',
        response:()=>{
            return radialData
        }
    }
]