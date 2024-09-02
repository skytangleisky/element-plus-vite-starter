<template>
  <div
    class="flex-col dark:bg-#000 bg-white"
    style="color: black; overflow: auto; width: 100%"
  >
    <el-button type="primary" @click="resetMenu()">reset menu</el-button>
    <div class="cf nestable-lists">
      <MyEditMenu v-model:modelValue="setting.routes"></MyEditMenu>
    </div>
    <div class="icons">
      <span v-for="v in icon.results"
        ><el-icon
          style="font-size: 4em; color: var(--ep-text-color-primary)"
          v-dompurify-html="v.svg"
          @click="storeIcon(v)"
        ></el-icon>
        {{ v.name }}</span
      >
    </div>
    <el-button @click="addIcon" type="primary" style="margin: 20px;">open a icon Dialog</el-button>
    <el-dialog v-model="dialogFormVisible" title="Icon">
      <el-form
        :model="form"
        label-width="120px"
        id="saveIconForm"
        ref="ruleFormRef"
        :rules="rules"
      >
        <el-form-item label="id">
          <el-input v-model="form.id" placeholder="autogeneration" />
        </el-form-item>
        <el-form-item label="uuid">
          <el-input v-model="form.uuid" placeholder="autogeneration" />
        </el-form-item>
        <el-form-item label="createtime">
          <el-input v-model="form.createtime" placeholder="autogeneration" />
        </el-form-item>
        <el-form-item label="updatetime">
          <el-input
            v-model="form.updatetime"
            placeholder="autogeneration"
            :clearable="true"
          />
        </el-form-item>
        <el-form-item label="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="svg">
          <el-icon style="font-size: 2em" v-dompurify-html="form.svg"></el-icon>
          <el-input
            v-model="form.svg"
            style="width: calc(100% - 2em)"
            type="textarea"
            :rows="10"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import MyEditMenu from './editMenu.vue'
import { ref, reactive, onMounted, onBeforeUnmount, nextTick,watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import {getMenu} from '~/api/角色/role'
getMenu().then(res=>{
  Object.assign(setting.routes,JSON.parse(res.data.results[0].menu_tree))
})
import { array2components } from "~/tools/index";
const router = useRouter();
import subEditMenu from "./subEditMenu.vue";
import { useUserStore } from "~/stores/user.js";
const user = useUserStore();
// router.getRoutes().forEach((v) => {
//   v.name && router.removeRoute(v.name);
// });
// array2components(setting.routes).map((v: any) => {
//   router.addRoute(v);
// });
// console.log(router.getRoutes());
import { useIconStore } from "~/stores/icon";
const icon = useIconStore();
icon.FetchList();

function resetMenu(){
  setting.$resetFields('routes')
}

const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules<typeof form>>({});
const show = ref(true);
const addIcon = () => {
  form.id = undefined;
  form.uuid = undefined;
  form.svg = "";
  form.name = "";
  form.createtime = undefined;
  form.updatetime = undefined;
  dialogFormVisible.value = true;
};
const storeIcon = (v: any) => {
  Object.assign(form, v);
  dialogFormVisible.value = true;
};
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  dialogFormVisible.value = false;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!");
      console.log(JSON.stringify(form));
      icon
        .saveData([form])
        .then((res: any) => {
          console.log(res);
          icon.FetchList();
        })
        .catch((e: any) => {
          throw e;
        });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
const dialogFormVisible = ref(false);
const form = reactive({
  id: undefined,
  uuid: undefined,
  createtime: undefined,
  updatetime: undefined,
  name: "",
  svg: "",
});

onMounted(() => {

});
onBeforeUnmount(()=>{
})
</script>
<style lang="scss">
.cf:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

* html .cf {
  zoom: 1;
}

*:first-child + html .cf {
  zoom: 1;
}

h1 {
  font-size: 1.75em;
  margin: 0 0 0.6em 0;
}

a {
  color: #2996cc;
}

a:hover {
  text-decoration: none;
}

p {
  line-height: 1.5em;
}

.small {
  color: #666;
  font-size: 0.875em;
}

.large {
  font-size: 1.25em;
}

/**
  * Nestable Extras
  */

.nestable-lists {
  display: block;
  clear: both;
  width: 100%;
  border: 0;
  border-top: 2px solid #ddd;
  border-bottom: 2px solid #ddd;
}
.dark .nestable-lists {
  border-color: #444;
}



.dark .dd {
  .dd-handle {
    color: #fff;
    border: 1px solid #999;
    background: #bbb;
    background: -webkit-linear-gradient(top, #bbb 0%, #999 100%);
    background: -moz-linear-gradient(top, #bbb 0%, #999 100%);
    background: linear-gradient(top, #bbb 0%, #999 100%);
  }
  .dd-handle:hover {
    background: #bbb;
  }
  .dd-item > button:before {
    color: #fff;
  }
}

@media only screen and (min-width: 700px) {
  .nestable-lists {
    .dd {
      transition: all 2s;
      float: left;
      width: 48%;
    }

    .dd + .dd {
      margin-left: 2%;
    }
  }
}

.dd-hover > .dd-handle {
  background: #2ea8e5 !important;
}

/**
        * Nestable Draggable Handles
        */

.dd3-content {
  display: block;
  height: 30px;
  margin: 5px 0;
  padding: 5px 10px 5px 40px;
  color: #333;
  text-decoration: none;
  font-weight: bold;
  border: 1px solid #ccc;
  background: #fafafa;
  background: -webkit-linear-gradient(top, #fafafa 0%, #eee 100%);
  background: -moz-linear-gradient(top, #fafafa 0%, #eee 100%);
  background: linear-gradient(top, #fafafa 0%, #eee 100%);
  -webkit-border-radius: 3px;
  border-radius: 3px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.dd3-content:hover {
  color: #2ea8e5;
  background: #fff;
}

.dd-dragel > .dd3-item > .dd3-content {
  margin: 0;
}

.dd3-item > button {
  margin-left: 30px;
}

.dd3-handle {
  position: absolute;
  margin: 0;
  left: 0;
  top: 0;
  cursor: pointer;
  width: 30px;
  text-indent: 30px;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid #aaa;
  background: #ddd;
  background: -webkit-linear-gradient(top, #ddd 0%, #bbb 100%);
  background: -moz-linear-gradient(top, #ddd 0%, #bbb 100%);
  background: linear-gradient(top, #ddd 0%, #bbb 100%);
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.dd3-handle:before {
  content: "≡";
  display: block;
  position: absolute;
  left: 0;
  top: 3px;
  width: 100%;
  text-align: center;
  text-indent: 0;
  color: #fff;
  font-size: 20px;
  font-weight: normal;
}

.dd3-handle:hover {
  background: #ddd;
}

.icons {
  border: 1px solid red;
  display: grid;
  // grid-template-rows: repeat(3, minmax(0, 1fr));
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  place-items: start;
  place-content: center;
  span {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}





.dd,.dd-dragel {
  position: relative;
  list-style: none;

  // ul {
  //   margin-left: 20px;
  //   padding-left: 20px;
  //   position: relative;
  // }

  li {
    position: relative;
    padding-left: 30px;

    &::before,&::after {
      content: '';
      position: absolute;
      left: 0;
      border-color: #888;
      border-style: solid;
    }

    &::before {
      top: 0;
      left: 15px;
      width: 15px;
      height: 100%;
      border-width: 0 0 0 1px;
    }

    &::after {
      top: 15px;
      left: 15px;
      width: 15px;
      height: 15px;
      border-width: 1px 0 0 0;
    }

    &:last-child::before {
      height: 15px;
    }
  }
}
</style>
