import { createEventBus } from "vue-obs-eventbus"

export default createEventBus<{
  "print": any,
  "error": any,
  "save": any,
  "show": any,
}>('default')
