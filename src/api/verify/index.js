import request from '@/utils/request'

/**
 * 获取验证图片  以及token
 *
 * @param data
 * @returns {*}
 */
export function reqGet(data) {
  return request({
    url: '/auth/v1/captcha/code',
    method: 'post',
    data,
  })
}

/**
 * 滑动或者点选验证
 *
 * @param data
 * @returns {*}
 */
export function reqCheck(data) {
  return request({
    url: '/auth/v1/captcha/check',
    method: 'post',
    data,
  })
}
