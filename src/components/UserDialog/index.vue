<script>
import { page } from '@/api/bpm/user'

export default {
  name: 'UserDialog',
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
      checkUser: '',
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
    async getList() {
      const response = await page(this.pagerQuery?.query)
      this.userList = response.data?.records
      this.pagerQuery.query.total = Number(response.data?.total)
    },
    handleCheckUser() {
      this.visible = false
      this.$emit('updateUserData', this.checkUser || '')
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
      this.checkUser = row.map((item) => item.userCode)
    },
    handleCheck() {
      if (this.single) {
        this.singleSelectValue = this.userList.findIndex((item) => item['id'] === this.userCheck)
        return
      }
      const row = this.userList.filter((item) => this.userChecks.indexOf(item['id']) > -1)
      if (row) {
        row.forEach((item) => {
          this.$refs.userCheckTableRef?.toggleRowSelection(item, undefined)
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
        this.checkUser = row.id
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
    beforeUnmount() {
      this.checkUser = ''
      this.userList = []
    },
  },
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="800">
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
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="primary" @click="handleCheckUser">Confirm</el-button>
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
