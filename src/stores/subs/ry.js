export default {
  path: 'ry',
  component: '/src/container.vue',
  // redirect: { path: '/ry/synthesis' },
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
      label:'人影',
      hide:false,
      svg:'45a839fb02a411efb1e8b025aa2c9ada',
    },
    {
      path: 'history',
      name: '961a22a1-f5da-9845-fc89-3519ed950610',
      // component:'/src/myComponents/openlayers/radarStatistic.vue'
      // component:'/src/myComponents/menu/index.vue'
      component:'/src/myComponents/无人机/pages/playback.vue',
      label:'历史回放',
      svg:'42a4578ed6cd11ee9aafb025aa2c9ada',
    },
    {
      path: 'statistic',
      name: '961a22a1-f5da-9845-fc89-3519ed950710',
      // component:'/src/myComponents/openlayers/radarStatistic.vue'
      // component:'/src/myComponents/menu/index.vue'
      component: '/src/myComponents/datatable/index.vue',
      label:'数据统计',
      svg:'a2a749dfd6ca11ee9aafb025aa2c9ada',
    },
    {
      path: 'system',
      name:'65e99b66-e340-4d4b-6b26-629f41dc64a9',
      label:'系统管理',
      svg:'7809a650d6c811ee9aafb025aa2c9ada',
      children:[
        {
          path: 'device',
          name: 'c4961e04-e574-0e1f-ae23-94f157b15a45',
          component: '/src/myComponents/datatable/index.vue',
          label: '作业点管理',
          svg:'2133405ad6ca11ee9aafb025aa2c9ada'
        }
      ]
    },
    {
      path: 'user',
      name:'65e99b66-e340-4d4a-6b26-629f41dc64a9',
      label:'用户管理',
      svg:'b9cef812d6c711ee9aafb025aa2c9ada',
      children:[
        {
          path: 'person',
          name: 'c4961e01-e571-0e1f-ae23-94f157b15a45',
          component: '/src/myComponents/datatable/index.vue',
          label: '个人用户',
          svg:'f11a18a8d6c711ee9aafb025aa2c9ada'
        },
        {
          path: 'enterprise',
          name: 'c4961e02-e572-0e1f-ae23-94f157b15b45',
          component: '/src/myComponents/datatable/index.vue',
          label: '企业用户',
          svg:'20a7ae2bd6c811ee9aafb025aa2c9ada'
        },
      ]
    },
    {
      path: 'permission',
      name:'65e99b66-e340-4d41-6b26-629f41dc64a9',
      label:'权限管理',
      svg:'3c94a7e5d6c611ee9aafb025aa2c9ada',
      children:[
        {
          path: 'administrator',
          name: 'c4961e04-e571-0e1f-ae23-94f157b15a45',
          component: '/src/myComponents/datatable/index.vue',
          label: '系统用户管理',
          svg:'6a190295d6c711ee9aafb025aa2c9ada'
        },
        {
          path: 'group',
          name: 'c4961e04-e572-0e1f-ae23-94f157b15b45',
          component: '/src/myComponents/datatable/group.vue',
          label: '用户组管理',
          svg:'e5fc96bfd6c611ee9aafb025aa2c9ada'
        },
        {
          path: 'institution',
          name: 'c4961e04-e573-0e1f-ae23-94f157b15b45',
          component: '/src/myComponents/datatable/institution.vue',
          label: '机构管理',
          svg:'2e727627d6c711ee9aafb025aa2c9ada'
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