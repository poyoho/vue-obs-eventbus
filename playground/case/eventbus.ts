import { defineEventBus } from "vue-obs-eventbus"

export default defineEventBus<{
  "print": any,
  "save": any,
  "show": any,
}>()
