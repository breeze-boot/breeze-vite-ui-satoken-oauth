import Cookies from 'js-cookie'

export enum CookiesKey {
  THEME_MODEL = 'THEME_MODEL',
  MENU_LAYOUT = 'MENU_LAYOUT',
  THEME_COLOR = 'THEME_COLOR',
  LANGUAGE = 'LANGUAGE',
  DEVICE = 'DEVICE',
  SIZE = 'SIZE',
}

export const CookiesStorage = {
  set(
    key: CookiesKey,
    value: any,
    options = {
      expires: 7,
    } as Cookies.CookieAttributes,
  ) {
    Cookies.set(key, value, options)
  },
  remove(key: CookiesKey): void {
    Cookies.remove(key)
  },
  get(key: CookiesKey): any {
    return Cookies.get(key)
  },
}
