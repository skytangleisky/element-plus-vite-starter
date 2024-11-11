export default {
  name:'16d44138-0721-49cf-8f32-49c6894512bd',
  meta:{
    label:'重庆测风激光雷达组网系统',
    roles:['admin','cq','device']
  },
  children:[
    {
      name:'1c04da9a-a6ab-47c0-b1a4-17358fd4f3bc',
      meta:{
        label:'预报员管理界面',
      },
      children:[
        {
          name:'da4ce7c7-3aa9-4b9b-8d8b-ce44241794d5',
          checked:true,
          meta:{
            label:'重庆组网PPI',
          }
        },
        {
          name: 'e44f37e1-f642-4dbf-83ca-052313b217f5',
          checked:false,
          meta:{
            label: '重庆组网时间轴',
          }
        },
        {
          name: '5dd862f4-112f-46cf-a843-98c3f5aba1cf',
          checked:false,
          meta:{
            label: '重庆组网界面-数据融合-格点',
          }
        },
        {
          name: 'df127f84-1983-42c1-b718-a0d04fc92720',
          checked:false,
          meta:{
            label: '重庆组网界面-数据融合-等值线',
          }
        },
        {
          name: '182392d2-6928-4add-b006-784e9fde0213',
          checked:false,
          meta:{
            label: '重庆组网界面-数据融合-等值线填充',
          }
        },
      ]
    },
    {
      name:'a8770e03-f89f-4028-8722-2da301207da6',
      meta:{
        label:'设备管理员界面',
      },
      children:[
        {
          name:'808b579e-e069-4435-bc85-11f7209c4eb6',
          checked:true,
          meta:{
            label:'告警',
          }
        },
        {
          name: 'a3a27c58-660f-4d14-a582-6817de2d5079',
          checked:false,
          meta:{
            label: '设置',
          }
        },
        {
          name: 'f46f5668-75ab-40a4-a578-da2b61c3ed95',
          checked:false,
          meta:{
            label: '菜单',
          }
        }
      ]
    },
  ]
}