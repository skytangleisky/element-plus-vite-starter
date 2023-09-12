<template>
  <my-component></my-component>
</template>
<script>
import { loadModule, version } from "vue3-sfc-loader";
import * as Vue from "vue";

const options = {
  moduleCache: {
    vue: Vue,
  },
  getFile(url) {
    if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
    } else if (url.indexOf("http:/") === 0) {
      url = url.replace("http:/", "http://");
    } else if (url.indexOf("https:/") === 0) {
      url = url.replace("https:/", "https://");
    } else {
    }
    return fetch(url).then((response) =>
      response.ok ? response.text() : Promise.reject(response)
    );
  },
  addStyle(styleStr) {
    const style = document.createElement("style");
    console.log(styleStr);
    style.textContent = styleStr;
    const ref = document.head.getElementsByTagName("style")[0] || null;
    document.head.insertBefore(style, ref);
  },
  log(type, ...args) {
    console.log(type, ...args);
  },
};

export default {
  components: {
    "my-component": Vue.defineAsyncComponent(() =>
      loadModule(
        "http://tanglei.top:81/demos/project/html5/vue3-sfc-loader/myComponent.vue",
        options
      )
    ),
  },
};
</script>
