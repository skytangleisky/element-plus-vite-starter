export default {
  path: 'shanxi',
  component: '/src/container.vue',
  // redirect: { path: '/cq/synthesis' },
  name:'5e1816a8-f4e1-a3dd-c0e5-1a131030e9e7',
  svg:'0b3ea739-0894-490c-9101-c5284f46010a',
  meta:{
    label:'山西测风雷达组网系统',
    roles:['admin','shanxi_device','shanxi_forecast']
  },
  children:[
    {
      path:'shanxi_forecast',
      name:'8f316b61-96ed-e4ad-6f96-18a9833da3b8',
      component:'/src/myComponents/fragment/气象预报员.vue',
      svg:'ec24142a-78ac-4b58-9e4d-44d3e6c07835',
      meta:{
        label:'组网观测(气象预报员)',
        roles:['shanxi_forecast']
      }
    },
    {
      path:'shanxi_device',
      name:'8f316b61-96ed-e4ad-6f96-389b833da3b8',
      component:'/src/myComponents/fragment/设备管理员.vue',
      svg:'ec24142a-78ac-4b58-9e4d-44d3e6c07835',
      meta:{
        label:'组网观测(设备管理员)',
        roles:['shanxi_device']
      }
    },
    // {
    //   path:'synthesis',
    //   name:'8f316b61-96ed-e4ff-6f96-5899833de3b8',
    //   component:'/src/myComponents/风雷达组网地图相关/index.vue',
    //   hide:false,
    //   svg:'ec24142a-78ac-4b58-9e4d-44d3e6c07835',
    //   meta:{
    //     label:'组网观测'
    //   }
    // },
    {
      path:'deviceManage',
      name:'8f316b61-96ed-e4ad-6f96-7899833db3b8',
      hide:false,
      svg:'2e27a8c4-17b8-4fe3-bfd5-afdc95a38741',
      meta:{
        label:'设备管理'
      },
      children:[
        {
          path: 'device',
          name: 'da20fee1-5ad7-51e1-2789-8e0933011f11',
          component: '/src/myComponents/设备管理/radar.vue',
          meta:{
            label: '雷达管理',
          }
        },
        {
          path: 'sensor',
          name: 'da20fee1-5ad7-51e1-2788-9e0933011a11',
          component: '/src/myComponents/设备管理/sensor.vue',
          meta:{
            label: 'Sensor数据',
          }
        },
        {
          path: 'deviceStatus',
          name: 'da20fee1-5ad7-51e1-2787-3e0933011a11',
          component: '/src/myComponents/设备管理/deviceStatus.vue',
          meta:{
            label: '设备数据状态',
          }
        },
        {
          path: 'datafile',
          name: 'da20fee1-5ad7-5111-2787-2e0933011a11',
          component: '/src/myComponents/设备管理/datafile.vue',
          meta:{
            label: '数据文件',
          }
        },
        {
          path: 'deviceType',
          name: 'da20fee1-5ad7-5121-2787-1e0933011a11',
          component: '/src/myComponents/设备管理/deviceType.vue',
          meta:{
            label: '设备类型',
          }
        },
      ]
    },
    {
      path: 'system',
      name:'aa4619cf-ca3d-ffb1-9781-1fcf73cfa623',
      svg:'a84b644c-3d09-47eb-afe4-d2253009be32',
      redirect:'/cq/system/person',
      meta:{
        label:'系统管理',
        roles:['admin','cq']
      },
      children:[
        {
          path: 'person',
          name: 'da20fee1-5ad7-51e1-4768-5e0933011f11',
          component: '/src/myComponents/风雷达组网/pages/用户管理.vue',
          svg:'c5d6b97c-ce09-4576-a717-d73438c5fa8f',
          meta:{
            label: '用户管理',
          }
        },
        {
          path: 'device',
          name: 'da20fee1-5ad7-51e1-2768-900933011a11',
          component: '/src/myComponents/风雷达组网/pages/设备管理.vue',
          svg:'2e27a8c4-17b8-4fe3-bfd5-afdc95a38741',
          meta:{
            label: '设备管理',
          }
        },
        {
          path: 'device2',
          name: 'da20fee1-5ad7-51e1-2768-ee0933011b11',
          component: '/src/myComponents/风雷达组网/pages/设备管理新.vue',
          svg:'2e27a8c4-17b8-4fe3-bfd5-afdc95a38741',
          meta:{
            label: '设备管理新',
            roles:['admin']
          }
        },
        // {
        //   path: 'status',
        //   name: 'da20fee1-5ad7-51e1-2754-fe0933011a11',
        //   component: '/src/myComponents/风雷达组网/pages/状态管理.vue',
        //   svg:'b7741b77-afe3-4ceb-bdec-dbefdc570f07',
        //   meta:{
        //     label: '状态管理',
        //   }
        // },
      ]
    },
    {
      path: ':catchAll(.*)*',
      component: '/src/myComponents/404/index.vue',
      svg:"bbb9fe5b-65b3-4f0c-83e1-ee5389b09516",
      hide:true,
      meta:{
        label:'404'
      }
    },
  ]
}