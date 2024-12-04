<script>
import { page } from '@/api/auth/role'
import useWidth from '@/hooks/dialogWidth'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { Refresh, Search } from '@element-plus/icons-vue'

export default {
  name: 'RoleCheckDialog',
  components: { SearchContainerBox },
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
      roleList: [],
      checkRole: [],
      singleSelectValue: undefined,
      queryParams: {
        roleCode: '',
        roleName: '',
      },
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
    Refresh() {
      return Refresh
    },
    Search() {
      return Search
    },
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
    this.checkRole = []
    this.roleList = []
  },
  methods: {
    useWidth,
    /**
     * 查询
     */
    async handleQuery() {
      await this.getList()
      await this.handleCheck()
    },
    /**
     * 重置查询
     */
    resetQuery() {
      this.$refs.roleQueryFormRef.resetFields()
      this.handleQuery()
    },
    async getList() {
      try {
        const response = await page({ ...this.pagerQuery.query, ...this.queryParams })
        this.roleList = response.data.records
        this.pagerQuery.query.total = Number(response.data.total)
      } catch (err) {
        /* empty */
      }
    },
    handleCheckRole() {
      this.visible = false
      this.$emit('updateRoleData', this.checkRole)
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
      this.checkRole = row
    },
    handleCheck() {
      if (this.single) {
        this.singleSelectValue = this.roleList.findIndex((item) => item['id'] === this.roleCheck)
        return
      }
      const row = this.roleList.filter((item) => this.roleChecks.indexOf(item['id']) > -1)
      if (row) {
        row.forEach((item) => {
          this.$refs.roleCheckTableRef?.toggleRowSelection(item, true)
        })
      }
    },
    handleRowClick(row) {
      if (this.single) {
        this.checkRole = row
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
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" :width="useWidth()">
    <search-container-box>
      <el-form ref="roleQueryFormRef" :model="queryParams" :inline="true">
        <!-- 角色编码 -->
        <el-form-item :label="$t('role.fields.roleCode')" prop="roleCode">
          <el-input
            @keyup.enter="handleQuery"
            style="width: 200px"
            :placeholder="$t('role.fields.roleCode')"
            v-model="queryParams.roleCode"
          />
        </el-form-item>

        <!-- 角色名称 -->
        <el-form-item :label="$t('role.fields.roleName')" prop="roleName">
          <el-input
            @keyup.enter="handleQuery"
            style="width: 200px"
            :placeholder="$t('role.fields.roleName')"
            v-model="queryParams.roleName"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">
            {{ $t('common.search') }}
          </el-button>
          <el-button type="success" :icon="Refresh" @click="resetQuery">
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </search-container-box>
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
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="roleName" label="角色名" />
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
        <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleCheckRole">{{ $t('common.confirm') }}</el-button>
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
