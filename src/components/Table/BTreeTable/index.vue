<script setup lang="ts">
import { ElMessage, ElMessageBox, ClickOutside as vClickOutside } from 'element-plus'
import { Btn, Field, HandleBtn as handleType, QueryParams } from '@/components/Table/types/types.ts'
import { watch, unref } from 'vue'
import { onUpdated, onMounted, reactive, ref, computed, nextTick } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import { camelCaseToUnderscore } from '@/utils/common.ts'
import { useDict } from '@/hooks/dict'
import useUserStore from '@/store/modules/user.ts'
import TableItem from '@/components/Table/TableItem/TableItem.vue'

const useStore = useUserStore()

type TransferKey = number

defineOptions({
  name: 'BTreeTable',
  inheritAttrs: false,
})

const { t } = useI18n()

const props = defineProps({
  // 表格顶部按钮
  tbHeaderBtn: {
    type: Array,
    default: () => [],
  },
  // 表格使用的字典
  dict: {
    type: Array,
    default: () => [],
  },
  // 表格宽度，默认100%
  tableWidth: {
    type: String,
    default: '100%',
  },
  // 表格高度，默认60%
  tableHeight: {
    type: String,
    default: '60%',
  },
  // 获取数据的接口
  listApi: {
    type: Function,
    required: true,
  },
  // 导出数据的接口
  exportApi: {
    type: Function,
    required: true,
  },
  // 是否显示序号
  tableIndex: {
    type: Boolean,
    default: false,
  },
  // 选择框样式
  select: {
    type: String,
    default: 'single',
  },
  // 主键
  pk: {
    type: String,
    default: 'id',
  },
  // 选中行数据
  checkedRows: {
    type: Array,
    default: () => [],
  },
  // 表格字段配置
  fieldList: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 操作栏配置
  handleBtn: {
    type: Object,
    default: () => {},
  },
  // 操作按钮集合disabled
  btnDisableSets: {
    type: Function,
    default: () => false,
  },
  // 是否分页
  pager: {
    type: Boolean,
    default: true,
  },
  // 重置到第一页
  reloadCurrentPage: {
    type: Number,
  },
  // 查询条件
  query: {
    type: Object,
    default: () => {},
  },
  // 刷新
  refresh: {
    type: Number,
  },
  // 开启初始化后自动刷新
  mountedRefresh: {
    type: Boolean,
    default: true,
  },
})
const tableRef = ref<any>()

const $emit = defineEmits([
  'handle-table-header-btn-click',
  'handle-row-db-click',
  'selection-change',
  'handle-table-row-btn-click',
])
const tableInfo = reactive({
  loading: false,
  // 分页信息
  pagerQuery: {
    layout: 'total,sizes,prev,pager,next,jumper',
    pageSizes: [10, 20, 50, 100, 200, 300, 500, 600],
    // 分页查询条件
    query: {
      // 总条数
      total: 0,
      // 当前页
      current: 1,
      // 每页条数
      size: 10,
    },
  },
  // 显示的列
  showFieldList: [] as Field[],
  // 是否展开
  expandAll: false,
  // 表格的值
  rows: [],
})

let hiddenColumnValue = ref<number[]>()
let singleSelectValue = ref<undefined | any | number>()
let currentRows = ref<any>()

/**
 * 初始化事件
 */
onMounted(() => {
  initColumns()
  refreshData()
})

/**
 * 更新事件
 */
onUpdated(() => {
  return tableRef.value.doLayout()
})

/**
 * 初始化列
 */
const initColumns = () => {
  let _columnValue: number[] = []
  ;(props.fieldList as Field[])?.forEach((item: Field, index: number) => {
    let _item: Field = {
      ...item,
      key: index,
      hidden: true,
      disabled: false,
    }
    if (useStore.excludeColumn.includes(camelCaseToUnderscore(item.prop))) {
      _columnValue?.push(index)
      _item.hidden = false
      _item.disabled = true
    }
    tableInfo.showFieldList.push(_item)
  })
  hiddenColumnValue.value = _columnValue
}

