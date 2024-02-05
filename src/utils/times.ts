export const loadGreetings = () => {
  let msg = ''
  const hours = new Date().getHours()
  if (hours <= 9) {
    msg = '早上'
  } else if (hours <= 12) {
    msg = '上午'
  } else if (hours <= 18) {
    msg = '下午'
  } else {
    msg = '晚上'
  }
  return msg
}
