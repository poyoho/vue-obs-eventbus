import { defineBus } from "vue-obs-eventbus"

export default defineBus<{
  "print": any,
  "error": any,
  "save": any,
  "show": any,
}>('default')
