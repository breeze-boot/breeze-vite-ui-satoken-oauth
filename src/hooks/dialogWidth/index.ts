export default function useWidth() {
  return ((): any => {
    const val = document.body.clientWidth
    const def = 800
    if (val < def) {
      return '100%'
    } else {
      return def + 'px'
    }
  })()
}
