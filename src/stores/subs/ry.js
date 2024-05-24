export default {
  path: 'ry',
  component: '/src/container.vue',
  redirect: { path: '/ry/synthesis' },
  name:'65e99b66-e340-4d4b-6b26-629f41dc63d9',
  label:'北京人影',
  svg:'cf769a7bf9c011eeb2f4b025aa2c9ada',
  meta:{
    roles:['admin','ry']
  },
  children:[
    {
      path:'synthesis',
      name:'b7ef7b88-5e6b-0c62-129b-a0a18980cd11',
      component:'/src/myComponents/人影/pages/synthesis.vue',
      label:'首页',
      hide:false,
      svg:'45a839fb02a411efb1e8b025aa2c9ada',
    },
    {
      path: 'person',
      name: 'c4961e01-e571-0e1f-ae23-94f157b15a45',
      component: '/src/myComponents/人影/pages/用户管理.vue',
      label: '用户管理',
      svg:'f11a18a8d6c711ee9aafb025aa2c9ada'
    },
    {
      path: 'unit',
      name: 'c4961e04-e571-0e1f-ae23-94f157b15a45',
      component: '/src/myComponents/人影/pages/单位管理.vue',
      label: '单位管理',
      svg:'7fad66a315db11efb644b025aa2c9ada'
    },
    {
      path: 'zyd',
      name: 'b996f034-027d-839b-e572-c4f490a83b27',
      component: '/src/myComponents/人影/pages/作业点管理.vue',
      label: '作业点管理',
      svg:'5202c4ea15dd11efb644b025aa2c9ada'
    },
    {
      path: 'zyddata',
      name: '6449e08e-e597-153f-6c0c-5f9711fe365c',
      component: '/src/myComponents/人影/pages/作业申请.vue',
      label: '作业申请',
      svg:'f103820918a311efb644b025aa2c9ada'
    },
    {
      path: 'zydhisdata',
      name: 'aa5334ee-05a4-e2c8-1568-45924ba46875',
      component: '/src/myComponents/人影/pages/作业历史.vue',
      label: '作业历史',
      svg:'64ee8f0418a311efb644b025aa2c9ada'
    },
    {
      path: ':catchAll(.*)*',
      component: '/src/myComponents/404/index.vue',
      hide:true
    },
  ]
}