<template>
  <div class="login_dialog">
    <div style="display: flex; align-items: center">
      <img
        src="/src/assets/eagle.png"
        style="width: 60px; height: 60px; margin-right: 10px"
      />
      <div class="title">低空飞行安全监控系统</div>
    </div>
    <div class="rightPlane fourCorners">
      <el-form
        ref="formEl"
        id="rightPlaneForm"
        :model="numberValidateForm"
        class="demo-ruleForm"
      >
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
            @keyup.enter.native="submitForm(formEl)"
          >
            <template #suffix>
              <div
                @click="hide = !hide"
                class="w-full h-full pl-8px pr-8px flex items-center cursor-pointer"
              >
                <View v-show="!hide" style="width: 1em; height: 1em"></View>
                <Hide v-show="hide" style="width: 1em; height: 1em"></Hide>
              </div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <slider-check
            ref="sliderCheckRef"
            v-model:sliderStatus="sliderStatus"
          ></slider-check>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="sliderStatus !== '验证通过'"
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
<script lang="ts" setup name="loginPage">
import sliderCheck from "./sliderCheck.vue";
import { reactive, ref, h } from "vue";
import type { FormInstance } from "element-plus";
import { User, Lock, Hide, View } from "@element-plus/icons-vue";
import { useUserStore } from "~/stores/user";
import { useSettingStore } from "./stores/setting";
const setting = useSettingStore();
const user = useUserStore();
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
const sliderCheckRef = ref<{ reset: Function }>();
const hide = ref(true);
const formEl = ref<FormInstance>();
import { useExclude } from "./myComponents/bus";
let exclude = useExclude();

const numberValidateForm = reactive({
  username: "",
  password: "",
  secure: window.location.protocol == "https:",
});
const loading = ref(false);
const sliderStatus = ref<"验证中" | "验证通过">("验证中");
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl || sliderStatus.value !== "验证通过") return;
  loading.value = true;
  formEl.validate((valid) => {
    if (valid) {
      user
        .Login(numberValidateForm)
        .then((res: any) => {
          loading.value = false;
          if (user.roles.includes("admin")) {
            router.push({ path: "/", replace: true });
          } else {
            if (user.roles.includes("ry")) {
              for (let i = 0; i < setting.routes.length; i++) {
                let item: any = setting.routes[i];
                if (item.children) {
                  if (item.path !== "ry") {
                    setting.routes.splice(i--, 1);
                  }
                }
              }
            }
            router.push({ path: "/", replace: true });
          }
          exclude.push("loginPage"); //标志此页面再次进入，不要复用已经缓存的页面，而是重新渲染
        })
        .catch((e) => {
          sliderCheckRef.value?.reset();
          loading.value = false;
          if (e.response) {
            if (e.response.status == 400) {
              if (e.response.data.message) {
                openVn(e.response.data.message);
              } else {
                openVn(e.response.data.sqlMessage);
              }
            } else {
              openVn(e.message);
            }
          } else {
            openVn(e.message);
          }
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
  top: 50%;
  left: 50%;
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
    position: relative;
    margin-top: 40px;
    padding: 40px;
    display: flex;
    flex-direction: colum;
    justify-content: center;
    align-items: center;
    background-color: #ffffff66;
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
          &::selection {
            background-color: #a2caf7;
            color: grey;
            -webkit-text-fill-color: grey;
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
<style lang="scss" scoped>
.fourCorners::before {
  --offset: 0px;
  --borderWidth: 4px;
  position: absolute;
  left: var(--offset);
  top: var(--offset);
  content: "";
  width: calc(100% - 2 * var(--offset));
  height: calc(100% - 2 * var(--offset));
  border-radius: 0px;
  box-sizing: border-box;
  border: var(--borderWidth) solid #469dee;
  --len: 15px;
  mask: conic-gradient(at var(--len) var(--len), transparent 270deg, red 270deg) 0 0 /
    calc(100% - var(--len)) calc(100% - var(--len));
}
</style>
