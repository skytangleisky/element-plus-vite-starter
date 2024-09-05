export default {
  name:'16d44138-0721-49cf-8f32-49c6894512bd',
  meta:{
    label:'重庆测风激光雷达组网系统',
    roles:['admin','cq','device']
  },
  children:[
    {
      name:'da4ce7c7-3aa9-4b9b-8d8b-ce44241794d5',
      hide:false,
      meta:{
        label:'组网观测'
      }
    },
    {
      name:'55d064ac-1d46-4dad-a7aa-d5c3506f565b',
      meta:{
        label:'单站产品'
      },
      children:[
        {
          name: 'e44f37e1-f642-4dbf-83ca-052313b217f5',
          meta:{
            label: '渝北激光测风雷达',
          }
        },
        {
          name: '026f3650-bc25-49a1-8e2d-b732387a07a9',
          meta:{
            label: '北碚激光测风雷达',
          }
        },
        {
          name: '44ef9160-cc08-41b5-b5fb-052cc5b6ffa8',
          meta:{
            label: '巴南激光测风雷达',
          }
        },
        {
          name: 'a2dd733b-06d4-4caf-a212-63a729c45bff',
          meta:{
            label: '綦江激光测风雷达',
          }
        },
        {
          name: 'e2360cf9-8c18-4cb0-9484-e28289af435e',
          meta:{
            label: '万州激光测风雷达',
          }
        },
        {
          name: '6fd05a6b-89c3-4bab-a535-6290013b9914',
          meta:{
            label: '城口激光测风雷达',
          }
        },
      ]
    },
    {
      name:'419ec003-6567-48d5-b726-8ad63c543b1f',
      meta:{
        label:'系统管理',
        roles:['admin','cq']
      },
      children:[
        {
          name: 'e1f9baa0-9e57-46a3-95bd-88078f92b4fa',
          meta:{
            label: '用户管理',
          }
        },
        {
          name: '91eb2b3d-ca12-4866-9f96-b8ad6799a317',
          meta:{
            label: '单站管理',
          }
        },
      ]
    }
  ]
}