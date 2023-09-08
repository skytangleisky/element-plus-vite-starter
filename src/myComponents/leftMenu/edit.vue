<template>
  <div
    class="flex-col"
    style="color: black; background-color: #fff; overflow: auto; width: 100%"
  >
    <div class="icons">
      <span v-for="v in icon.results"
        ><i
          class="icon"
          style="margin-right: 10px; width: 2em; height: 2em"
          v-html="v.svg"
        ></i
        >{{ v.name }}</span
      >
    </div>
    <h1>Nestable2</h1>
    <el-button text @click="dialogFormVisible = true"
      >open a Form nested Dialog</el-button
    >
    <el-dialog v-model="dialogFormVisible" title="Icon">
      <el-form :model="form" label-width="120px" ref="ruleFormRef" :rules="rules">
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
          <el-input v-model="form.updatetime" placeholder="autogeneration" />
        </el-form-item>
        <el-form-item label="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="svg">
          <el-input v-model="form.svg" />
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <p>
      Drag &amp; drop hierarchical list with mouse and touch compatibility (jQuery plugin)
    </p>

    <p>
      <strong><a href="https://github.com/RamonSmit/Nestable2">Code on GitHub</a></strong>
    </p>

    <menu id="nestable-menu">
      <button type="button" data-action="expand-all">Expand All</button>
      <button type="button" data-action="collapse-all">Collapse All</button>
      <button type="button" data-action="add-item">Add new item</button>
      <button type="button" data-action="replace-item">Replace item 10</button>
      <button type="button" data-action="remove-item">Remove item</button>
    </menu>

    <div class="cf nestable-lists">
      <div v-show="show" class="dd" id="nestable"></div>

      <div class="dd" id="nestable2">
        <ol class="dd-list">
          <li class="dd-item" data-id="13">
            <div class="dd-handle">Item 13</div>
          </li>
          <li class="dd-item" data-id="14">
            <div class="dd-handle">Item 14</div>
          </li>
          <li class="dd-item" data-id="15">
            <div class="dd-handle">Item 15</div>
            <ol class="dd-list">
              <li class="dd-item" data-id="16">
                <div class="dd-handle">Item 16</div>
              </li>
              <li class="dd-item" data-id="17">
                <div class="dd-handle">Item 17</div>
              </li>
              <li class="dd-item" data-id="18">
                <div class="dd-handle">Item 18</div>
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </div>

    <p><strong>Serialised Output (per list)</strong></p>

    <textarea id="nestable-output"></textarea>
    <textarea id="nestable2-output"></textarea>

    <p>&nbsp;</p>

    <div class="cf nestable-lists">
      <p><strong>Draggable Handles</strong></p>

      <p>
        If you're clever with your CSS and markup this can be achieved without any
        JavaScript changes.
      </p>

      <div class="dd" id="nestable3">
        <ol class="dd-list">
          <li class="dd-item dd3-item" data-id="13">
            <div class="dd-handle dd3-handle">Drag</div>
            <div class="dd3-content">Item 13</div>
          </li>
          <li class="dd-item dd3-item" data-id="14">
            <div class="dd-handle dd3-handle">Drag</div>
            <div class="dd3-content">Item 14</div>
          </li>
          <li class="dd-item dd3-item" data-id="15">
            <div class="dd-handle dd3-handle">Drag</div>
            <div class="dd3-content">Item 15</div>
            <ol class="dd-list">
              <li class="dd-item dd3-item" data-id="16">
                <div class="dd-handle dd3-handle">Drag</div>
                <div class="dd3-content">Item 16</div>
              </li>
              <li class="dd-item dd3-item" data-id="17">
                <div class="dd-handle dd3-handle">Drag</div>
                <div class="dd3-content">Item 17</div>
              </li>
              <li class="dd-item dd3-item" data-id="18">
                <div class="dd-handle dd3-handle">Drag</div>
                <div class="dd3-content">Item 18</div>
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </div>

    <p class="small">
      Copyright &copy; <a href="http://dbushell.com/">David Bushell</a> | Made for
      <a href="http://www.browserlondon.com/">Browser</a>
    </p>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import "./jquery.nestable.js";
import "./jquery.nestable.scss";
import { useRouter } from "vue-router";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import { array2components } from "~/tools/index";
const router = useRouter();
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

