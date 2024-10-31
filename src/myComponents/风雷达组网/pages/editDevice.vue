<template>
  <div class="absolute inset-0 bg-#000000aa z-1" @mousedown="mousedownFunc">
    <div class="editDevice_dialog">
      <BorderBox class="box-border" style="backdrop-filter: blur(10px);">
        <div class="rightPlane">
          <el-form
            ref="formEl"
            class="w-full h-full flex flex-col justify-center"
            :model="formData"
            label-position="right"
            label-width="80"
          >
            <el-form-item
              label="ID"
              prop="id">
              <el-input v-model.number="formData.id" disabled/>
            </el-form-item>
            <el-form-item
              label="雷达名称"
              prop="device_name">
              <el-input v-model="formData.device_name"/>
            </el-form-item>
            <el-form-item
              label="雷达型号"
              prop="device_model">
              <el-input v-model="formData.device_model"/>
            </el-form-item>
            <el-form-item
              label="雷达类型"
              prop="device_type">
              <el-input v-model="formData.device_type"/>
            </el-form-item>
            <el-form-item
              label="经度"
              prop="lng">
              <el-input v-model="formData.lng"/>
            </el-form-item>
            <el-form-item
              label="纬度"
              prop="lat">
              <el-input v-model="formData.lat"/>
            </el-form-item>
            <el-form-item
              label="海拔高度"
              prop="altitude">
              <el-input v-model="formData.altitude"/>
            </el-form-item>
            <el-form-item
              label="生产厂商"
              prop="manufacturer">
              <el-input v-model="formData.manufacturer"/>
            </el-form-item>
          </el-form>
          <div class="w-full flex justify-around m-t-20px">
            <el-button style="width: 100px;" type="primary" :loading="loading" @click="submitForm(formEl)">确认</el-button>
            <el-button style="width: 100px;" @click="hideFunc">取消</el-button>
          </div>
        </div>
      </BorderBox>
    </div>
  </div>
</template>
<script lang="ts" setup name="loginPage">
const props = withDefaults(defineProps<{device:string}>(),{device:""})
let mousedown = false
function mousedownFunc(){
  mousedown = true
}
const emits = defineEmits(['update:show'])
function hideFunc(){
  if(mousedown){
    mousedown=false
    emits('update:show',false)
  }
}
import { BorderBox12 as BorderBox } from "~/../packages/dataV";
import { reactive, ref, h, watch,onMounted } from "vue";
import type { FormInstance } from "element-plus";
import { useUserStore } from "~/stores/user";
import { useSettingStore } from "~/stores/setting";
import { array2components } from "~/tools";
const setting = useSettingStore();
const user = useUserStore();
import {exec} from '~/api'
import {databaseRaw} from '~/api/重庆'
onMounted(()=>{
  exec({
    database: databaseRaw,
    query: {
      sqls: ["select * from `device` where `no`=?"],
      vals:[[props.device]]
    },
  }).then((res:any) => {
    if(res.data[0].length==1){
      Object.assign(formData,res.data[0][0])
    }else{
      throw Error('This should never happen!!!')
    }
  })
})
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
const formEl = ref<FormInstance>();

const formData = reactive({
  "id": '',
  "uuid": null,
  "no": null,
  "device_no": null,
  "device_name": null,
  "device_short_name": null,
  "device_type": null,
  "device_model": null,
  "address": null,
  "manufacturer": null,
  "lng": "",
  "lat": "",
  "altitude": "",
  "height": "",
  "data_path": null,
  "color": null,
  "speed": null,
  "hide": null,
  "orientation": null,
  "data_overtime": 600,
  "status": 1,
  "createtime": null,
  "updatetime": null,
});
const loading = ref(false);
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  loading.value = true;
  formEl.validate((valid) => {
    if (valid) {
      exec({
        database: databaseRaw,
        query: {
          sqls: ["update `device` set `device_name`=?,`device_model`=?,`device_type`=?,`lng`=?,`lat`=?,`altitude`=?,`manufacturer`=? where `id`=?"],
          vals:[[formData.device_name,formData.device_model,formData.device_type,formData.lng,formData.lat,formData.altitude,formData.manufacturer,formData.id]]
        },
      }).then((res) => {
        loading.value = false
        ElMessage({
          message: h("p", null, [
            // h('span', null, 'Message can be '),
            h("i", { style: "color: teal" }, '数据修改成功'),
          ]),
          type: "success",
        });
      }).catch(res=>{
        loading.value = false
        openVn('数据修改失败')
      })
    } else {
      loading.value = false;
      return false;
    }
  });
};
const openVn = (message: string) => {
  ElMessage({
    message: h("p", null, [
      // h('span', null, 'Message can be '),
      h("i", { style: "color: teal" }, message),
    ]),
    type: "error",
  });
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
watch(
  () => user.roles,
  (roles) => {
    router.getRoutes().forEach((v) => {
      v.name && router.removeRoute(v.name);
    });
    (array2components(setting.routes, roles) as Array<any>).map((v: any) => {
      router.addRoute(v);
    });
    try {
      router.replace(router.currentRoute.value.fullPath);
      // router.replace({ ...router.currentRoute.value, force: true });
    } catch (error) {
      console.log(error);
    }
  },
  {
    deep: true,
  }
);
</script>
<style lang="scss">
.editDevice_dialog {
  --width:350px;
  --height:500px;
  width:var(--width);
  height: var(--height);
  left: calc(50% - var(--width)/2);
  top: calc(50% - var(--height)/2);
  position: absolute;
  // background-color: #f00;
  display: flex;
  align-items: center;
  flex-direction: column;
  .title {
    background-size: cover;
    font-family: "SourceHanSansSC-Bold";
    font-weight: 600;
    text-align: left;
    font-size: 35px;
    color: #40b9ff;
    text-shadow: 5px 4px 5px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    display: inline-block;
    white-space: nowrap;
  }
  .rightPlane {
    padding:40px;
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items:center;
    .ep-input {
      .ep-input__wrapper {
        background: transparent;
        .ep-input__inner {
          caret-color: white;
          -webkit-text-fill-color: white;
          appearance: none;
          background-image: none;
          padding: 15px 0;
          background-clip: content-box;
          &::selection {
            background-color: #a2caf7;
            color: black;
            -webkit-text-fill-color: black;
          }
        }
      }
      // .ep-input-group__append {
      //   background: transparent;
      //   color: grey;
      // }
      // .ep-input-group__append {
      //   padding: 0;
      // }
    }
  }
}
.ep-form {
  .ep-form-item:last-child {
    margin-bottom: 0;
  }
}
</style>