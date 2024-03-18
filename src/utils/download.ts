/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { saveAs } from 'file-saver'

export const saveFile = (data: any, name: string) => {
  saveAs(new Blob([data], { type: 'application/octet-stream; charset=UTF-8' }), name)
}
