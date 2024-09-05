export default {
  path: 'jx',
  component: '/src/container.vue',
  redirect: { path: '/jx/synthesis' },
  name:'03fffeab-a3eb-6620-b5da-5ea30242ea16',
  svg:'34fe4ff0-614b-4300-9238-8a8110877919',
  meta:{
    label:'江西无人机',
    roles:['admin','jx']
  },
  children:[
    {
      path:'radar',
      name:'0c183c95-53a1-24a4-e9a4-ce4e9b5b092e',
      // component:'/src/myComponents/radar/index.vue',
      component:'/src/myComponents/激光测风尾涡/index.vue',
      hide:false,
      svg:'0548488e-3d6b-44a6-852c-95736ae5369b',
      meta:{
        label:'雷达',
      }
    },
    {
      path:'networking',
      name:'eeade068-4287-5f5b-fced-ecb15aa8c8d6',
      component:'/src/myComponents/组网/pages/synthesis.vue',
      hide:false,
      svg:'ea65786f-6312-47dd-a16a-0f902147ccc4',
      meta:{
        label:'组网',
      }
    },
    {
      path: 'openlayers',
      name: 'fd505761-b842-b847-7592-3e9f2d416976',
      // component:'/src/myComponents/openlayers/radarStatistic.vue'
      // component:'/src/myComponents/menu/index.vue'
      component:'/src/myComponents/openlayers/index.vue',
      hide:true,
      svg:'44785b4a-0b7e-40b5-8302-30a734b010aa',
      meta:{
        label:'openlayers',
      }
    },
    {
      path: 'synthesis',
      name: 'e1bdfebe-bda1-0c0b-ae31-800abb0cad54',
      // component:'/src/myComponents/openlayers/radarStatistic.vue'
      // component:'/src/myComponents/menu/index.vue'
      component:'/src/myComponents/无人机/pages/synthesis.vue',
      svg:'856f3482-bd27-4037-8f66-e0ab6cd93470',
      meta:{
        label:'综合监控',
      }
    },
    {
      path: 'history',
      name: 'ab1af087-71a6-fe4a-0870-0d4065530108',
      // component:'/src/myComponents/openlayers/radarStatistic.vue'
      // component:'/src/myComponents/menu/index.vue'
      component:'/src/myComponents/无人机/pages/playback.vue',
      svg:'026f2a18-66d5-4473-b912-f0b47294ea48',
      meta:{
        label:'历史回放',
      }
    },
    {
      path: 'zrender',
      name: '34945ae8-23cb-21af-4ace-ca3520b25283',
      component: '/src/myComponents/zrender/demo.vue',
      svg:'c7cbf623-7172-4238-84e0-f70323c60b4f',
      hide:true,
      meta:{
        label: 'zrender',
      }
    },
    {
      path: 'record',
      name: '321e5a4f-9383-44c2-09a2-fb8ca1e13604',
      component: '/src/myComponents/datatable/index.vue',
      svg:'5ab27696-c933-43df-82e7-78b462786fcb',
      meta:{
        label: '备案查询',
      }
    },
    {
      path: 'statistic',
      name: '5fbee549-480d-d763-2b95-135c2b65e668',
      // component:'/src/myComponents/openlayers/radarStatistic.vue'
      // component:'/src/myComponents/menu/index.vue'
      component: '/src/myComponents/datatable/index.vue',
      svg:'79fa25bd-4f1a-43b4-8c90-af244e9355c0',
      meta:{
        label:'数据统计',
      }
    },
    {
      path: 'system',
      name:'aa4619cf-ca3d-ffb1-9781-9fcf73cfa67d',
      svg:'a84b644c-3d09-47eb-afe4-d2253009be32',
      redirect:'/jx/system/device',
      meta:{
        label:'系统管理',
      },
      children:[
        {
          path: 'device',
          name: '96d46e00-9c83-1ae9-767b-61db8f85c70e',
          component: '/src/myComponents/datatable/index.vue',
          svg:'03f0e112-0e54-41dc-8fdc-b25fd5e2929f',
          meta:{
            label: '反无设备详情',
          }
        },
        {
          path: 'simulate',
          name: 'd03e26a9-5ce6-ce27-18d8-26f2cda7db9b',
          component:'/src/myComponents/无人机/pages/simulate.vue',
          svg:'3d2aecf6-7d17-41a2-8b97-c15f43813388',
          meta:{
            label: '设备布防模拟',
          }
        },
        {
          path: 'airspace',
          name: '3d011adf-2e74-5735-7124-71e143e5809f',
          component: '/src/myComponents/无人机/pages/edit.vue',
          svg:'693b2dd8-61df-4fd7-892a-9c9deb07a24c',
          meta:{
            label: '禁飞区管理',
          }
        },
        {
          path: 'whitelist',
          name: 'a320d87b-d112-7ce8-7242-73499662981e',
          component: '/src/myComponents/datatable/index.vue',
          svg:'9169cfd9-2ad7-4977-b497-d6a2cc8d8e43',
          meta:{
            label: '白名单管理',
          }
        },
      ]
    },
    {
      path: 'user',
      name:'8c9f0073-882c-4582-77b2-98ca8c7f77f6',
      svg:'3b0f177b-c447-40c2-8c55-ef2b31fddc63',
      redirect:'/jx/user/person',
      meta:{
        label:'用户管理',
      },
      children:[
        {
          path: 'person',
          name: 'e90e7636-3a29-09b5-106d-7db7ff8c04ea',
          component: '/src/myComponents/datatable/index.vue',
          svg:'c5d6b97c-ce09-4576-a717-d73438c5fa8f',
          meta:{
            label: '个人用户',
          }
        },
        {
          path: 'enterprise',
          name: 'd2fc8121-da16-0b5d-c2d1-70ad66241163',
          component: '/src/myComponents/datatable/index.vue',
          svg:'b54d20aa-a29a-463b-b139-f067fa59e184',
          meta:{
            label: '企业用户',
          }
        },
      ]
    },
    {
      path: 'permission',
      name:'1fb3cbd6-7945-716a-efc6-6169ed171a4f',
      svg:'db142aef-65f8-4096-a62d-e3e0954b59b0',
      redirect:'/jx/permission/administrator',
      meta:{
        label:'权限管理',
      },
      children:[
        {
          path: 'administrator',
          name: 'edb5eefe-4642-ca1d-d30a-fed81a236e6a',
          component: '/src/myComponents/datatable/index.vue',
          svg:'6b09e158-0e68-4e66-8607-b29862c747b2',
          meta:{
            label: '系统用户管理',
          }
        },
        {
          path: 'group',
          name: '33c97aaa-2e88-6776-94e9-f443fad0bc04',
          component: '/src/myComponents/datatable/group.vue',
          svg:'044f2a31-6d21-4684-901b-6faaa8f49f73',
          meta:{
            label: '用户组管理',
          }
        },
        {
          path: 'institution',
          name: '9df09828-9a95-4505-8b04-afdb29252c35',
          component: '/src/myComponents/datatable/institution.vue',
          svg:'a3e29e8d-2620-4f14-87b1-928cc1ff3625',
          meta:{
            label: '机构管理',
          }
        },
      ]
    },
    {
      path:'graph',
      name:'e4cb7df7-bc73-5966-46db-389f927f3e98',
      component:'/src/myComponents/echarts/图.vue',
      hide:false,
      svg:'ec24142a-78ac-4b58-9e4d-44d3e6c07835',
      meta:{
        label:'无向图',
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