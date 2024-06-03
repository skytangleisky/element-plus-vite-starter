<template>
  <datatable
    style="padding: 10px"
    database="host=tanglei.top&port=3390&user=root&password=mysql&database=gis"
    table="enclosure"
  ></datatable>
</template>
<script lang="ts" setup>
import datatable from "~/myComponents/datatable/index.vue";
</script>
