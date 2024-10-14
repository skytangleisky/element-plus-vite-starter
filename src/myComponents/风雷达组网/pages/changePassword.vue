<template>
  <div class="absolute inset-0 bg-#000000aa z-1" @mousedown="mousedownFunc">
    <div class="changePassword_dialog">
      <BorderBox class="box-border" style="backdrop-filter: blur(10px);">
        <div class="rightPlane">
          <el-form
            ref="formEl"
            class="w-full h-full flex flex-col justify-center"
            :model="numberValidateForm"
            label-position="left"
          >
            <el-form-item
              label="原密码"
              prop="password"
              :rules="[{ required: true, message: 'old password is required' },{ validator: validatePassword, trigger: 'blur', message: 'old password is invalid' }]">
              <el-input v-model.number="numberValidateForm.password" type="password" autocomplete="new-password" placeholder="" />
            </el-form-item>
            <el-form-item
              label="新密码"
              prop="newPassword"
              :rules="[{ required: true, message: 'new password is required' }]">
              <el-input v-model="numberValidateForm.newPassword" type="password" autocomplete="new-password" placeholder="" />
            </el-form-item>
            <el-form-item
              label="验密码"
              prop="repeatPassword"
              :rules="[{ required: true, message: 'repeat password is required' },{ validator: validateRepeatPassword, trigger: 'blur', message: 'the two passwords are different' }]">
              <el-input v-model="numberValidateForm.repeatPassword" type="password" autocomplete="new-password" placeholder="" />
            </el-form-item>
            <el-form-item>
              <div class="w-full flex justify-around">
                <el-button style="width: 100px;" type="primary" :loading="loading" @click="submitForm(formEl)">确认</el-button>
                <el-button style="width: 100px;" @click="hideFunc">取消</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </BorderBox>
    </div>
  </div>
</template>
<script lang="ts" setup name="loginPage">
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
import { reactive, ref, h, watch } from "vue";
import type { FormInstance } from "element-plus";
import { useUserStore } from "~/stores/user";
import { useSettingStore } from "~/stores/setting";
import { array2components } from "~/tools";
const setting = useSettingStore();
const user = useUserStore();
import {exec} from '~/api'
import {databaseRaw} from '~/api/重庆'
function validatePassword(rule:any,value:string,callback:Function){
  exec({
    database: databaseRaw,
    query: {
      sqls: ["select * from `userinfo` where `username`=? and `password`=?"],
      vals:[[user.username,value]]
    },
  }).then((res) => {
    if(res.data[0].length==1){
      callback()
    }else if(res.data[0].length<1){
      callback('old password is invalid')
    }else{
      throw Error('This should never happen!!!')
    }
  })
}
function validateRepeatPassword(rule:any,value:string,callback:Function){
  if(value==numberValidateForm.newPassword){
    callback()
  }else{
    callback('error')
  }
}
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
const formEl = ref<FormInstance>();

const numberValidateForm = reactive({
  password: "",
  newPassword: "",
  repeatPassword: "",
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
          sqls: ["update `userinfo` set `password`=? where `username`=?"],
          vals:[[numberValidateForm.newPassword,user.username]]
        },
      }).then((res) => {
        loading.value = false
        ElMessage({
          message: h("p", null, [
            // h('span', null, 'Message can be '),
            h("i", { style: "color: teal" }, '密码修改成功'),
          ]),
          type: "success",
        });
      }).catch(res=>{
        openVn('密码修改失败')
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
.changePassword_dialog {
  --width:350px;
  --height:300px;
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