<template>
  <div class="absolute inset-0 bg-#00000040 z-1" @click="hide">
    <audio class="absolute left-50% top-50%" style="transform: translate(-50%,-50%);" ref="player" :src="url" controls></audio>
  </div>
</template>
<script lang="ts" setup>
import { ref,onMounted } from 'vue';
const emits = defineEmits(['update:show'])
function hide(){
  emits('update:show',false)
}
import url from './household_alarm_clock_beep_tone.mp3?url'
const player = ref<HTMLAudioElement>()
onMounted(()=>{
  console.log(player)
})
</script>
<style lang="scss">
</style>