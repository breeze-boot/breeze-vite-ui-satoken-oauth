import i18n from '@/i18n'

export const loadGreetings = () => {
  let msg = ''
  const hours = new Date().getHours()
  if (hours <= 9) {
    msg = i18n.global.t('halo.goodMorning')
  } else if (hours <= 12) {
    msg = i18n.global.t('halo.goodMorning')
  } else if (hours <= 18) {
    msg = i18n.global.t('halo.goodAfternoon')
  } else {
    msg = i18n.global.t('halo.goodEvening')
  }
  return msg
}
