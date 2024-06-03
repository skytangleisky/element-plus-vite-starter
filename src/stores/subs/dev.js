export default {
  path: 'dev',
  component: '/src/container.vue',
  redirect: { path: '/dev/synthesis' },
  name:'a0475728-f57d-ef3d-bdd2-78b93b0fb075',
  label:'开发中',
  svg:'7d5f698c1b6511efa02ab025aa2c9ada',
  meta:{
    roles:['admin']
  },
  children:[
    {
      path:'edit',
      name:'12254d40-71a3-8406-b0d8-cc9eb3aed11c',
      component:'/src/myComponents/leftMenu/edit.vue',
      label:'菜单',
      svg:'887ba0af3b3511ee8077b025aa2c9ada',
      replace:true,
    },
    {
      path:'map',
      name:'a7ef7b88-5e6b-0c62-129b-00a18980cdce',
      component:'/src/myComponents/menu/index.vue',
      label:'地图',
      svg:'8226ee256c6711ee8c80b025aa2c9ada',
      replace:true,
    },
    {
      path: ':catchAll(.*)*',
      component: '/src/myComponents/404/index.vue',
      hide:true
    },
  ]
}