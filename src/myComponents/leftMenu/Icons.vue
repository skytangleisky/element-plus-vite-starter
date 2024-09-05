<template>
  <el-popover
    placement="bottom"
    trigger="click"
    class="icons-groups relative"
    content="this is content, this is content, this is content"
    popper-style="width:1000px;min-height:500px;"
    v-model:visible="visible"
  >
    <div v-if="visible">
      <VueDraggable class="drag-area grid" :style="`interpolate-size: allow-keywords;transition:height 0.5s;transition-timing-function:ease-in-out;`" v-model="icon.row.icon_tree" group="g2" @move="move">
        <div v-for="v in icon.row.icon_tree" :key="v.uuid" class="flex flex-col items-center justify-center icon-item">
          <div class="relative p-5px">
            <el-icon
              :class="`svgPath cursor-pointer p-5px candidate ${v.uuid == props.svg?'selected':''}`"
              style="font-size: 2em;  color: var(--ep-text-color-primary);"
              v-dompurify-html="v.svg"
              @click="click(v.uuid)"
            />
            <el-icon v-if="v.uuid == props.svg" class="clear" style="position: absolute;top:0px;right:0px;font-size: 10px;cursor:pointer" @click="click('')">
              <svg t="1725354250182" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4191"><path d="M240.470996 783.529004 240.470996 783.529004C390.432324 933.490332 633.567676 933.490332 783.529004 783.529004 933.490332 633.567676 933.490332 390.432324 783.529004 240.470996 633.567676 90.509668 390.432324 90.509668 240.470996 240.470996 90.509668 390.432324 90.509668 633.567676 240.470996 783.529004L240.470996 783.529004ZM149.961328 874.038672 149.961328 874.038672C-49.987109 674.090235-49.987109 349.909766 149.961328 149.961328 349.909766-49.987109 674.090235-49.987109 874.038672 149.961328 1073.987109 349.909766 1073.987109 674.090235 874.038672 874.038672 674.090235 1073.987109 349.909766 1073.987109 149.961328 874.038672L149.961328 874.038672ZM783.529004 149.961328 874.038672 240.470996 240.470996 874.038672 149.961328 783.529004 783.529004 149.961328Z"></path></svg>
            </el-icon>
            <el-popconfirm title="Are you sure to delete this?" :teleported="false" @confirm="deleteIcon(v)" width="220">
              <template #reference>
                <el-icon class="delete" style="position: absolute;bottom:0px;left:0px;font-size: 10px;cursor:pointer">
                  <svg t="1725328507349" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1477"><path d="M307.2 102.4l102.4-102.4h204.8l102.4 102.4h204.8v102.4H102.4V102.4h204.8zM153.6 307.2h716.8l-51.2 716.8H204.8L153.6 307.2z m256 102.4v512h51.2V409.6H409.6z m153.6 0v512h51.2V409.6H563.2z"></path></svg>
                </el-icon>
              </template>
            </el-popconfirm>
            <el-icon class="edit" style="position: absolute;right:0px;bottom:0px;font-size: 10px;cursor:pointer" @click="storeIcon(v)">
              <svg t="1725327654659" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5829"><path d="M299.897789 832.352145c-5.51869 1.042749-11.073196 1.509377-16.573467 1.509377-24.176632 0-47.669696-9.526981-65.069995-26.952862-21.391193-21.373797-30.899754-51.894927-25.453718-81.644485 53.56701-292.65534 77.005838-316.112588 95.880721-335.004867l249.460562-249.443166-57.55688-57.55688L117.232516 83.259262c-30.503734 0-55.220672 24.715915-55.220672 55.219649l0 766.960833c0 30.523177 24.716938 55.220672 55.220672 55.220672l554.104957 0c30.505781 0 55.221696-24.697495 55.221696-55.220672L726.559169 644.825145l-91.692329 91.692329C616.010377 755.355517 592.554152 778.794345 299.897789 832.352145z" p-id="5830"></path><path d="M939.872462 221.560118 803.582403 85.271082c-22.019503-22.019503-57.736982-22.019503-79.755462 0.01842l-120.614032 120.596635 0 0L353.751325 455.346699c-22.020526 22.037922-70.427002 286.490943-70.427002 286.490943s264.453021-48.4075 286.490943-70.427002l156.744927-156.744927 0 0 213.31227-213.33069C961.910385 279.314497 961.910385 243.598041 939.872462 221.560118zM447.959963 645.777843l-41.612747 14.09195c-1.168616 0.397043-2.427282 0.576121-3.684926 0.594541-0.233314 0-0.467651-0.072655-0.700965-0.090051-1.348718-0.055259-2.696412-0.306992-3.973498-0.737804-0.3776-0.125867-0.772596-0.251733-1.131777-0.412392-1.420349-0.611937-2.749624-1.348718-3.739161-2.355651l-24.859177-24.860201c-3.091408-3.091408-4.494361-8.770757-2.983961-13.193487l14.110369-41.61377c0.880043-2.606361 2.012843-4.978385 3.218298-7.207146 0.287549-0.557702 0.593518-1.096984 0.916882-1.61887 1.240247-2.084475 2.570545-4.025687 4.009314-5.607718 0.125867-0.143263 0.25071-0.233314 0.376577-0.35918 1.367137-1.437745 2.786463-2.571568 4.206812-3.470031 0.3776-0.234337 0.7552-0.466628 1.11438-0.64673 1.563612-0.792039 3.109828-1.330298 4.620227-1.348718 0.682545 0 1.311879 0.181125 1.959631 0.341784 0.413416 0.090051 0.825808 0.090051 1.221828 0.251733 1.042749 0.431835 2.031263 1.078565 2.965541 2.012843l61.636802 61.637826C473.305211 628.862591 463.311603 640.565121 447.959963 645.777843zM837.682036 271.2621l-37.422308 37.424354c-7.190773 7.189749-18.839067 7.189749-26.02984 0l-57.754379-57.754379c-7.188726-7.190773-7.188726-18.838044 0-26.028816l37.425378-37.424354c7.188726-7.189749 18.837021-7.189749 26.027793 0l57.753355 57.754379C844.872808 252.424056 844.872808 264.071328 837.682036 271.2621z" p-id="5831"></path></svg>
            </el-icon>
          </div>
          <span style="font-size: 10px;">{{ v.name }}</span>
        </div>
        <div class="flex flex-col items-center justify-center icon-item no-drag" :draggable="false" :droppable="false" @click="addIcon">
          <div class="relative p-5px">
            <el-icon
              :class="`cursor-pointer p-5px candidate`"
              style="font-size: 2em;  color: var(--ep-text-color-primary);"
              @click="click('')"
            >
              <svg t="1725350248538" class="icon" viewBox="0 0 1349 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M325.818182 279.272727m-93.090909 0a93.090909 93.090909 0 1 0 186.181818 0 93.090909 93.090909 0 1 0-186.181818 0Z" p-id="5336"></path><path d="M873.658182 429.149091L791.272727 346.763636l-418.909091 418.909091L442.181818 605.090909 325.818182 486.4l-232.727273 232.727273V93.090909h930.909091v282.530909a334.196364 334.196364 0 0 1 93.090909 0V46.545455a46.545455 46.545455 0 0 0-46.545454-46.545455H46.545455a46.545455 46.545455 0 0 0-46.545455 46.545455v837.818181a46.545455 46.545455 0 0 0 46.545455 46.545455h701.905454a372.363636 372.363636 0 0 1 125.207273-501.76z" p-id="5337"></path><path d="M1070.545455 465.454545a279.272727 279.272727 0 1 0 279.272727 279.272728 279.272727 279.272727 0 0 0-279.272727-279.272728z m139.636363 314.181819h-104.727273V884.363636h-69.818181v-104.727272H930.909091v-69.818182h104.727273V605.090909h69.818181v104.727273H1210.181818z" p-id="5338"></path></svg>
            </el-icon>
          </div>
          <span style="font-size: 10px;"></span>
        </div>
      </VueDraggable>
      <div v-show="form.dialogFormVisible" class="absolute left-0 top-0 bg-white dark:bg-black w-full h-full flex justify-center items-center">
        <el-form
          :model="form"
          label-width="120px"
          id="saveIconForm"
          ref="ruleFormRef"
          :rules="rules"
          style="width: 80%;"
        >
          <el-row>
            <el-col :span="18">
              <el-form-item label="uuid">
                <el-input class="uuid" v-model="form.uuid" placeholder="autogeneration" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button class="w-full" @click="resetUUID" type="primary" plain>refresh</el-button>
            </el-col>
            <el-col :span="3">
              <el-button class="w-full" @click="copy" :type="form.copyStatus=='copied'?'success':'primary'" plain>{{ form.copyStatus }}</el-button>
            </el-col>
          </el-row>
          <el-form-item label="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="svg">
            <el-icon style="font-size: 2em" v-dompurify-html="form.svg"></el-icon>
            <el-input
              v-model="form.svg"
              style="width: calc(100% - 2em)"
              type="textarea"
              :rows="6"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="form.dialogFormVisible = false">Cancel</el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #reference>
      <el-icon class="menu-icon" v-dompurify-html="format(props.svg)" style="font-size: large"></el-icon>
    </template>
  </el-popover>
