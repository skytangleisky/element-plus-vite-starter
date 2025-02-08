import { SceneMode } from 'cesium'
import { defineStore, acceptHMRUpdate } from "pinia"

export const useCesiumStore = defineStore('cesium',{
  state: () => ({
    sceneMode: SceneMode.SCENE3D,
    timeline:false,
    geocoder:false,
    homeButton:false,
    navigationHelpButton:false,
    sceneModePicker:false,
    baseLayerPicker:false,
  }),
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCesiumStore, import.meta.hot))
}

