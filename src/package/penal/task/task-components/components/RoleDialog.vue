<script>
import { page } from '@/api/auth/role'

export default {
  name: 'RoleDialog',
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
      roleList: [],
      checkRoleCode: '',
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
      this.roleList = response.data.records
      this.pagerQuery.query.total = Number(response.data.total)
    },
    handleCheckRole() {
      this.visible = false
      this.$emit('updateRoleData', this.checkRoleCode)
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
      this.checkRoleCode = row.map((item) => item.roleCode)
    },
    /**
     * 当前页改变事件
     *
     * @param row
     */
    handleRowClick(row) {
      if (this.single) {
        this.checkRoleCode = row.roleCode
        const index = this.roleList.findIndex((item) => item['id'] === row['id'])
        if (index !== -1) {
          this.singleSelectValue = index
        }
        return
      }
      if (row) {
        this.$refs.roleCheckTableRef.toggleRowSelection(row, undefined)
      } else {
        this.$refs.roleCheckTableRef.clearSelection()
      }
    },
  },
  beforeUnmount() {},
}
</script>

<template>
  <el-dialog v-model="visible" title="角色" width="800">
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
      <el-table-column prop="roleName" label="角色名" />
      <el-table-column prop="roleCode" label="角色编码" />
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
        <el-button type="primary" @click="handleCheckRole">Confirm</el-button>
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