/**
 * 刷新数据
 */
const refreshData = () => {
  if (props.mountedRefresh) {
    getList()
  }
}

/**
 * 初始化操作按钮
 */
const initHandleBtn = reactive(props.handleBtn as handleType)
const handleBtnOperate = props.handleBtn || false

/**
 * 表格样式计算属性
 */
const tableField = computed(() => tableInfo.showFieldList.filter((item) => item.hidden))

/**
 * 表格展开
 */
const expandAll = computed({
  get: () => {
    return tableInfo.expandAll
  },
  set: (value) => {
    tableInfo.expandAll = value
  },
})

/**
 * 表格样式计算属性
 */
const tableStyle = computed(() => ({ width: props.tableWidth }))

/**
 * 是否开启分页
 */
const enablePager = ref(props.pager)

/**
 * 表格渲染需要的字典
 */
const dict = useDict(...props.dict)

/**
 * 初始化表格顶部按钮设置
 */
const initTbHeaderBtn = computed(() => props.tbHeaderBtn as Btn[])

/**
 * 处理查询条件
 */
const handleParams = () => {
  const obj = {} as QueryParams
  for (const key in props.query) {
    if (props.query[key] || props.query[key] === 0) {
      obj[key] = props.query[key]
    }
  }
  // 根据分页条件，整个查询
  return props.pager ? { ...obj, ...tableInfo.pagerQuery.query } : obj
}

/**
 * 获取数据
 */
const getList = () => {
  singleSelectValue.value = undefined
  if (!props.listApi) return
  props.listApi(handleParams()).then((response: any) => {
    if (response.code === '0000') {
      tableInfo.rows = []
      if (props.pager) {
        tableInfo.rows = response.data.records
        tableInfo.pagerQuery.query.total = Number(response.data.total)
      } else {
        tableInfo.rows = response.data
      }
      // 设置当前选中项
      if (!props.checkedRows) {
        return
      }

      props.checkedRows.forEach((selected: any) => {
        const row = tableInfo.rows.find(
          (item) => item[props.pk] === selected[props.pk] || item[props.pk] + '' === selected,
        )
        nextTick(() => {
          if (!row) return
          tableRef.value.toggleRowSelection(row, true)
        })
      })
    } else {
      ElMessage.warning(response.message)
    }
  })
}

/**
 * 页码改变事件
 *
 * @param size
 */
const handleSizeChange = (size: number) => {
  tableInfo.pagerQuery.query.size = size
  getList()
}

/**
 * 当前页改变事件
 *
 * @param current
 */
const handleCurrentChange = (current: number) => {
  tableInfo.pagerQuery.query.current = current
  getList()
}

/**
 * 选中行数据执行
 *
 * @param rows
 */
const handleSelectionChange = (rows: any) => {
  $emit('selection-change', rows)
  currentRows.value = rows
}

/**
 * 点击表格的行项目 选中当前行
 *
 * @param row
 */
const handleRowClick = (row: any) => {
  const index = (tableInfo.rows as []).findIndex((item: any) => item[props.pk] === row[props.pk])
  if (index !== -1) {
    singleSelectValue.value = index
  }
  currentRows.value = [row]
  $emit('selection-change', cloneDeep(row))
  if (row) {
    tableRef.value!.toggleRowSelection(row, undefined)
  } else {
    tableRef.value!.clearSelection()
  }
}

/**
 * 双击表格的行项目
 *
 * @param row
 */
const handleRowDbClick = (row: any) => {
  $emit('handle-row-db-click', row)
}

/**
 * 派发按钮点击事件
 *
 * @param event
 * @param row
 * @param index
 */
const handleTableRowClick = (event: string, row: any, index: number) => {
  switch (event) {
    case 'delete' || 'remove':
      confirmBox(() => {
        $emit('handle-table-row-btn-click', event, row, index)
      })
      break
    default:
      $emit('handle-table-row-btn-click', event, row, index)
      break
  }
}

/**
 * 确认删除
 *
 * @param func
 */
