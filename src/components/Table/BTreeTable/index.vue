<script setup lang="ts">
import { ElMessage, ElMessageBox, ClickOutside as vClickOutside } from 'element-plus'
import { Btn, Field, HandleBtn as handleType, QueryParams } from '@/components/Table/types/types.ts'
import { watch, unref } from 'vue'
import { storeToRefs } from 'pinia'
import { onUpdated, onMounted, reactive, ref, computed, nextTick } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import { camelCaseToUnderscore } from '@/utils/common.ts'
import TableItem from '@/components/Table/TableItem/TableItem.vue'
import { VueDraggable } from 'vue-draggable-plus'
import useColumnStore from '@/store/modules/column.ts'
import { useRoute } from 'vue-router'
import { ColumnCacheData } from '@/types/types.ts'
import SvgButton from '@/components/SvgButton/index.vue'
import useSettingStore from '@/store/modules/setting.ts'
import { useDict } from '@/hooks/dict'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'BTreeTable',
  inheritAttrs: false,
})

/**
 * 使用 defineProps 定义组件的 props，并指定其类型为 TableProps 接口所定义的类型
 */
const props = defineProps({
  tbHeaderBtn: {
    type: Array as () => Btn[],
    default: () => [],
    /**
     * 默认值为一个空数组，表示初始时表格顶部没有按钮
     */
  },
  tableWidth: {
    type: String,
    default: '100%',
    /**
     * 默认值为 '100%'，表示表格宽度占父容器的 100%
     */
  },
  tableHeight: {
    type: String,
    default: '60%',
    /**
     * 默认值为 '60%'，表示表格高度占父容器的 60%
     */
  },
  // 获取数据的接口
  listApi: {
    type: Function,
    required: false,
    default: undefined,
    /**
     * 默认值为 undefined，表示如果未提供获取数据的接口函数，则需要通过其他方式提供表格数据
     */
  },
  dict: {
    type: Array as () => string[],
    default: () => [],
    /**
     * 默认值为一个空数组，表示初始时没有使用字典进行数据映射
     */
  },
  exportApi: {
    type: Function,
    required: false,
    default: undefined,
    /**
     * 默认值为 undefined，表示如果未提供导出数据的接口函数，则无法进行数据导出操作
     */
  },
  tableIndex: {
    type: Boolean,
    default: false,
    /**
     * 默认值为 false，表示默认不显示表格的序号列
     */
  },
  select: {
    type: String,
    default: 'single',
    /**
     * 默认值为 'single'，表示表格选择框默认使用单选样式
     */
  },
  pk: {
    type: String,
    default: 'id',
    /**
     * 默认值为 'id'，表示表格数据的主键字段名为 'id'
     */
  },
  checkedRows: {
    type: Array as () => any[],
    default: () => [],
    /**
     * 默认值为一个空数组，表示初始时表格中没有选中的行
     */
  },
  fieldList: {
    type: Array<Field>,
    required: true,
    default: () => [],
    /**
     * 该 prop 是必需的，默认值为一个空数组，表示初始时没有定义表格的字段配置
     */
  },
  loading: {
    type: Boolean,
    default: undefined,
    /**
     * 默认值为 undefined，表示如果未提供加载状态标识，则不控制加载显示效果
     */
  },
  handleBtn: {
    type: Object,
    default: () => {},
    /**
     * 默认值为一个空对象，表示初始时操作栏没有任何配置
     */
  },
  rowBtnDisable: {
    type: Function,
    default: () => false,
    /**
     * 默认值为一个返回 false 的函数，表示默认情况下表格行操作按钮都是可点击的
     */
  },
  rowBtnHidden: {
    type: Function,
    default: () => true,
    /**
     * 默认值为一个返回 true 的函数，表示默认情况下表格行操作按钮都是隐藏的
     */
  },
  headerBtnDisable: {
    type: Function,
    default: () => false,
    /**
     * 默认值为一个返回 false 的函数，表示默认情况下表格顶部操作按钮都是可点击的
     */
  },
  headerBtnHidden: {
    type: Function,
    default: () => true,
    /**
     * 默认值为一个返回 true 的函数，表示默认情况下表格顶部操作按钮都是隐藏的
     */
  },
  pager: {
    type: Boolean,
    default: false,
    /**
     * 默认值为 false，表示默认关闭表格的分页功能
     */
  },
  reloadCurrentPage: {
    type: Number,
    default: undefined,
    /**
     * 默认值为 undefined， 重置到第一页
     */
  },
  query: {
    type: Object,
    default: () => {},
    /**
     * 默认值为一个空对象，表示初始时没有提供表格的查询条件
     */
  },
  refresh: {
    type: Number,
    default: 0,
    /**
     * 默认值为 undefined，表示初始时不触发表格数据的刷新操作
     */
  },
  mountedRefresh: {
    type: Boolean,
    default: true,
    /**
     * 默认值为 true，表示表格初始化后默认自动刷新数据
     */
  },
})

