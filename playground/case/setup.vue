<template>
  <h2>setup api:</h2>
  <button @click="emitHello">{{ print }}</button>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import useEventBus from "./eventbus"

const eventbus = useEventBus()
const print = ref('<emit print event>')

eventbus.on('print', (data) => {
  print.value = data.data
})

function emitHello() {
  eventbus.emit('print', { data: 'print' })
}
</script>
