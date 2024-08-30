export default {
  path: 'ry',
  component: '/src/container.vue',
  redirect: { path: '/ry/synthesis' },
  name:'65e99b66-e340-4d4b-6b26-629f41dc63d9',
  svg:'cf769a7bf9c011eeb2f4b025aa2c9ada',
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
      svg:'45a839fb02a411efb1e8b025aa2c9ada',
      meta:{
        label:'首页'
      }
    },
    {
      path: 'person',
      name: 'c4961e01-e571-0e1f-ae23-94f157b15a45',
      component: '/src/myComponents/人影/pages/用户管理.vue',
      svg:'f11a18a8d6c711ee9aafb025aa2c9ada',
      meta:{
        label: '用户管理',
      }
    },
    {
      path: 'unit',
      name: 'c4961e04-e571-0e1f-ae23-94f157b15a45',
      component: '/src/myComponents/人影/pages/单位管理.vue',
      svg:'7fad66a315db11efb644b025aa2c9ada',
      meta:{
        label: '单位管理',
      }
    },
    {
      path: 'zyd',
      name: 'b996f034-027d-839b-e572-c4f490a83b27',
      component: '/src/myComponents/人影/pages/作业点管理.vue',
      svg:'5202c4ea15dd11efb644b025aa2c9ada',
      meta:{
        label: '作业点管理',
      }
    },
    {
      path: 'zyddata',
      name: '6449e08e-e597-153f-6c0c-5f9711fe365c',
      component: '/src/myComponents/人影/pages/作业申请.vue',
      svg:'f103820918a311efb644b025aa2c9ada',
      meta:{
        label: '作业申请',
      }
    },
    {
      path: 'zydhisdata',
      name: 'aa5334ee-05a4-e2c8-1568-45924ba46875',
      component: '/src/myComponents/人影/pages/作业历史.vue',
      svg:'64ee8f0418a311efb644b025aa2c9ada',
      meta:{
        label: '作业历史',
      }
    },
    {
      path: ':catchAll(.*)*',
      component: '/src/myComponents/404/index.vue',
      hide:true,
      meta:{
        label:'404'
      }
    },
  ]
}