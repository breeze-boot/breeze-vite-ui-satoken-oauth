<script>
import { page } from '@/api/auth/user'

export default {
  name: 'UserDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    single: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userList: [],
      checkUserCode: '',
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
  methods: {
    async getList() {
      const response = await page(this.pagerQuery.query)
      this.userList = response.data.records
      this.pagerQuery.query.total = Number(response.data.total)
    },
    handleCheckUser() {
      this.visible = false
      this.$emit('updateUserData', this.checkUserCode)
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
      this.checkUserCode = row.map((item) => item.userCode)
    },
    /**
     * 当前页改变事件
     *
     * @param row
     */
    handleRowClick(row) {
      if (this.single) {
        this.checkUserCode = row.userCode
        const index = this.userList.findIndex((item) => item['id'] === row['id'])
        if (index !== -1) {
          this.singleSelectValue = index
        }
        return
      }
      if (row) {
        this.$refs.userCheckTableRef.toggleRowSelection(row, undefined)
      } else {
        this.$refs.userCheckTableRef.clearSelection()
      }
    },
  },
  beforeUnmount() {},
}
</script>

<template>
  <el-dialog v-model="visible" title="用户" width="800">
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
      <el-table-column prop="amountName" label="用户姓名" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="userCode" label="用户编码" />
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
