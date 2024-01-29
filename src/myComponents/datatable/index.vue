<template>
  <div class="container">
    <div
      v-for="item of thData"
      class="col"
      style="flex-shrink: 0; background-color: black"
    >
      <div
        style="
          position: sticky;
          top: 0;
          color: white;
          font-weight: bolder;
          background-color: #2b2b2b;
        "
      >
        {{ item.label }}
      </div>
      <div v-for="(v, k) in tableData" class="cell">
        <myInput v-model:value="tableData[k][item.label]"></myInput>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import myInput from "./input.vue";
interface User {
  date: string;
  name: string;
  address: string;
}

const handleEdit = (index: number, row: User) => {
  console.log(index, row);
};
const handleDelete = (index: number, row: User) => {
  console.log(index, row);
};
const search = ref("");
const thData = reactive(new Array<any>());
thData.push(
  { label: "date" },
  { label: "name" },
  { label: "state" },
  { label: "city" },
  { label: "address" },
  { label: "zip1" },
  { label: "zip2" },
  { label: "zip3" },
  { label: "zip4" },
  { label: "zip5" },
  { label: "zip6" }
);
const tableData = reactive(new Array<any>());
for (let i = 0; i < 1000; i++) {
  tableData.push({
    date: "2016-05-03",
    name: "Tom" + i,
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip1: "CA 90036",
    zip2: "CA 90036",
    zip3: "CA 90036",
    zip4: "CA 90036",
    zip5: "CA 90036",
    zip6: "CA 90036",
  });
}
</script>
<style scoped lang="scss">
.container {
  color: black;
  display: flex;
  width: 100%;
  .col:not(:last-child) {
    border-right: 1px solid black;
  }
  .cell {
    border-top: 1px solid black;
  }
}
</style>
