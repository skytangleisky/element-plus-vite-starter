export default {
  path: 'cq',
  component: '/src/container.vue',
  redirect: { path: '/cq/synthesis' },
  name:'5e1816a8-f4e1-a3dd-c0e5-ba131030e9e7',
  svg:'0b3ea739-0894-490c-9101-c5284f46010a',
  meta:{
    label:'重庆测风激光雷达组网系统',
    roles:['admin','cq','device']
  },
  children:[
    {
      path:'synthesis',
      name:'8f316b61-96ed-e4ad-6f96-2899833db3b8',
      component:'/src/myComponents/风雷达组网地图相关/index.vue',
      hide:false,
      svg:'ec24142a-78ac-4b58-9e4d-44d3e6c07835',
      meta:{
        label:'组网观测'
      }
    },
    {
      path:'device',
      name:'8f316b61-96ed-e4ad-6f96-3899833db3b8',
      hide:false,
      svg:'026f2a18-66d5-4473-b912-f0b47294ea48',
      meta:{
        label:'历史数据'
      },
      children:[
        {
          path: 'A6418',
          name: 'da20fee1-5ad7-51e1-2789-5e0933011f11',
          component: '/src/myComponents/风雷达组网/pages/A6418.vue',
          meta:{
            label: '渝北激光测风雷达',
          }
        },
        {
          path: 'A6419',
          name: 'da20fee1-5ad7-51e1-2788-5e0933011a11',
          component: '/src/myComponents/风雷达组网/pages/A6419.vue',
          meta:{
            label: '北碚激光测风雷达',
          }
        },
        {
          path: 'A6420',
          name: 'da20fee1-5ad7-51e1-2787-5e0933011a11',
          component: '/src/myComponents/风雷达组网/pages/A6420.vue',
          meta:{
            label: '巴南激光测风雷达',
          }
        },
        {
          path: 'A6421',
          name: 'da20fee1-5ad7-5111-2787-5e0933011a11',
          component: '/src/myComponents/风雷达组网/pages/A6421.vue',
          meta:{
            label: '綦江激光测风雷达',
          }
        },
        {
          path: 'A6422',
          name: 'da20fee1-5ad7-5121-2787-5e0933011a11',
          component: '/src/myComponents/风雷达组网/pages/A6422.vue',
          meta:{
            label: '万州激光测风雷达',
          }
        },
        {
          path: 'A6423',
          name: 'da20fee1-5ad7-5131-2787-5e0933011a11',
          component: '/src/myComponents/风雷达组网/pages/A6423.vue',
          meta:{
            label: '城口激光测风雷达',
          }
        },
      ]
    },
    {
      path: 'system',
      name:'aa4619cf-ca3d-ffb1-9781-afcf73cfa623',
      svg:'a84b644c-3d09-47eb-afe4-d2253009be32',
      redirect:'/cq/system/person',
      meta:{
        label:'系统管理',
        roles:['admin','cq']
      },
      children:[
        {
          path: 'person',
          name: 'da20fee1-5ad7-51e1-2768-5e0933011f11',
          component: '/src/myComponents/风雷达组网/pages/用户管理.vue',
          svg:'c5d6b97c-ce09-4576-a717-d73438c5fa8f',
          meta:{
            label: '用户管理',
          }
        },
        {
          path: 'device',
          name: 'da20fee1-5ad7-51e1-2768-5e0933011a11',
          component: '/src/myComponents/风雷达组网/pages/设备管理.vue',
          svg:'2e27a8c4-17b8-4fe3-bfd5-afdc95a38741',
          meta:{
            label: '设备管理',
          }
        },
        {
          path: 'device2',
          name: 'da20fee1-5ad7-51e1-2768-5e0933011b11',
          component: '/src/myComponents/风雷达组网/pages/设备管理新.vue',
          svg:'2e27a8c4-17b8-4fe3-bfd5-afdc95a38741',
          meta:{
            label: '设备管理新',
            roles:['admin']
          }
        },
        // {
        //   path: 'status',
        //   name: 'da20fee1-5ad7-51e1-2754-5e0933011a11',
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
      svg:"bbb9fe5b-65b3-4f0c-83e1-c35389b09516",
      hide:true,
      meta:{
        label:'404'
      }
    },
  ]
}