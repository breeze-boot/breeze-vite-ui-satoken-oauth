/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import * as CryptoJS from 'crypto-js'

/**
 * 加密
 *
 * @param content
 * @param key
 * @returns {string}
 */
export const encrypt = (content: string, key: string) => {
  const sKey = CryptoJS.enc.Utf8.parse(key)
  const sContent = CryptoJS.enc.Utf8.parse(content)
  const encrypted = CryptoJS.AES.encrypt(sContent, sKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

/**
 * 解密
 *
 * @param content
 * @param key
 * @returns {*}
 */
export const decrypt = (content: string, key: string) => {
  const sKey = CryptoJS.enc.Utf8.parse(key)
  const decrypt = CryptoJS.AES.decrypt(content, sKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
