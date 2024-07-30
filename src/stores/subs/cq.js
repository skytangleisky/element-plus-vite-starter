export default {
  path: 'cq',
  component: '/src/container.vue',
  redirect: { path: '/cq/synthesis' },
  name:'5e1816a8-f4e1-a3dd-c0e5-ba131030e9e7',
  svg:'f7f96575383611efb04bb025aa2c9ada',
  meta:{
    label:'重庆测风激光雷达组网系统',
    roles:['admin','cq']
  },
  children:[
    {
      path:'synthesis',
      name:'8f316b61-96ed-e4ad-6f96-2899833db3b8',
      component:'/src/myComponents/风雷达组网地图相关/index.vue',
      hide:false,
      svg:'16bb869bfba411eeb1e8b025aa2c9ada',
      meta:{
        label:'组网观测'
      }
    },
    {
      path:'device',
      name:'8f316b61-96ed-e4ad-6f96-3899833db3b8',
      hide:false,
      svg:'97d8a6d93ab711ee8077b025aa2c9ada',
      meta:{
        label:'单站产品'
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
      svg:'7809a650d6c811ee9aafb025aa2c9ada',
      redirect:'/cq/system/person',
      meta:{
        label:'系统管理',
      },
      children:[
        {
          path: 'person',
          name: 'da20fee1-5ad7-51e1-2768-5e0933011f11',
          component: '/src/myComponents/风雷达组网/pages/用户管理.vue',
          svg:'f11a18a8d6c711ee9aafb025aa2c9ada',
          meta:{
            label: '用户管理',
          }
        },
        {
          path: 'device',
          name: 'da20fee1-5ad7-51e1-2768-5e0933011a11',
          component: '/src/myComponents/风雷达组网/pages/单站管理.vue',
          svg:'91e315392d3d11ef98d8b025aa2c9ada',
          meta:{
            label: '单站管理',
          }
        },
      ]
    },
    {
      path: ':catchAll(.*)*',
      component: '/src/myComponents/404/index.vue',
      hide:true
    },
  ]
}