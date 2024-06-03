<template>
  <datatable
    style="padding: 10px"
    database="host=tanglei.top&port=3306&user=root&password=tanglei&database=union"
    table="userinfo"
  ></datatable>
</template>
<script lang="ts" setup>
import datatable from "~/myComponents/datatable/index.vue";
</script>