const confirmBox = (func: any) => {
  ElMessageBox.confirm(t('common.tableRowConfirmMsg'), t('common.delete'), {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      func()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: t('common.cancel'),
      })
    })
}

/**
 * 派发表格顶部按钮点击事件
 *
 * @param event
 * @param rows
 */
const handleTableHeaderClick = (event: string, rows: any) => {
  switch (event) {
    case 'del':
      checkBeforeClickBtn().then(() => {
        confirmBox(() => {
          $emit('handle-table-header-btn-click', event, rows)
        })
      })
      break
    case 'add':
      $emit('handle-table-header-btn-click', event, rows)
      break
    case 'export':
      handleExport(props.query)
      break
    default:
      $emit('handle-table-header-btn-click', event, rows)
      break
  }
}

/**
 * 按钮点击前校验方法
 */
const checkBeforeClickBtn = () => {
  return new Promise((resolve, reject) => {
    if (!currentRows.value || currentRows.value.length === 0) {
      ElMessage.warning(t('common.selectLineItem'))
      reject()
      return
    }
    resolve({})
  })
}

/**
 * 后台请求导出数据，处理数据
 *
 * @param query
 */
const handleExport = (query: any) => {
  if (!props.exportApi) {
    ElMessage.warning('导出数据错误')
    return
  }
  console.debug(query)
}

/**
 * 监听方法
 */
watch(
  () => props.reloadCurrentPage,
  () => {
    tableInfo.pagerQuery.query.current = 1
    getList()
  },
)
/**
 * 监听方法
 */
watch(
  () => props.refresh,
  () => {
    getList()
  },
)

// 弹出
const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

const filterMethod = (query: string, item: Field) => {
  return item.label.toLowerCase().includes(query.toLowerCase())
}

const handleChangeColumn = (value: TransferKey[], direction: string, movedKeys: TransferKey[]) => {
  if (direction === 'left') {
    movedKeys.forEach((key: number) => {
      tableInfo.showFieldList.forEach((item: Field) => {
        if (tableInfo.showFieldList[key].prop === item.prop) {
          tableInfo.showFieldList[key].hidden = true
        }
      })
    })
  } else if (direction === 'right') {
    movedKeys.forEach((key: number) => {
      tableInfo.showFieldList.forEach((item: Field) => {
        if (tableInfo.showFieldList[key].prop === item.prop) {
          tableInfo.showFieldList[key].hidden = false
        }
      })
    })
  }
}
</script>

