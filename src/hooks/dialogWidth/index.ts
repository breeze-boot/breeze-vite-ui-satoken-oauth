import useSettingStore from '@/store/modules/setting.ts'

export default function useWidth(): string {
  const settingStore = useSettingStore()
  return (() => settingStore.dialogWidth)()
}
