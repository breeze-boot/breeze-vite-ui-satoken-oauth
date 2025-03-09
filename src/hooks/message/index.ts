import { ElMessage } from 'element-plus'

// 可以通过提取公共逻辑来减少代码重复
function showMessage(type: 'info' | 'warning' | 'success' | 'error', title: string) {
  ElMessage[type]({
    message: title,
    duration: 3000,
  })
}

export function useMessage() {
  return {
    info(title: string): void {
      showMessage('info', title)
    },
    warning(title: string): void {
      showMessage('warning', title)
    },
    success(title: string): void {
      showMessage('success', title)
    },
    error(title: string): void {
      showMessage('error', title)
    },
  }
}
