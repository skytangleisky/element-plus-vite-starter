export default {
  path: 'dev',
  component: '/src/container.vue',
  redirect: { path: '/dev/edit' },
  name:'a0475728-f57d-ef3d-bdd2-78b93b0fb075',
  svg:'7d5f698c1b6511efa02ab025aa2c9ada',
  meta:{
    label:'开发中',
    roles:['admin']
  },
  children:[
    {
      path:'guangheng',
      name:'22254d40-71a3-8406-b0d8-cc9eb3aed11c',
      component:'/src/myComponents/openlayers/index.vue',
      svg:'ccb99649537e11ef8f23b025aa2c9ada',
      replace:true,
      meta:{
        label:'光恒',
      }
    },
    {
      path:'edit',
      name:'12254d40-71a3-8406-b0d8-cc9eb3aed11c',
      component:'/src/myComponents/leftMenu/edit.vue',
      svg:'887ba0af3b3511ee8077b025aa2c9ada',
      replace:true,
      meta:{
        label:'菜单',
      }
    },
    {
      path:'map',
      name:'a7ef7b88-5e6b-0c62-129b-00a18980cdce',
      component:'/src/myComponents/menu/index.vue',
      svg:'8226ee256c6711ee8c80b025aa2c9ada',
      replace:true,
      meta:{
        label:'地图',
      }
    },
    {
      path: 'mapbox',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a38',
      component: '/src/myComponents/mapbox/index.vue',
      svg:'11b6b95281e711ee98afb025aa2c9ada',
      meta:{
        label: 'mapbox',
      }
    },
    {
      path: 'deck',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a36',
      component: '/src/myComponents/deck/index.vue',
      svg:'a69daeed81e611ee98afb025aa2c9ada',
      meta:{
        label: 'openlayers',
      }
    },
    {
      path: 'deck2',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a37',
      component: '/src/myComponents/deck/index2.vue',
      svg:'a69daeed81e611ee98afb025aa2c9ada',
      meta:{
        label: 'openlayers2',
      }
    },
    {
      path: 'fabric',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a39',
      component: '/src/myComponents/fabric/colorPicker.vue',
      svg:'ef5f059d9cb611ee9b6cb025aa2c9ada',
      meta:{
        label: 'fabric',
      }
    },
    {
      path: 'timeline',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a40',
      component: '/src/tools/timeLine.vue',
      svg:'8fc8736b9cb611ee9b6cb025aa2c9ada',
      meta:{
        label: 'timeline',
      }
    },
    {
      path: 'graph',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a41',
      component: '/src/tools/graph.vue',
      svg:'5e38a2e3aaf011eeb80bb025aa2c9ada',
      meta:{
        label: 'graph',
      }
    },
    {
      path: 'test',
      name: 'c4961e04-e574-0e1f-ae23-94f157b14a44',
      component: '/src/myComponents/zrender/test.vue',
      svg:'5e38a2e3aaf011eeb80bb025aa2c9ada',
      meta:{
        label: 'test',
      }
    },
    {
      path: 'audio',
      name: 'c4961e04-e574-0e1f-ae23-94f157b14aae',
      component: '/src/myComponents/audio/index.vue',
      svg:'72ec159c279a11efaeedb025aa2c9ada',
      meta:{
        label: 'audio',
      }
    },
    {
      path: 'zw',
      name: 'c4961e04-e574-0e1f-ae23-94f157b15aae',
      component: '/src/myComponents/组网/pages/synthesis.vue',
      svg:'16bb869bfba411eeb1e8b025aa2c9ada',
      meta:{
        label: '组网',
      }
    },
    {
      path: ':catchAll(.*)*',
      component: '/src/myComponents/404/index.vue',
      hide:true
    },
  ]
}