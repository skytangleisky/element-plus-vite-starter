<template>
  <datatable
    style="padding: 10px"
    :database="databaseRaw"
    table="userinfo"
    :headerOption="headerOption"
  ></datatable>
</template>
<script lang="ts" setup>
import { databaseRaw } from "~/api/重庆";
import { reactive } from "vue";
import datatable from "~/myComponents/datatable/index.vue";
const headerOption = reactive({
  id: { label: "主键" },
  createtime: { label: "添加时间" },
  updatetime: { label: "更新时间" },
  uuid: { label: "唯一标识" },
  username: { label: "用户名" },
  introduction: { label: "描述" },
  nickname: { label: "昵称" },
  login_type: { label: "登录方式" },
  email: { label: "电子邮箱" },
  email_verified_at: { label: "电子邮箱确认时间" },
  password: { label: "密码" },
  two_factor_secret: { label: "谷歌双因子认证秘钥" },
  two_factor_recovery_codes: { label: "谷歌双因子认证恢复码" },
  remember_token: { label: "记录token" },
  avatar: { label: "头像地址" },
  user_path: { label: "相对路径" },
  debug_enable: { label: "是否允许调试" },
  roles: { label: "角色" },
});
</script>
