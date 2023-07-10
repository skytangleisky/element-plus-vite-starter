<template>
  <div class="login_dialog">
    <div class="leftImage">珠海光恒科技雷达设备组网数据采集管理系统</div>
    <div class="rightPlane">
      <el-form
        ref="formRef"
        :model="numberValidateForm"
        class="demo-ruleForm"
      >
        <el-form-item
          prop="username"
          :rules="[
            { required: true, message: 'username is required' }
          ]"
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
          :rules="[
            { required: true, message: 'password is required' }
          ]"
        >
        <el-input
          v-model.number="numberValidateForm.password"
          :type="hide?'password':'text'"
          autocomplete="off"
          placeholder="密码"
          :prefix-icon="Lock"
        >
        <template #append>
          <View v-show="!hide" style="width: 1em;height:1em;" @click="hide=!hide"></View>
          <Hide v-show="hide" style="width: 1em;height:1em;" @click="hide=!hide"></Hide>
        </template>
        </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
          <el-button @click="resetForm(formRef)">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { User, Lock, Hide, View } from '@element-plus/icons-vue'

const hide = ref(true)
const formRef = ref<FormInstance>()

const numberValidateForm = reactive({
  username: '',
  password: '',
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<style lang="scss">
.login_dialog{
  position: absolute;
  transform: translate(-50%,-50%);
  box-shadow: 4px 4px 12px 4px rgba(23,38,42,.49);
  top:50%;
  left:50%;
  width:1200px;
  height:600px;
  // background-color: #f00;
  display: flex;
  flex-direction: row;
  border-radius: 8px;
  overflow: hidden;
  .leftImage{
    width:800px;
    height:600px;
    background-image: url(assets/9.jpg);
    background-size: cover;
    font-family: 'SourceHanSansSC-Bold';
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
  .rightPlane{
    width:400px;
    height:600px;
    display: flex;
    flex-direction: colum;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    .ep-input__inner{
      box-shadow: 0 0 0 1000px white inset;
      -webkit-text-fill-color: grey;
    }
    .ep-input-group__append{
      background: transparent;
      color:grey;
    }
  }
}
</style>