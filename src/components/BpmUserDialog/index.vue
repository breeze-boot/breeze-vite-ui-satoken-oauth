<script>
import { page } from '@/api/bpm/user'

export default {
  name: 'BpmUserDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    userCheck: {
      type: String,
      default: '',
    },
    userChecks: {
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
      userList: [],
      checkUser: [],
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
  async mounted() {
    await this.getList()
    await this.handleCheck()
  },
  async updated() {
    if (this.visible) {
      await this.getList()
      await this.handleCheck()
    }
  },
  beforeUnmount() {
    this.checkUser = []
    this.userList = []
  },
  methods: {
    async getList() {
      const response = await page(this.pagerQuery?.query)
      this.userList = response.data?.records
      this.pagerQuery.query.total = Number(response.data?.total)
    },
    handleCheckUser() {
      this.visible = false
      this.$emit('updateUserData', this.checkUser)
    },
    handleCloseCheck() {
      this.visible = false
      this.$emit('handleCloseCheck')
    },
    /**
     * 页码改变事件
     *
     * @param size
     */
    async handleSizeChange(size) {
      this.pagerQuery.query.size = size
      await this.getList()
      await this.handleCheck()
    },
    /**
     * 当前页改变事件
     *
     * @param current
     */
    async handleCurrentChange(current) {
      this.pagerQuery.query.current = current
      await this.getList()
      await this.handleCheck()
    },
    handleSelectionChange(row) {
      if (this.single) {
        return
      }
      this.checkUser = row
    },
    handleCheck() {
      if (this.single) {
        this.singleSelectValue = this.userList.findIndex((item) => item['id'] === this.userCheck)
        return
      }
      const row = this.userList.filter((item) => this.userChecks.indexOf(item['id']) > -1)
      if (row) {
        row.forEach((item) => {
          this.$refs.userCheckTableRef?.toggleRowSelection(item, true)
        })
      }
    },
    handleRowClick(row) {
      if (this.single) {
        this.checkUser = row
        const index = this.userList.findIndex((item) => item['id'] === row['id'])
        if (index !== -1) {
          this.singleSelectValue = index
        }
        return
      }
      if (row) {
        this.$refs.userCheckTableRef?.toggleRowSelection(row, undefined)
      } else {
        this.$refs.userCheckTableRef?.clearSelection()
      }
    },
  },
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" :before-close="handleCloseCheck">
    <el-table
      ref="userCheckTableRef"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      highlight-current-row
      :data="userList"
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
      <el-table-column prop="displayName" label="用户姓名" />
      <el-table-column prop="id" label="用户名" />
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
        <el-button @click="handleCloseCheck()">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleCheckUser()">{{ $t('common.confirm') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.table-pagination {
  padding: 10px;
  margin-top: 10px;
}
</style>