const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules<typeof form>>({});
const show = ref(true);
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
  name: null,
  svg: null,
});
onMounted(() => {
  $(document).ready(function () {
    var updateOutput = function (e: any) {
      var list = e.length ? e : $(e.target),
        output = list.data("output");
      if (window.JSON) {
        output.val(window.JSON.stringify(list.nestable("serialize"))); //, null, 2));
      } else {
        output.val("JSON browser support required for this demo.");
      }
    };

    var json = [
      {
        id: 1,
        content: "First item",
        classes: ["dd-nochildren"],
      },
      {
        id: 1,
        content: "Second item",
        children: [
          {
            id: 1,
            content: "Item 3",
          },
          {
            id: 4,
            content: "Item 4",
          },
          {
            id: 5,
            content: "Item 5",
            value: "Item 5 value",
            foo: "Bar",
            children: [
              {
                id: 6,
                content: "Item 6",
              },
              {
                id: 7,
                content: "Item 7",
              },
              {
                id: 8,
                content: "Item 8",
              },
            ],
          },
        ],
      },
      {
        id: 9,
        content: "Item 9",
      },
      {
        id: 10,
        content: "Item 10",
        children: [
          {
            id: 11,
            content: "Item 11",
            children: [
              {
                id: 12,
                content: "Item 12",
              },
            ],
          },
        ],
      },
    ];
    let recursion = (array: []) => {
      const arr = JSON.parse(JSON.stringify(array));
      const fn = (l: any) => {
        l.map((v: any) => {
          if (v.children instanceof Array) {
            fn(v.children);
          }
          v.id = v.name;
          delete v.name;
        });
      };
      fn(arr);
      return arr;
    };

    json = recursion(setting.routes);

    // activate Nestable for list 1
    $("#nestable")
      .nestable({
        group: 1,
        json: json,
        contentCallback: function (item) {
          var content = `<span style="background:cyan;">${item.id}</span> <i class="bg-red">${item.path}</i> <span class="bg-green">${item.component}</span>`;
          return content;
        },
      })
      .on("change", output)
      .on("gainedItem", output)
      .on("lostItem", output)
      .on("change", updateOutput);
    function output() {
      let result = $(this).nestable("serialize");
      let recursion = (array: []) => {
        const arr = JSON.parse(JSON.stringify(array));
        const fn = (l: any) => {
          l.map((v: any) => {
            if (v.children instanceof Array) {
              fn(v.children);
            }
            v.name = v.id;
            delete v.id;
          });
        };
        fn(arr);
        return arr;
      };
      result = recursion(result);
      console.log("------------>", result);
      setting.routes = result;
      router.getRoutes().forEach((v) => {
        v.name && router.removeRoute(v.name);
      });
      array2components(setting.routes).map((v: any) => {
        router.addRoute(v);
      });
    }

    // activate Nestable for list 2
    $("#nestable2")
      .nestable({
        group: 1,
      })
      .on("change", updateOutput);

    // output initial serialised data
    updateOutput($("#nestable").data("output", $("#nestable-output")));
    updateOutput($("#nestable2").data("output", $("#nestable2-output")));

    $("#nestable-menu").on("click", function (e) {
      var target = $(e.target),
        action = target.data("action");
      if (action === "expand-all") {
        $(".dd").nestable("expandAll");
      }
      if (action === "collapse-all") {
        $(".dd").nestable("collapseAll");
      }
      if (action === "add-item") {
        var newItem = {
          id: "11",
          content: "Item 11",
          label: "label",
          component: "component",
          path: "/path",
          parent_id: "65e99b66-e340-4d4b-6b26-629f41dc63d9",
          children: [
            {
              id: "12",
              content: "Item 12",
              label: "label",
              component: "component",
              path: "path",
              children: [
                {
                  id: "13",
                  content: "Item 13",
                  label: "label",
                  component: "component",
                  path: "path",
                },
              ],
            },
          ],
        };
        $("#nestable").nestable("add", newItem, () => {
          console.log("added");
        });
      }
      if (action === "remove-item") {
        $("#nestable").nestable("remove", "11", () => {
          console.log("removed");
        });

        // router.addRoute(
        //     {
        //     path: '/openlayers',
        //     component:modules['/src/myComponents/openlayers/index.vue']
        //     }
        // )
        // router.push({ path: "/openlayers", replace: false });
      }
      if (action === "replace-item") {
        var replacedItem = {
          id: "11",
          content: "New item 11",
          path: "/newPath",
          label: "11",
          component: "new component",
          children: [
            {
              id: "12",
              content: "Item 12",
              path: "path",
              label: "12",
              component: "component",
              children: [
                {
                  id: "13",
                  content: "Item 13",
                  path: "path",
                  label: "13",
                  component: "component",
                },
              ],
            },
          ],
        };
        $("#nestable").nestable("replace", replacedItem, () => {
          console.log("replaced");
        });
      }
    });
    $("#nestable3").nestable();
  });
});
// onBeforeUnmount(()=>{
//     $('.dd').nestable('removeAll')
//     $('.dd').nestable('destroy')
// })
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
  padding: 30px 0;
  width: 100%;
  border: 0;
  border-top: 2px solid #ddd;
  border-bottom: 2px solid #ddd;
}

#nestable-menu {
  padding: 0;
  margin: 20px 0;
}

#nestable-output,
#nestable2-output {
  width: 100%;
  height: 7em;
  font-size: 0.75em;
  line-height: 1.333333em;
  font-family: Consolas, monospace;
  padding: 5px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

#nestable2 .dd-handle {
  color: #fff;
  border: 1px solid #999;
  background: #bbb;
  background: -webkit-linear-gradient(top, #bbb 0%, #999 100%);
  background: -moz-linear-gradient(top, #bbb 0%, #999 100%);
  background: linear-gradient(top, #bbb 0%, #999 100%);
}

#nestable2 .dd-handle:hover {
  background: #bbb;
}

#nestable2 .dd-item > button:before {
  color: #fff;
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

.icon {
  height: 1em;
  width: 1em;
  line-height: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  // color:red;
  fill: currentColor;
  font-size: inherit;
  svg {
    width: inherit;
    height: inherit;
  }
}
</style>
