<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col class="addCate">
          <el-button type="primary" round @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: rgb(115, 201, 145)"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="option" slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            class="cascader"
            v-model="selectedKeys"
            :options="parentCate"
            :props="cascaderProps"
            expandTrigger="hover"
            ref="cascaderRef"
            placeholder="请选择父级分类，若不选则添加为一级分类"
            @change="cascaderChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改分类名称"
      :visible.sync="editCateDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateRules"
        ref="editCateFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      queryInfo: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isOk' },
        { label: '层级', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'option' }
      ],
      addCateDialogVisible: false,
      parentCate: [],
      addCateRules: {
        cat_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      selectedKeys: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      editCateDialogVisible: false,
      editCateForm: {
        id: 0,
        cat_name: ''
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('/categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      //   console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCate()
      this.addCateDialogVisible = true
    },
    async getParentCate() {
      const { data: res } = await this.$http.get('/categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类失败！')
      console.log(res)
      this.parentCate = res.data
    },
    cascaderChanged() {
      this.$refs.cascaderRef.dropDownVisible = false
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    showEditCateDialog(id) {
      this.editCateForm.id = id
      this.editCateDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
      this.editCateForm.id = 0
      this.editCateForm.cat_name = ''
    },
    editCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `/categories/${this.editCateForm.id}`,
          { cat_name: this.editCateForm.cat_name }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('编辑分类名称失败！')
        }
        this.getCateList()
        this.$message.success('编辑分类名称成功！')
        this.editCateDialogVisible = false
      })
    },
    deleteCate(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${id}`)
          if (res.meta.status !== 200) return this.$message.error('删除分类失败')
          this.$message.success('删除分类成功！')
          this.getCateList()
        })
        .catch(() => {
          this.$message.info('已取消删除！')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin: 15px 0;
}
.addCate {
  display: flex;
  justify-content: flex-end;
}
.addCate .el-button {
  margin-right: 8px;
}

.cascader {
  width: 100%;
}
.el-cascader-menu {
  height: 300px;
}
.el-cascader-panel .el-radio {
  position: absolute;
  z-index: 10;
  padding: 0 10px;
  width: 132px;
  height: 34px;
  line-height: 34px;
}
.el-cascader-panel .el-radio__input {
  visibility: hidden;
}
.el-cascader-panel .el-input-node__postfix {
  top: 10px;
}
</style>
