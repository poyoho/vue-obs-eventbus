<template>
  <h2>options api: </h2>
  <button @click="emitHello">{{ print }}</button>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
  data() {
    return {
      print: '<emit show event>'
    }
  },
  created() {
    this.$eventbus.on('show', (data) => {
      this.print = data
    })
  },
  methods: {
    emitHello() {
      this.$eventbus.emit('show', 'show')
    }
  }
})
</script>
