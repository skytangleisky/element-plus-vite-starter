<template></template>
<script lang="ts" setup>
  import router from '/src/router'
  import { useUserStore } from '/src/stores/user.ts'
  const user = useUserStore()
  if(QC.Login.check()){
    QC.Login.getMe(function (openId, accessToken) {
      QC.api("get_user_info").success((res) => {
        console.log(res.data)
        user.avatar = res.data.figureurl;
        user.username = res.data.nickname;
        user.logined = true;
        QC.Login.signOut();
        router.push('/')
      });
    });
  }
</script>