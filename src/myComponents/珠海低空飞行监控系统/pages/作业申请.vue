<template>
  <datatable
    style="padding: 10px"
    database="host=192.168.0.240&port=3306&user=root&password=mysql&database=ryplat_bjry"
    table="zyddata"
  ></datatable>
</template>
<script lang="ts" setup>
import datatable from "~/myComponents/datatable/index.vue";
</script>
