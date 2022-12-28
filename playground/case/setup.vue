<template>
  <h2>setup api:</h2>
  <button @click="emitHello">{{ print }}</button>
  <button @click="emitError">error</button>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import eventbus from "./eventbus"

const print = ref('<emit print event>')

eventbus.on('print', (data) => {
  print.value = data.data
})

eventbus.on('error', (data) => {
  throw data
})

function emitHello() {
  eventbus.emit('print', { data: 'print' })
}

function emitError() {
  eventbus.emit('error', { error: 'error' })
}
</script>
