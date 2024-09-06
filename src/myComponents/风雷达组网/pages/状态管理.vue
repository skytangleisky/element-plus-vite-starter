<template>
  <datatable
    style="padding: 10px"
    database="host=tanglei.top&port=3308&user=root&password=mysql&database=weatherservice"
    table="device_status"
  ></datatable>
</template>
<script lang="ts" setup>
import datatable from "~/myComponents/datatable/index.vue";
</script>
