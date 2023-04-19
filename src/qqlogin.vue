<template></template>
<script>
  import axios from 'axios'
  let params = {}
  var vars = window.location.toString().substring(window.location.toString().indexOf('#')+1).split('&');
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    params[pair[0]] = decodeURIComponent(pair[1])
  }
  axios.get('/qqAuth/oauth2.0/me',{params:{access_token:params.access_token}}).then(res=>{
    let me = JSON.parse(res.data.substring("callback( ".length,res.data.length-" );\n".length))
    axios.get('/qqAuth/user/get_user_info',{params:{access_token:'71AA1705D35755D2B41DE579CED4F5BD',oauth_consumer_key:me.client_id,openid:me.openid}}).then(res=>{
      window.opener&&window.opener.auth&&window.opener.auth(res.data)
      window.close()
    })
  })
</script>