const treeTableRef = ref<any>()
let $route = useRoute()
const columnStore = useColumnStore()
const { theme } = storeToRefs(useSettingStore())
const { t } = useI18n()
const $emit = defineEmits(['handle-row-db-click', 'selection-change', 'update:loading'])
// 分页信息
const pagerInfo = ref({
  layout: 'total,sizes,prev,pager,next,jumper',
  pageSizes: [10, 20, 50, 100, 200, 300, 500, 600],
})
// 分页查询条件
const pagerQuery = ref({
  // 总条数
  total: 0,
  // 当前页
  current: 1,
  // 每页条数
  size: 10,
})
/**
 * 表格 loading
 */
const tableLoading = computed({
  get: () => {
    return props.loading
  },
  set: (value) => {
    $emit('update:loading', value)
  },
})

const tableInfo = ref({
  // 是否展开
  expandAll: false,
  // 显示的列
  showFieldList: [] as Field[],
})

const tableData = ref({
  // 表格的值
  rows: [] as any[],
})
let singleSelectValue = ref<undefined | any | number>()
let currentRows = ref<any>()

/**
 * 表格渲染需要的字典
 */
const dict = useDict(...props.dict)

/**
 * 初始化事件
 */
onMounted(() => {
  initColumn()
  refreshData()
})

/**
 * 更新事件
 */
onUpdated(() => {
  return treeTableRef.value.doLayout()
})

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

/**
 * 行内按钮
 */
const handleBtnOperate = props.handleBtn || false

/**
 * 初始化事件
 */
const initColumn = async () => {
  tableInfo.value.showFieldList = []
  // 路由名称就是菜单组件名称
  const routeName: string = $route.name as string
  const columns: string[] = (await columnStore.getColumnByMenu(routeName)) as string[]
  ;(props.fieldList as Field[])?.forEach((item: Field, index: number) => {
    let tempItem: Field = {
      ...item,
      key: index,
      fixed: item.fixed || false,
      align: item.align || 'center',
      width: typeof item.width === 'string' ? item.width.replace('px', '').replace('%', '') : item.width || '',
      hidden: item.hidden || false,
      disabled: item.disabled || false,
      visible: item.hidden || true,
    }

    if (columns.indexOf(camelCaseToUnderscore(tempItem.prop)) !== -1) {
      tempItem.hidden = true
      tempItem.disabled = true
      tempItem.visible = false
    }
    tableInfo.value.showFieldList.push(tempItem)
  })
}

/**
 * 表格显示列计算属性
 */
