<template>
  <div class="login_dialog">
    <div class="leftImage">雷达设备组网数据采集管理系统</div>
    <div class="rightPlane">
      <el-form ref="formEl" :model="numberValidateForm" class="demo-ruleForm">
        <el-form-item
          prop="username"
          :rules="[{ required: true, message: 'username is required' }]"
        >
          <el-input
            v-model.number="numberValidateForm.username"
            type="text"
            autocomplete="off"
            placeholder="账户"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="[{ required: true, message: 'password is required' }]"
        >
          <el-input
            v-model.number="numberValidateForm.password"
            :type="hide ? 'password' : 'text'"
            autocomplete="off"
            placeholder="密码"
            :prefix-icon="Lock"
          >
            <template #append>
              <div
                @click="hide = !hide"
                class="w-full h-full pl-8px pr-8px flex items-center"
              >
                <View v-show="!hide" style="width: 1em; height: 1em"></View>
                <Hide v-show="hide" style="width: 1em; height: 1em"></Hide>
              </div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="w-full"
            @click="submitForm(formEl)"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, h } from "vue";
import type { FormInstance } from "element-plus";
import { User, Lock, Hide, View } from "@element-plus/icons-vue";
import { useUserStore } from "~/stores/user";
let user = useUserStore();
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();

const hide = ref(true);
const formEl = ref<FormInstance>();

const numberValidateForm = reactive({
  username: "",
  password: "",
  secure: window.location.protocol == "https:",
});
const loading = ref(false);

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  loading.value = true;
  formEl.validate((valid) => {
    if (valid) {
      user
        .Login(numberValidateForm)
        .then((res: any) => {
          loading.value = false;
          if (res.data.code == 20000) {
            console.log("logined", res.data);
            router.push({ path: "/", replace: true });
          } else {
            openVn(res.data.message);
          }
        })
        .catch((e) => {
          openVn(e.message);
          loading.value = false;
        });
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
</script>
<style lang="scss">
.login_dialog {
  position: absolute;
  transform: translate(-50%, -50%);
  box-shadow: 4px 4px 12px 4px rgba(23, 38, 42, 0.49);
  top: 50%;
  left: 50%;
  width: 1200px;
  height: 600px;
  // background-color: #f00;
  display: flex;
  flex-direction: row;
  border-radius: 8px;
  overflow: hidden;
  .leftImage {
    width: 800px;
    height: 600px;
    background-image: url(assets/10.jpg);
    background-size: cover;
    font-family: "SourceHanSansSC-Bold";
    font-weight: 600;
    text-align: left;
    font-size: 35px;
    color: #fff;
    text-shadow: 5px 4px 5px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
  .rightPlane {
    width: 400px;
    height: 600px;
    display: flex;
    flex-direction: colum;
    justify-content: center;
    align-items: center;
    background-color: #ffffff88;
    .ep-input {
      .ep-input__wrapper {
        background: transparent;
        .ep-input__inner {
          caret-color: black;
          -webkit-text-fill-color: grey;
          appearance: none;
          background-image: none;
          padding: 15px 0;
          background-clip: content-box;
        }
      }
      .ep-input-group__append {
        background: transparent;
        color: grey;
      }
      .ep-input-group__append {
        padding: 0;
      }
    }
  }
}
</style>
