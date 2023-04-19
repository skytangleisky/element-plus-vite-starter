<template></template>
<script>
  import axios from 'axios'
  let params = {}
  var vars = window.location.toString().substring(window.location.toString().indexOf('#')+1).split('&');
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    params[pair[0]] = decodeURIComponent(pair[1])
  }
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