const tableField = computed(() => {
  return tableInfo.value.showFieldList.filter((item) => !item.hidden)
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
 * 初始化表格顶部按钮设置
 */
const initTbHeaderBtn = computed(() => props.tbHeaderBtn as Btn[])

/**
 * 表格展开
 */
const expandAll = computed({
  get: () => {
    return tableInfo.value.expandAll
  },
  set: (value) => {
    tableInfo.value.expandAll = value
  },
})

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
  return props.pager ? { ...obj, ...pagerQuery.value } : obj
}

/**
 * 获取数据
 */
const getList = async () => {
  try {
    tableLoading.value = true
    singleSelectValue.value = undefined
    if (!props.listApi) return
    const response: any = await props.listApi(handleParams())
    tableData.value.rows = []
    if (props.pager) {
      tableData.value.rows = response?.data.records
      pagerQuery.value.total = Number(response?.data.total)
    } else {
      tableData.value.rows = response?.data
    }
    // 设置当前选中项
    if (props.checkedRows) {
      setCheckedList()
    }
  } catch (err: any) {
    useMessage().warning(err.message)
  } finally {
    onEnd()
    tableLoading.value = false
    handleDoExpandTableRowView()
  }
}

const setCheckedList = () => {
  props.checkedRows.forEach((selected: any) => {
    const row = tableData.value.rows.find(
      (item) => item[props.pk] === selected[props.pk] || item[props.pk] === selected,
    )
    nextTick(() => {
      if (!row) return
      treeTableRef.value.toggleRowSelection(row, true)
    })
  })
}

/**
 * 页码改变事件
 *
 * @param size
 */
const handleSizeChange = (size: number) => {
  pagerQuery.value.size = size
  getList()
}

/**
 * 当前页改变事件
 *
 * @param current
 */
const handleCurrentChange = (current: number) => {
  pagerQuery.value.current = current
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
  const index = (tableData.value.rows as []).findIndex((item: any) => item[props.pk] === row[props.pk])
  if (index !== -1) {
    singleSelectValue.value = index
  }
  currentRows.value = [row]
  $emit('selection-change', cloneDeep(row))
  if (row) {
    treeTableRef.value!.toggleRowSelection(row, undefined)
  } else {
    treeTableRef.value!.clearSelection()
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
 * @param btn
 * @param row
 * @param index
 */
const handleTableRowClick = (btn: Btn, row: any, index: number) => {
  switch (btn.event) {
    case 'delete':
      confirmBox(() => {
        btn.eventHandle ? btn.eventHandle(row, index) : useMessage().warning('未配置事件')
      })
      break
    default:
      btn.eventHandle ? btn.eventHandle(row, index) : useMessage().warning('未配置事件')
      break
  }
}

/**
 * 表格头部按钮点击事件
 *
 * @param btn
 * @param rows
 * @param index
 */
const handleHeadBtnClick = (btn: Btn, rows: any, index: number) => {
  switch (btn.event) {
    case 'delete':
      if (!rows) {
        useMessage().warning(t('common.delTip'))
        return
      }
      confirmBox(() => {
        btn.eventHandle ? btn.eventHandle(rows, index) : useMessage().warning(t('common.noHandle'))
      })
      break
    case 'edit':
      handleCheckBeforeClickBtn().then(() => {
        btn.eventHandle ? btn.eventHandle(rows, index) : useMessage().warning(t('common.noHandle'))
      })
      break
    case 'export':
      handleExport(handleParams())
      break
    default:
      btn.eventHandle ? btn.eventHandle(rows, index) : useMessage().warning(t('common.noHandle'))
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
 * 按钮点击前校验方法
 */
const handleCheckBeforeClickBtn = () => {
  return new Promise((resolve, reject) => {
    if (!currentRows.value || currentRows.value.length === 0) {
      useMessage().warning(t('common.selectLineItem'))
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
    useMessage().warning('导出接口未配置')
    return
  }
  console.debug(query)
}

// 表格设置按钮
const tableSettingButtonRef = ref()
const tableSettingsPopoverRef = ref()
// 表格列权限设置按钮
const tableColumnPermissionButtonRef = ref()
const tableColumnPermissionPopoverRef = ref()

const tableSettingsOnClickOutside = () => {
  unref(tableSettingsPopoverRef).popperRef?.delayHide?.()
}

const tableColumnPermissionOnClickOutside = () => {
  unref(tableColumnPermissionPopoverRef).popperRef?.delayHide?.()
}

const expandedRows = ref<any[]>([])
const expandedKeys = ref<any[]>([])

const handleDoExpandTableRowView = () => {
  if (expandedRows.value.length > 0) {
    let idList = expandedRows.value.map((ele: any) => ele.id)
    handleGetOpenRowId(tableData.value.rows, idList)
  }
}
const handleExpandChange = (_expandedRows: any, expanded: boolean) => {
  if (expanded) {
    expandedRows.value.push(_expandedRows)
  } else {
    const number = expandedRows.value.indexOf(_expandedRows)
    expandedRows.value.splice(number, 1)
  }
}

const handleGetOpenRowId = (val: any, idList: any) => {
  val.forEach((ele: any) => {
    if (idList.includes(ele.id)) {
      expandedKeys.value.push(ele.id)
    }
    if (ele.children && ele.children?.length > 0) {
      handleGetOpenRowId(ele.children, idList)
    }
  })
}

/**
 * 设置菜单列的权限
 *
 * @param value
 * @param field
 */
const handleSetColumnVisible = async (value: boolean, field: Field) => {
  const routeName: string = $route.name as string
  const data: ColumnCacheData = {
    menu: routeName,
    columns: [field.prop],
    // true 后端删除列控制，前端进行展示
    // false 后端增加列控制，前端进行隐藏
    visible: value,
  }
  await columnStore.setColumnByMenu(data)
  await getList()
}

/**
 * 监听方法
 */
watch(
  () => props.reloadCurrentPage,
  () => {
    pagerQuery.value.current = 1
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

let tableKey = ref<number>(Math.random())
const onEnd = () => {
  tableKey.value = Math.random()
}

const handleSliderChange = (row: any) => {
  row.width = row.sliderWidth
}
</script>
<template>
  <el-popover
    placement="left-start"
    :popper-style="{
      width: 'auto',
    }"
    ref="tableSettingsPopoverRef"
    :virtual-ref="tableSettingButtonRef"
    trigger="click"
    virtual-triggering
  >
    <VueDraggable v-model="tableInfo.showFieldList" target="tbody" @end="onEnd">
      <el-table ref="bTreeTableSettings" :data="tableInfo.showFieldList" style="width: 100%" max-height="350">
        <el-table-column fixed prop="prop" :label="t('settings.fields.prop')" width="150" />
        <el-table-column prop="label" :label="t('settings.fields.label')" width="120" />
        <el-table-column prop="hidden" :label="t('settings.fields.hidden')" width="120">
          <template #default="{ row }">
            <el-switch
              @change="getList"
              v-model="row.hidden"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column prop="width" :label="t('settings.fields.width')" width="250">
          <template #default="{ row }">
            <el-slider :min="150" :max="500" v-model="row.sliderWidth" @change="handleSliderChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="fixed" :label="t('settings.fields.fixed')" width="120">
          <template #default="{ row }">
            <el-switch
              v-model="row.fixed"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </template>
        </el-table-column>
      </el-table>
    </VueDraggable>
  </el-popover>
  <el-popover
    placement="left-start"
    :popper-style="{
      width: 'auto',
    }"
    ref="tableColumnPermissionPopoverRef"
    :virtual-ref="tableColumnPermissionButtonRef"
    trigger="click"
    :title="t('common.setTableColumn')"
    virtual-triggering
  >
    <div style="display: flex; justify-content: flex-start; align-items: flex-start; flex-direction: column">
      <el-checkbox
        v-for="(item, index) in tableInfo.showFieldList"
        @change="handleSetColumnVisible(item.visible as boolean, item)"
        :label="item.label"
        v-model="item.visible"
        :key="index"
      ></el-checkbox>
    </div>
  </el-popover>
  <el-card shadow="never" style="margin: 10px 0">
    <template #header>
      <div class="tools">
        <div v-if="initTbHeaderBtn" class="table-btn-group">
          <template v-for="(item, index) in initTbHeaderBtn" :key="index">
            <svg-button
              :key="index"
              :type="item.type"
              :label="item.label"
              :icon="item.icon"
              :disabled="item.disabled || headerBtnDisable(item.event, currentRows)"
              v-if="item.hidden || headerBtnHidden(item.event, currentRows)"
              v-has="item.permission"
              @svg-btn-click="handleHeadBtnClick(item, currentRows, singleSelectValue)"
            />
          </template>
          <svg-button
            v-has="['ROLE_ADMIN']"
            :icon="expandAll ? 'expend' : 'fold'"
            type="success"
            :label="expandAll ? t('common.expend') : t('common.fold')"
            @svg-btn-click="
              () => {
                expandAll = !expandAll
                onEnd()
              }
            "
          />
          <slot name="tbHeaderBtn" />
        </div>
        <div>
          <svg-button
            ref="tableSettingButtonRef"
            v-click-outside="tableSettingsOnClickOutside"
            icon="settings"
            :circle="true"
          />
          <svg-button
            v-has="['ROLE_ADMIN']"
            ref="tableColumnPermissionButtonRef"
            v-click-outside="tableColumnPermissionOnClickOutside"
            icon="column_permission"
            :circle="true"
          />
        </div>
      </div>
    </template>

    <div class="table">
      <el-table
        ref="treeTableRef"
        :fit="true"
        :data="tableData.rows"
        :max-height="tableHeight"
        :height="tableHeight"
        v-loading="loading"
        border
        :default-expand-all="expandAll"
        stripe
        :row-key="
          (val: any) => {
            return val.id
          }
        "
        :key="tableKey"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :style="tableStyle"
        :highlight-current-row="true"
        :expand-row-keys="expandedKeys"
        @select-all="handleSelectionChange"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDbClick"
        @row-click="handleRowClick"
        @expand-change="handleExpandChange"
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
          :width="item.width || ''"
          :min-width="item.minWidth || ''"
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
                :width="_item.width || ''"
                :min-width="_item.minWidth || ''"
                :show-overflow-tooltip="_item.showOverflowTooltip"
                :fixed="_item.fixed"
              >
                <template #default="_">
                  <!-- slot自定义列 -->
                  <template v-if="_item.type === 'slot'">
                    <slot :name="`col-${_item.prop}`" :row="scope.row" :index="scope.$index" />
                  </template>
                  <table-item
                    @reload-data-list="getList"
                    :scope="{
                      row: _.row[item.prop],
                      $index: _.$index,
                      column: _.column,
                    }"
                    :dict="dict"
                    :table-field="_item"
                    :key="_index"
                  />
                </template>
              </el-table-column>
            </template>

            <!-- slot自定义列 -->
            <template v-else-if="item.type === 'slot'">
              <slot :name="`col-${item.prop}`" :row="scope.row" :index="scope.$index" />
            </template>

            <table-item @reload-data-list="getList" :dict="dict" :scope="scope" :table-field="item" :key="index" />
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
                v-has="item.permission"
                v-if="item.hidden || rowBtnHidden(item.event, scope.row)"
                :link="initHandleBtn.link || item.link"
                :icon="item.icon"
                :type="item.type"
                :label="item.label"
                :disabled="item.disabled || rowBtnDisable(item.event, scope.row)"
                @svg-btn-click="handleTableRowClick(item, scope.row, scope.$index)"
              />
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template v-if="enablePager">
      <div class="table-pagination">
        <el-pagination
          v-model:current-page="pagerQuery.current"
          v-model:page-size="pagerQuery.size"
          :size="theme.size"
          :total="pagerQuery.total"
          :page-sizes="pagerInfo.pageSizes"
          :layout="pagerInfo.layout"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
  </el-card>
</template>

<style lang="scss" scoped>
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

.table {
  display: inherit;
}
.table-pagination {
  padding: 10px;
}
</style>
