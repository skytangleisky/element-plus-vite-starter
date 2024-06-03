<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <template v-for="(crumb, index) in breadcrumbs">
        <i v-if="index != 0" class="p-l-4px p-r-4px">/</i>
        <li class="breadcrumb-item cursor-pointer" @click="click(crumb)">
          {{ crumb.meta.label }}
        </li>
      </template>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const breadcrumbs = computed(() => {
  return router.currentRoute.value.matched;
});
const click = (crumb: any) => {
  router.push({
    path: crumb.path,
  });
};
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  font-size: 16px;
  line-height: 40px;
  padding-left: 0;
  margin: 0;
  .breadcrumb-item:hover {
    color: orange;
    text-decoration: underline;
  }
}
</style>