</template>
<script lang="ts" setup>
import { v4 as uuid } from 'uuid';
import {reactive,ref,watch} from 'vue'
import { VueDraggable } from 'vue-draggable-plus';
import type { FormInstance, FormRules } from "element-plus";
const props = withDefaults(defineProps<{
  svg:string
}>(),{
  svg:""
})
const visible = ref(false)//避免不必要的DOM渲染
import { useIconStore } from '~/stores/icon';
import {exec} from '~/api/icon'
const icon = useIconStore()
function resetUUID(){
  form.uuid = uuid()
  form.copyStatus = 'copy'
}
const format = (svg: string) => {
let res = icon.row.icon_tree.filter((it) => it.uuid == svg);
  if (res.length <= 0) {
    return "";
  } else if (res.length == 1) {
    return res[0].svg;
  } else {
    throw Error("uuid duplication!");
  }
};
function copy(){
  navigator.clipboard.writeText(form.uuid).then(() => {
    form.copyStatus = 'copied'
  });
}
const emit = defineEmits(['update:svg'])
const click = (uuid:string) => {
  emit('update:svg',uuid)
}
watch(()=>icon.row,(newRow)=>{
  if(visible.value){
    exec({
      database: "host=127.0.0.1&port=3306&user=root&password=tanglei&database=union",
      query: {
        sqls: [
          "UPDATE `union`.`图标` SET `icon_tree` = ? where `uuid` = '" + newRow.uuid+"'",
        ],
        vals:[
          [JSON.stringify(icon.row.icon_tree)]
        ],
      },
    }).then((res:any) => {
      // console.log('->',res.data)
    })
  }
},{
  deep:true
})
function move(event:any){
  const draggedElement = event.dragged;
  const targetElement = event.related;
  if (targetElement.classList.contains('no-drag') || draggedElement.classList.contains('no-drag')) {
      // 阻止拖拽
      return false;
  }
  return true
}
const form = reactive<{
  uuid:string
  name:undefined|string
  svg:undefined|string
  status:"新增"|"修改"
  dialogFormVisible:boolean
  copyStatus:"copy"|"copied"
}>({
  uuid: uuid(),
  name: "",
  svg: "",
  status:"新增",
  dialogFormVisible:false,
  copyStatus:'copy'
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules<typeof form>>({});
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  form.dialogFormVisible = false;
  formEl.validate((valid:boolean) => {
    if (valid) {
      console.log("submit!");
      if(!/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/.test(form.uuid)){
        form.uuid = uuid()
      }
      let results = icon.row.icon_tree.filter((item)=>item.uuid==form.uuid)
      if(form.status == '新增'){
        if(results.length==0){
          icon.row.icon_tree.push(JSON.parse(JSON.stringify(form)))
        }else{
          throw Error('uuid duplication!')
        }
      }else if(form.status == '修改'){
        tmp.uuid = form.uuid
        tmp.name = form.name
        tmp.svg = form.svg
      }
    } else {
      console.log("error submit!");
      return;
    }
  });
};
const addIcon = () => {
  form.status = '新增'
  form.uuid = uuid();
  form.copyStatus = 'copy'
  form.svg = "";
  form.name = "";
  form.dialogFormVisible = true;
};
let tmp:any;
const storeIcon = (v: any) => {
  tmp = v
  form.status = '修改'
  form.uuid = v.uuid
  form.name = v.name
  form.svg = v.svg
  form.copyStatus = 'copy'
  form.dialogFormVisible = true;
};
const deleteIcon = (v:any)=>{
  let index = icon.row.icon_tree.indexOf(v)
  if(index>=0){
    icon.row.icon_tree.splice(index,1)
  }
}
</script>
<style lang="scss">
.custom-popover{
  width: 1000px;
}
.drag-area{
  grid-template-columns: repeat(20, minmax(0, 1fr));
  place-items: start;
  place-content: center;
}
.icon-item{
  .candidate{
    border:1px solid transparent;
  }
  .candidate.selected{
    border:1px solid blue;
    border-radius: 50%;
  }
  .delete,.edit{
    display: none;
  }
}
.icon-item:hover{
  .delete,.edit{
    display: block;
  }
}

.dark .candidate.selected{
  border:1px solid yellow;
}
.uuid .ep-input__inner{
  font-family: Menlo,Consolas,Monaco;
}
</style>