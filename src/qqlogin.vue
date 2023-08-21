<template></template>
<script>
  import axios from 'axios'
  import { getHash } from './utils/tool'
  let params = getHash()
  if(params.access_token){
    axios.get('/qqAuth/oauth2.0/me',{params:{access_token:params.access_token}}).then(res=>{
      let me = JSON.parse(res.data.substring("callback( ".length,res.data.length-" );\n".length))
      if(me.client_id&&me.openid){
        axios.get('/qqAuth/user/get_user_info',{params:{access_token:params.access_token,oauth_consumer_key:me.client_id,openid:me.openid}}).then(res=>{
          if(res.data.ret!=-1){
            window.opener.postMessage({auth:true,userData:{openid:me.openid,...res.data}},'*')
            window.close()
          }
        })
      }
    })
  }
</script>