// 1.函数式组件
// export default () => <div> Tsx </div>

// 2.defineComponent() render Options API
// import { defineComponent } from "vue"
// export default defineComponent({
//   render(){
//     return <div> Tsx </div>
//   }
// })

// defineComponent() setup Composition API
import { defineComponent, ref } from "vue"
export default defineComponent({
  setup() {
    const counter = ref<number>(0)
    return () => <div> Tsx { counter.value }</div>
  }
})