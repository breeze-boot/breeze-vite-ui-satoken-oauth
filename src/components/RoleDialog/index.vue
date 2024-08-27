<script>
import { page } from '@/api/bpm/group'
import useWidth from '@/hooks/dialogWidth'
import { useI18n } from 'vue-i18n'

export default {
  name: 'RoleDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    roleCheck: {
      type: String,
      default: '',
    },
    roleChecks: {
      type: Array,
      default: () => [],
    },
    single: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      t: useI18n(),
      roleList: [],
      checkRole: '',
      singleSelectValue: undefined,
      pagerQuery: {
        query: {
          size: 10,
          current: 1,
          total: 0,
        },
        pageSizes: [10, 20, 30, 40],
        layout: 'total, sizes, prev, pager, next, jumper',
      },
    }
  },
  computed: {
    visible: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
  mounted() {
    this.getList()
  },
  updated() {
    this.handleCheck()
  },
  methods: {
    useWidth,
    async getList() {
      const response = await page(this.pagerQuery.query)
      this.roleList = response.data.records
      this.pagerQuery.query.total = Number(response.data.total)
    },
    handleCheckRole() {
      this.visible = false
      this.$emit('updateRoleData', this.checkRole || '')
    },
    /**
     * 页码改变事件
     *
     * @param size
     */
    handleSizeChange(size) {
      this.pagerQuery.query.size = size
    },
    /**
     * 当前页改变事件
     *
     * @param current
     */
    handleCurrentChange(current) {
      this.pagerQuery.query.current = current
    },
    /**
     * 当前页改变事件
     *
     * @param row
     */
    handleSelectionChange(row) {
      if (this.single) {
        return
      }
      this.checkRole = row.map((item) => item.id)
    },
    handleCheck() {
      if (this.single) {
        this.singleSelectValue = this.userList.findIndex((item) => item['id'] === this.roleCheck)
        return
      }
      const row = this.roleList.filter((item) => this.roleChecks.indexOf(item['id']) > -1)
      if (row) {
        row.forEach((item) => {
          this.$refs.roleCheckTableRef?.toggleRowSelection(item, undefined)
        })
      }
    },
    /**
     * 当前页改变事件
     *
     * @param row
     */
    handleRowClick(row) {
      if (this.single) {
        this.checkRole = row.roleCode
        const index = this.roleList.findIndex((item) => item['id'] === row['id'])
        if (index !== -1) {
          this.singleSelectValue = index
        }
        return
      }
      if (row) {
        this.$refs.roleCheckTableRef?.toggleRowSelection(row, undefined)
      } else {
        this.$refs.roleCheckTableRef?.clearSelection()
      }
    },
  },
  beforeUnmount() {
    this.checkRole = []
    this.roleList = []
  },
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" :width="useWidth()">
    <el-table
      ref="roleCheckTableRef"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      highlight-current-row
      :data="roleList"
      style="width: 100%"
    >
      <el-table-column v-if="!single" type="selection" width="55" />
      <el-table-column v-else key="singleSelect" fixed="left" type="index" align="center" width="60">
        <template #default="scope">
          <el-radio @selection-change="handleSelectionChange" v-model="singleSelectValue" :label="scope.$index">
            {{}}
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column label="序号" fixed align="center" type="index" width=" 66" />
      <el-table-column prop="id" label="角色编码" />
      <el-table-column prop="name" label="角色名" />
    </el-table>
    <div class="table-pagination">
      <el-pagination
        v-model:current-page="pagerQuery.query.current"
        :page-size="pagerQuery.query.size"
        :total="pagerQuery.query.total"
        :page-sizes="pagerQuery.pageSizes"
        :layout="pagerQuery.layout"
        size="small"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleCheckRole">{{ t('common.confirm') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.table-pagination {
  margin-top: 10px;
  padding: 10px;
}
</style>
