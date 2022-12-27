export const IS_CLIENT = typeof window !== 'undefined'

export function toastMessage(
  message: string,
  type?: 'normal' | 'error' | 'warn' | undefined
) {
  const piniaMessage = '🚗 ' + message

  if (typeof __VUE_DEVTOOLS_TOAST__ === 'function') {
    __VUE_DEVTOOLS_TOAST__(piniaMessage, type)
  } else if (type === 'error') {
    console.error(piniaMessage)
  } else if (type === 'warn') {
    console.warn(piniaMessage)
  } else {
    console.log(piniaMessage)
  }
}
