<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：仅可选择第三级分类"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row class="row">
        <el-col>
          <span>选择分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="escaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  type="success"
                  @close="tagClosed(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="primary"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="deleteParams(scope.row.cat_id, scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="item in scope.row.attr_vals"
                  :key="item.cat_id"
                  closable
                  type="success"
                  >{{ item }}</el-tag
                >

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="primary"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="deleteParams(scope.row.cat_id, scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="Text.title"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item :label="Text.label" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'编辑' + Text.title + '名称'"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="110px"
      >
        <el-form-item :label="Text.label">
          <el-input v-model="paramsInfo.attr_name" disabled></el-input>
        </el-form-item>

        <el-form-item :label="'新的' + Text.label" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      cateList: [],
      selectedKeys: [],
      escaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editForm: {
        attr_name: ''
      },
      paramsInfo: {}
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$msg.error('获取商品分类列表失败！')
      }
      this.cateList = res.data
    },
    async getParamsData() {
      if (!this.cateId) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return this.$msg.info('请先选择三级分类！')
      }

      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$msg.error('获取参数列表失败')
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      }
      this.onlyTableData = res.data
    },
    handleChange() {
      this.getParamsData()
    },
    handleTabClick() {
      this.getParamsData()
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addAttr() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$msg.error('添加' + this.Text.label + '失败！')
        }
        this.$msg.success('添加' + this.Text.label + '成功！')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    showEditDialog(info) {
      this.editDialogVisible = true
      this.paramsInfo = info
      console.log(info)
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.paramsInfo = {}
    },
    editAttr() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.paramsInfo.cat_id}/attributes/${this.paramsInfo.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) {
          return this.$msg.error('更新失败！')
        }
        this.$msg.success('更新成功！')
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    deleteParams(id1, id2) {
      this.$confirm(
        '此操作将永久删除该' + this.Text.title + ', 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${id1}/attributes/${id2}`
          )
          if (res.meta.status !== 200) {
            return this.$msg.error('删除失败！')
          }
          this.$msg.success('删除成功！')
          this.getParamsData()
        })
        .catch(() => {
          this.$msg.info('已取消删除！')
        })
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      const optAdd = '添加'

      this.changeAttr(row, optAdd)
    },
    async changeAttr(row, opt) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) {
        return this.$msg.error(opt + 'tag标签失败！')
      }
      this.$msg.success(opt + 'tag标签成功！')
    },
    tagClosed(index, row) {
      row.attr_vals.splice(index, 1)
      const optDel = '删除'
      this.changeAttr(row, optDel)
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    Text() {
      if (this.activeName === 'many') {
        return { title: '动态参数', label: '参数名称' }
      }
      return { title: '静态属性', label: '属性名称' }
    }
  }
}
</script>

<style lang="less" scope>
.row {
  margin: 15px 0;
}
.el-cascader {
  width: 300px;
}
.el-tag {
  margin: 10px;
}
.button-new-tag {
  margin: 10px !important;
}
.input-new-tag {
  width: 120px !important;
}
</style>
