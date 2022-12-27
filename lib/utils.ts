export const IS_CLIENT = typeof window !== 'undefined'

export function toastMessage(
  message: string,
  type?: 'normal' | 'error' | 'warn' | undefined
) {
  const eventbusMessage = '🚗 ' + message

  if (typeof __VUE_DEVTOOLS_TOAST__ === 'function') {
    __VUE_DEVTOOLS_TOAST__(eventbusMessage, type)
  } else if (type === 'error') {
    console.error(eventbusMessage)
  } else if (type === 'warn') {
    console.warn(eventbusMessage)
  } else {
    console.log(eventbusMessage)
  }
}
