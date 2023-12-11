import App from './App.vue'
import { createApp } from 'vue'
// pinia 修改源代码，删除node_modules/.vite使代码生效，或者vite --force
// newStore._hmrPayload.state.forEach((stateKey) => {
//   if (stateKey in store.$state) {
//     const newStateTarget = newStore.$state[stateKey]
//     const oldStateSource = store.$state[stateKey]
//     if (
//       typeof newStateTarget === 'object' &&
//       isPlainObject(newStateTarget) &&
//       isPlainObject(oldStateSource)
//     ) {
//       patchObject(newStateTarget, oldStateSource)
//     } else {
//       // transfer the ref
//       // newStore.$state[stateKey] = oldStateSource // error
//       set(store.$state,stateKey,newStateTarget) // tanglei
//     }
//   }
//   // patch direct access properties to allow store.stateProperty to work as
//   // store.$state.stateProperty
//   // set(store, stateKey, toRef(newStore.$state,stateKey)) // error
//   set(store, stateKey, newStore.$state[stateKey]) // tanglei
// })
import { createPinia } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import piniaReset from './tools/piniaReset'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(piniaReset)
const app = createApp(App)
app.use(pinia)
export default app