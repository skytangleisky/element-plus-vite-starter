export default {
  path: 'jx',
  component: '/src/container.vue',
  // redirect: { path: '/jx/synthesis' },
  name:'03fffeab-a3eb-6620-b5da-5ea30242ea16',
  label:'江西无人机',
  svg:'11960bb6f9c111eeb2f4b025aa2c9ada',
  meta:{
    roles:['admin','jx']
  },
  children:[
    {
      path:'radar',
      name:'0c183c95-53a1-24a4-e9a4-ce4e9b5b092e',
      // component:'/src/myComponents/radar/index.vue',
      component:'/src/myComponents/激光测风尾涡/index.vue',
      label:'雷达',
      hide:false,
      svg:'8226ee256c6711ee8c80b025aa2c9ada',
    },
    {
      path:'networking',
      name:'eeade068-4287-5f5b-fced-ecb15aa8c8d6',
      component:'/src/myComponents/组网/pages/synthesis.vue',
      label:'组网',
      hide:false,
      svg:'4441a5b002a511efb1e8b025aa2c9ada',
    },
    {
      path:'map',
      name:'f5318f87-54bf-1f97-a2ce-ca432333e1b1',
      component:'/src/myComponents/menu/index.vue',
      label:'地图',
      hide:false,
      svg:'8226ee256c6711ee8c80b025aa2c9ada',
    },
    {
      path:'edit',
      name:'5cf4f06a-ff71-c646-40a4-1d4ea4159cdf',
      component:'/src/myComponents/leftMenu/edit.vue',
      label:'菜单',
      hide:true,
      svg:'887ba0af3b3511ee8077b025aa2c9ada',
    },
    {
      path: 'openlayers',
      name: 'fd505761-b842-b847-7592-3e9f2d416976',
      // component:'/src/myComponents/openlayers/radarStatistic.vue'
      // component:'/src/myComponents/menu/index.vue'
      component:'/src/myComponents/openlayers/index.vue',
      hide:true,
      label:'openlayers',
      svg:'4db7562c3aa011ee8077b025aa2c9ada',
    },
    {
      path: 'synthesis',
      name: 'e1bdfebe-bda1-0c0b-ae31-800abb0cad54',
      // component:'/src/myComponents/openlayers/radarStatistic.vue'
      // component:'/src/myComponents/menu/index.vue'
      component:'/src/myComponents/无人机/pages/synthesis.vue',
      label:'综合监控',
      svg:'66ef0fa1d6cc11ee9aafb025aa2c9ada',
    },
    {
      path: 'history',
      name: 'ab1af087-71a6-fe4a-0870-0d4065530108',
      // component:'/src/myComponents/openlayers/radarStatistic.vue'
      // component:'/src/myComponents/menu/index.vue'
      component:'/src/myComponents/无人机/pages/playback.vue',
      label:'历史回放',
      svg:'42a4578ed6cd11ee9aafb025aa2c9ada',
    },
    {
      path: 'zrender',
      name: '34945ae8-23cb-21af-4ace-ca3520b25283',
      component: '/src/myComponents/zrender/demo.vue',
      label: 'zrender',
      svg:'5e38a2e3aaf011eeb80bb025aa2c9ada',
      hide:true,
    },
    {
      path: 'record',
      name: '321e5a4f-9383-44c2-09a2-fb8ca1e13604',
      component: '/src/myComponents/datatable/index.vue',
      label: '备案查询',
      svg:'18821b0ad6cb11ee9aafb025aa2c9ada'
    },
    {
      path: 'statistic',
      name: '5fbee549-480d-d763-2b95-135c2b65e668',
      // component:'/src/myComponents/openlayers/radarStatistic.vue'
      // component:'/src/myComponents/menu/index.vue'
      component: '/src/myComponents/datatable/index.vue',
      label:'数据统计',
      svg:'a2a749dfd6ca11ee9aafb025aa2c9ada',
    },
    {
      path: 'system',
      name:'aa4619cf-ca3d-ffb1-9781-9fcf73cfa67d',
      label:'系统管理',
      svg:'7809a650d6c811ee9aafb025aa2c9ada',
      children:[
        {
          path: 'device',
          name: '96d46e00-9c83-1ae9-767b-61db8f85c70e',
          component: '/src/myComponents/datatable/index.vue',
          label: '反无设备详情',
          svg:'2133405ad6ca11ee9aafb025aa2c9ada'
        },
        {
          path: 'simulate',
          name: 'd03e26a9-5ce6-ce27-18d8-26f2cda7db9b',
          component:'/src/myComponents/无人机/pages/simulate.vue',
          label: '设备布防模拟',
          svg:'8bdc8331d6c911ee9aafb025aa2c9ada'
        },
        {
          path: 'airspace',
          name: '3d011adf-2e74-5735-7124-71e143e5809f',
          component: '/src/myComponents/无人机/pages/edit.vue',
          label: '禁飞区管理',
          svg:'fb9ca5f8d6c811ee9aafb025aa2c9ada'
        },
        {
          path: 'whitelist',
          name: 'a320d87b-d112-7ce8-7242-73499662981e',
          component: '/src/myComponents/datatable/index.vue',
          label: '白名单管理',
          svg:'41416b3ed6c911ee9aafb025aa2c9ada'
        },
      ]
    },
    {
      path: 'user',
      name:'8c9f0073-882c-4582-77b2-98ca8c7f77f6',
      label:'用户管理',
      svg:'b9cef812d6c711ee9aafb025aa2c9ada',
      children:[
        {
          path: 'person',
          name: 'e90e7636-3a29-09b5-106d-7db7ff8c04ea',
          component: '/src/myComponents/datatable/index.vue',
          label: '个人用户',
          svg:'f11a18a8d6c711ee9aafb025aa2c9ada'
        },
        {
          path: 'enterprise',
          name: 'd2fc8121-da16-0b5d-c2d1-70ad66241163',
          component: '/src/myComponents/datatable/index.vue',
          label: '企业用户',
          svg:'20a7ae2bd6c811ee9aafb025aa2c9ada'
        },
      ]
    },
    {
      path: 'permission',
      name:'1fb3cbd6-7945-716a-efc6-6169ed171a4f',
      label:'权限管理',
      svg:'3c94a7e5d6c611ee9aafb025aa2c9ada',
      children:[
        {
          path: 'administrator',
          name: 'edb5eefe-4642-ca1d-d30a-fed81a236e6a',
          component: '/src/myComponents/datatable/index.vue',
          label: '系统用户管理',
          svg:'6a190295d6c711ee9aafb025aa2c9ada'
        },
        {
          path: 'group',
          name: '33c97aaa-2e88-6776-94e9-f443fad0bc04',
          component: '/src/myComponents/datatable/group.vue',
          label: '用户组管理',
          svg:'e5fc96bfd6c611ee9aafb025aa2c9ada'
        },
        {
          path: 'institution',
          name: '9df09828-9a95-4505-8b04-afdb29252c35',
          component: '/src/myComponents/datatable/institution.vue',
          label: '机构管理',
          svg:'2e727627d6c711ee9aafb025aa2c9ada'
        },
      ]
    },
    {
      path:'graph',
      name:'e4cb7df7-bc73-5966-46db-389f927f3e98',
      component:'/src/myComponents/echarts/图.vue',
      label:'无向图',
      hide:false,
      svg:'16bb869bfba411eeb1e8b025aa2c9ada',
    },
    {
      path: ':catchAll(.*)*',
      component: '/src/myComponents/404/index.vue',
      hide:true
    },
  ]
}