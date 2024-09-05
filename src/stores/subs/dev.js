export default {
  path: 'dev',
  component: '/src/container.vue',
  redirect: { path: '/dev/edit' },
  name:'a0475728-f57d-ef3d-bdd2-78b93b0fb075',
  svg:'0f1bf912-27b9-42f6-acce-56daa1c39aa9',
  meta:{
    label:'开发中',
    roles:['admin']
  },
  children:[
    {
      path:'nps',
      name:'22254d40-71a3-8406-b0d8-cc9eb3aed1ef',
      component:'/src/myComponents/echarts/nps.vue',
      svg:'8e6c2a2d-0a6c-4884-bad4-9ad18a1bd04a',
      replace:true,
      meta:{
        label:'NPS',
      }
    },
    {
      path:'guangheng',
      name:'22254d40-71a3-8406-b0d8-cc9eb3aed11c',
      component:'/src/myComponents/openlayers/index.vue',
      svg:'6cf561a7-4042-40b5-9d87-3101e638103d',
      replace:true,
      meta:{
        label:'光恒',
      }
    },
    {
      path:'edit',
      name:'12254d40-71a3-8406-b0d8-cc9eb3aed11c',
      component:'/src/myComponents/leftMenu/edit.vue',
      svg:'620d1f40-e30b-405a-a1d2-f19308ec61b5',
      replace:true,
      meta:{
        label:'菜单',
      }
    },
    {
      path:'map',
      name:'a7ef7b88-5e6b-0c62-129b-00a18980cdce',
      component:'/src/myComponents/menu/index.vue',
      svg:'0548488e-3d6b-44a6-852c-95736ae5369b',
      replace:true,
      meta:{
        label:'地图',
      }
    },
    {
      path: 'mapbox',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a38',
      component: '/src/myComponents/mapbox/index.vue',
      svg:'d1b871bc-5d56-468a-a5c3-d38448b40355',
      meta:{
        label: 'mapbox',
      }
    },
    {
      path: 'deck',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a36',
      component: '/src/myComponents/deck/index.vue',
      svg:'a89b378c-0ef9-4555-9780-4ae91c950331',
      meta:{
        label: 'openlayers',
      }
    },
    {
      path: 'deck2',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a37',
      component: '/src/myComponents/deck/index2.vue',
      svg:'a89b378c-0ef9-4555-9780-4ae91c950331',
      meta:{
        label: 'openlayers2',
      }
    },
    {
      path: 'fabric',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a39',
      component: '/src/myComponents/fabric/colorPicker.vue',
      svg:'9ffec82c-157a-4944-a26e-b6db68f90fc0',
      meta:{
        label: 'fabric',
      }
    },
    {
      path: 'timeline',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a40',
      component: '/src/tools/timeLine.vue',
      svg:'0f59128a-9003-4656-b0ad-26c9e646f58d',
      meta:{
        label: 'timeline',
      }
    },
    {
      path: 'graph',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a41',
      component: '/src/tools/graph.vue',
      svg:'c7cbf623-7172-4238-84e0-f70323c60b4f',
      meta:{
        label: 'graph',
      }
    },
    {
      path: 'test',
      name: 'c4961e04-e574-0e1f-ae23-94f157b14a44',
      component: '/src/myComponents/zrender/test.vue',
      svg:'c7cbf623-7172-4238-84e0-f70323c60b4f',
      meta:{
        label: 'test',
      }
    },
    {
      path: 'audio',
      name: 'c4961e04-e574-0e1f-ae23-94f157b14aae',
      component: '/src/myComponents/audio/index.vue',
      svg:'a3b9f93b-4d19-4cfd-a62b-28cb5a16d2fa',
      meta:{
        label: 'audio',
      }
    },
    {
      path: 'zw',
      name: 'c4961e04-e574-0e1f-ae23-94f157b15aae',
      component: '/src/myComponents/组网/pages/synthesis.vue',
      svg:'ec24142a-78ac-4b58-9e4d-44d3e6c07835',
      meta:{
        label: '组网',
      }
    },
    {
      path: ':catchAll(.*)*',
      component: '/src/myComponents/404/index.vue',
      svg:"bbb9fe5b-65b3-4f0c-83e1-c35389b09516",
      hide:true,
      meta:{
        label: '404'
      }
    },
  ]
}