<template>
  <el-popover
    placement="left-start"
    :popper-style="{
      width: 1000,
    }"
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="click"
    :title="t('common.tableColumn')"
    virtual-triggering
  >
    <el-transfer
      v-model="hiddenColumnValue"
      filterable
      style="text-align: left; display: inline-block"
      :titles="[t('common.showTableColumn'), t('common.hiddenTableColumn')]"
      :filter-method="filterMethod"
      :filter-placeholder="t('common.search')"
      :data="tableInfo.showFieldList"
      @change="handleChangeColumn"
    >
      <template #default="{ option }">
        <span>{{ option.key }} - {{ option.label }}</span>
      </template>
    </el-transfer>

    <div class="footer">
      <el-button>取消</el-button>
      <el-button type="primary">确认</el-button>
    </div>
  </el-popover>
  <el-card shadow="never" style="margin: 10px 0">
    <template #header>
      <div class="tools">
        <div v-if="initTbHeaderBtn" class="table-btn-group">
          <svg-button
            v-for="(item, index) in initTbHeaderBtn"
            :key="index"
            :type="item.type"
            :circle="false"
            :label="item.label"
            :icon="item.icon"
            v-has="item.permission"
            @svg-btn-click="handleTableHeaderClick(item.event, currentRows)"
          />
          <svg-button
            icon="expend"
            type="success"
            :circle="false"
            label="全部展开"
            @svg-btn-click="() => (expandAll = !expandAll)"
          />
          <slot name="tbHeaderBtn"></slot>
        </div>
        <div class="tool-btn">
          <svg-button
            ref="buttonRef"
            v-click-outside="onClickOutside"
            icon="filter"
            width="1.5rem"
            height="1.5rem"
            :circle="true"
          />
        </div>
      </div>
    </template>

    <div class="table">
      <el-table
        ref="tableRef"
        :fit="true"
        :data="tableInfo.rows"
        :max-height="tableHeight"
        :height="tableHeight"
        v-loading="tableInfo.loading"
        border
        :default-expand-all="expandAll"
        stripe
        :key="Math.random()"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :style="tableStyle"
        :highlight-current-row="true"
        @select-all="handleSelectionChange"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDbClick"
        @row-click="handleRowClick"
      >
        <el-table-column
          v-if="props.select === 'multi'"
          key="selection"
          fixed="left"
          align="center"
          type="selection"
          width="60"
        />
        <el-table-column
          v-else-if="props.select === 'single'"
          key="singleSelect"
          fixed="left"
          type="index"
          align="center"
          width="60"
        >
          <template #default="scope">
            <el-radio v-model="singleSelectValue" :label="scope.$index">{{}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('common.no')"
          fixed
          align="center"
          v-if="props.tableIndex"
          type="index"
          :width="tableField.length === 0 ? '' : 66"
        />

        <el-table-column
          v-for="(item, index) in tableField"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align || 'left'"
          :header-align="item.align || 'left'"
          :width="item.width"
          :min-width="item.minWidth || '100px'"
          :show-overflow-tooltip="item.showOverflowTooltip"
          :fixed="item.fixed"
        >
          <template #default="scope">
            <!-- 多级表头 -->
            <template v-if="item.children">
              <el-table-column
                v-for="(_item, _index) in item.children"
                :key="_index"
                :label="_item.label"
                :align="_item.align || 'center'"
                :header-align="_item.align || 'center'"
                :width="_item.width"
                :min-width="_item.minWidth || '100px'"
                :show-overflow-tooltip="_item.showOverflowTooltip"
                :fixed="_item.fixed"
              >
                <template #default="_">
                  <TableItem
                    @reload-data-list="getList"
                    :scope="{
                      row: _.row[item.prop],
                      $index: _.$index,
                      column: _.column,
                    }"
                    :table-field="_item"
                    :dict="dict"
                    :key="_index"
                  />
                </template>
              </el-table-column>
            </template>
            <TableItem @reload-data-list="getList" :scope="scope" :table-field="item" :dict="dict" :key="index" />
          </template>
        </el-table-column>

        <el-table-column
          key="handle"
          v-if="handleBtnOperate"
          :fixed="initHandleBtn.fixed"
          :align="initHandleBtn.align || 'center'"
          :label="initHandleBtn.label || t('common.operate')"
          :width="initHandleBtn.width"
          :min-width="initHandleBtn.minWidth"
        >
          <template #default="scope">
            <template v-for="item in initHandleBtn.btList" :key="item.event">
              <!-- 自定义操作类型 -->
              <slot v-if="item.slot" :name="`${item.slotName}`" :data="{ item, row: scope.row }"></slot>
              <!-- 操作按钮 -->
              <svg-button
                :circle="false"
                v-has="item.permission"
                :link="initHandleBtn.link || item.link"
                :icon="item.icon"
                :type="item.type"
                :label="item.label"
                :disabled="item.disabled || btnDisableSets(item.event, scope.row)"
                @svg-btn-click="handleTableRowClick(item.event, scope.row, scope.$index)"
              />
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template v-if="enablePager">
      <div class="table-pagination">
        <el-pagination
          v-model:current-page="tableInfo.pagerQuery.query.current"
          :page-size="tableInfo.pagerQuery.query.size"
          :total="tableInfo.pagerQuery.query.total"
          :page-sizes="tableInfo.pagerQuery.pageSizes"
          :layout="tableInfo.pagerQuery.layout"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
  </el-card>
</template>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  width: 100%;
  padding: 30px;
  height: 20px;
}

.tools {
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 100%;
  height: auto;

  .table-btn-group {
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    padding: 0 5px;
  }
}

.table-pagination {
  padding: 10px;
}
</style>
