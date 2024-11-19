import { ElMessage } from 'element-plus'

export function useMessage() {
  return {
    info(title: string): void {
      ElMessage.info({
        message: title,
        duration: 3000,
      })
    },
    warning(title: string): void {
      ElMessage.warning({
        message: title,
        duration: 3000,
      })
    },
    success(title: string): void {
      ElMessage.success({
        message: title,
        duration: 3000,
      })
    },
    error(title: string): void {
      ElMessage.error({
        message: title,
        duration: 3000,
      })
    },
  }
}
