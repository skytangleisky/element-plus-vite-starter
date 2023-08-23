<template>
<div class="flex-col" style="color:black;background-color: #fff;overflow: auto;min-width: 240px;">
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        style="height: 100%;width:100%"
    >
        <el-sub-menu index="1">
            <template #title>
                <el-icon v-dompurify-html="test"></el-icon>
                <span>Navigator One</span>
            </template>
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
            <el-menu-item index="1-3">item three</el-menu-item>
            <el-sub-menu index="1-4">
                <template #title>item four</template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
            <el-icon><icon-menu /></el-icon>
            <span>Navigator Two</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
            <el-icon><document /></el-icon>
            <span>Navigator Three</span>
        </el-menu-item>
        <el-menu-item index="4">
            <el-icon><setting /></el-icon>
            <span>Navigator Four</span>
        </el-menu-item>
    </el-menu>
</div>

</template>
<script lang="ts" setup>
import { ref } from 'vue';
const test = ref('<svg t="1692449636692" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4999" width="200" height="200"><path d="M737.28 0c-98.986667 0-177.493333 61.44-225.28 122.88C464.213333 61.44 382.293333 0 286.72 0 129.706667 0 0 129.706667 0 286.72c0 341.333333 481.28 716.8 501.76 733.866667 3.413333 3.413333 6.826667 3.413333 10.24 3.413333s6.826667 0 10.24-3.413333C542.72 1003.52 1024 628.053333 1024 286.72 1024 129.706667 894.293333 0 737.28 0z" fill="" p-id="5000"></path></svg>')
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
</script>