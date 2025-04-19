/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { Column, Table, TableQuery } from '@/api/dev/tables/type.ts'

enum API {
  MYSQL_DB_CODE_URL = '/dev/v1/db',
  GEN_CODE_URL = '/gen/v1',
}

/**
 * 表信息
 */
export function listTables(data: TableQuery): Promise<Table> {
  return request<any, Table>({
    url: `${API.MYSQL_DB_CODE_URL}/tables`,
    method: 'post',
    data,
  })
}

/**
 * 表字段信息
 */
export function listColumns(params: any): Promise<Column> {
  return request<any, Column>({
    url: `${API.MYSQL_DB_CODE_URL}/columns`,
    method: 'get',
    params,
  })
}

/**
 * 生成代码
 */
export function genCode(tableName: string[]): Promise<Table> {
  return request<any, Table>({
    url: `${API.GEN_CODE_URL}/generate-code`,
    method: 'get',
    params: {
      tableName: tableName,
      packageName: 'com.breeze.boot',
      moduleName: 'dev',
      author: 'gaoweixuan',
    },
    // 指定响应类型为二进制流
    responseType: 'blob',
  })
}
