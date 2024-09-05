export default {
  path: 'ry',
  component: '/src/container.vue',
  redirect: { path: '/ry/synthesis' },
  name:'65e99b66-e340-4d4b-6b26-629f41dc63d9',
  svg:'1a16412c-a6e1-4e8f-8eb5-d8676894a405',
  meta:{
    label:'北京人影',
    roles:['admin','ry']
  },
  children:[
    {
      path:'synthesis',
      name:'b7ef7b88-5e6b-0c62-129b-a0a18980cd11',
      component:'/src/myComponents/人影/pages/synthesis.vue',
      hide:false,
      svg:'0ca86c9c-7cf8-4ffa-8b38-82bf6771c25f',
      meta:{
        label:'首页'
      }
    },
    {
      path: 'person',
      name: 'c4961e01-e571-0e1f-ae23-94f157b15a45',
      component: '/src/myComponents/人影/pages/用户管理.vue',
      svg:'c5d6b97c-ce09-4576-a717-d73438c5fa8f',
      meta:{
        label: '用户管理',
      }
    },
    {
      path: 'unit',
      name: 'c4961e04-e571-0e1f-ae23-94f157b15a45',
      component: '/src/myComponents/人影/pages/单位管理.vue',
      svg:'0d0fd3b2-2240-41e7-b5f6-b92b75e03033',
      meta:{
        label: '单位管理',
      }
    },
    {
      path: 'zyd',
      name: 'b996f034-027d-839b-e572-c4f490a83b27',
      component: '/src/myComponents/人影/pages/作业点管理.vue',
      svg:'9b616fe5-6cc2-49c9-b48d-51205ca5a647',
      meta:{
        label: '作业点管理',
      }
    },
    {
      path: 'zyddata',
      name: '6449e08e-e597-153f-6c0c-5f9711fe365c',
      component: '/src/myComponents/人影/pages/作业申请.vue',
      svg:'0f75f52e-7a77-472f-84ae-62d3e3bfb140',
      meta:{
        label: '作业申请',
      }
    },
    {
      path: 'zydhisdata',
      name: 'aa5334ee-05a4-e2c8-1568-45924ba46875',
      component: '/src/myComponents/人影/pages/作业历史.vue',
      svg:'026f2a18-66d5-4473-b912-f0b47294ea48',
      meta:{
        label: '作业历史',
      }
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