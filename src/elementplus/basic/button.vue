<template>
  <el-row class="mb-4">
    <el-button>{{ t("tl.Default") }}</el-button>
    <el-button type="primary">{{ t("tl.Primary") }}</el-button>
    <el-button type="success">{{ t("tl.Success") }}</el-button>
    <el-button type="info">{{ t("tl.Info") }}</el-button>
    <el-button type="warning">{{ t("tl.Warning") }}</el-button>
    <el-button type="danger">{{ t("tl.Danger") }}</el-button>
  </el-row>

  <el-row class="mb-4">
    <el-button plain>{{ t("tl.Plain") }}</el-button>
    <el-button type="primary" plain>{{ t("tl.Primary") }}</el-button>
    <el-button type="success" plain>{{ t("tl.Success") }}</el-button>
    <el-button type="info" plain>{{ t("tl.Info") }}</el-button>
    <el-button type="warning" plain>{{ t("tl.Warning") }}</el-button>
    <el-button type="danger" plain>{{ t("tl.Danger") }}</el-button>
  </el-row>

  <el-row class="mb-4">
    <el-button round>{{ t("tl.Round") }}</el-button>
    <el-button type="primary" round>{{ t("tl.Primary") }}</el-button>
    <el-button type="success" round>{{ t("tl.Success") }}</el-button>
    <el-button type="info" round>{{ t("tl.Info") }}</el-button>
    <el-button type="warning" round>{{ t("tl.Warning") }}</el-button>
    <el-button type="danger" round>{{ t("tl.Danger") }}</el-button>
  </el-row>

  <el-row>
    <el-button :icon="Search" circle />
    <el-button type="primary" :icon="Edit" circle />
    <el-button type="success" :icon="Check" circle />
    <el-button type="info" :icon="Message" circle />
    <el-button type="warning" :icon="Star" circle />
    <el-button type="danger" :icon="Delete" circle />
  </el-row>
</template>

<script lang="ts" setup>
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
import { useLocale } from 'element-plus'
const { t } = useLocale()
</script>