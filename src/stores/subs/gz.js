export default {
  path: 'gz',
  component: '/src/container.vue',
  redirect: { path: '/gz/synthesis' },
  name:'5e1816a8-f4e1-03dd-c0e5-ba131030e9e7',
  svg:'a042c0df2d3b11ef98d8b025aa2c9ada',
  meta:{
    label:'风雷达组网观测系统',
    roles:['admin','gz']
  },
  children:[
    {
      path:'synthesis',
      name:'8f316b61-96ed-e4ad-6f96-2899833db3b8',
      component:'/src/myComponents/风雷达组网地图相关/index.vue',
      hide:false,
      svg:'16bb869bfba411eeb1e8b025aa2c9ada',
      meta:{
        label:'首页'
      }
    },
    {
      path: 'system',
      name:'aa4619cf-ca3d-ffb1-9781-9fcf73cfa623',
      svg:'7809a650d6c811ee9aafb025aa2c9ada',
      redirect:'/jx/system/device',
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