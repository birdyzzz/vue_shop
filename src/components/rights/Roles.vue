<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row class="add">
        <el-button type="primary" round @click="showAddDialog"
          >添加角色</el-button
        >
      </el-row>
      <el-table :data="rolesList" boder stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', 'center', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="6">
                <el-tag closable @close="removeRight(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row
                  :class="['center', i2 === 0 ? '' : 'bdtop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRight(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRight(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showAllotRightsDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="添加角色"
      :visible.sync="addRoledialogVisible"
      width="30%"
      @close="handleAddDialogClosed"
    >
      <el-form
        :model="roleForm"
        :rules="roleRules"
        ref="addRoleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改角色信息"
      :visible.sync="editRoleDialogVisible"
      width="30%"
      @close="handleEditDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="roleRules"
        ref="editRoleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole(editForm.roleId)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="分配权限"
      :visible.sync="allotRightsDialogVisible"
      width="30%"
      @close="rightsDialogClosed"
    >
      <el-tree
        :data="rights"
        :props="defaultProps"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      rolesList: [],
      roleForm: {},
      roleRules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { min: 2, max: 7, message: '长度应在2~7个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '角色描述信息不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度应在2~20个字符之间',
            trigger: 'blur'
          }
        ]
      },
      addRoledialogVisible: false,
      editRoleDialogVisible: false,
      editForm: {},
      allotRightsDialogVisible: false,
      rights: [],
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
    },
    removeRight(role, rightId) {
      this.$confirm('此操作将移除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          role.children = res.data
          this.$message.success('删除该权限成功！')
        })
        .catch(() => {
          this.$message.info('已取消！')
        })
    },
    showAddDialog() {
      this.addRoledialogVisible = true
    },
    async addRole() {
      this.addRoledialogVisible = false
      const { data: res } = await this.$http.post('/roles', this.roleForm)
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },
    handleAddDialogClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },
    handleEditDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) this.$message.error(res.meta.msg)
      this.editForm = res.data
      this.editRoleDialogVisible = true
    },
    editRole(id) {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(`roles/${id}`, this.editForm)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        }
        this.$message.success('修改角色信息成功！')
        this.getRolesList()
        this.editRoleDialogVisible = false
      })
    },
    deleteRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('删除角色成功！')
          this.getRolesList()
        })
        .catch((err) => err)
    },

    async showAllotRightsDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.erro(this.meta.msg)
      this.rights = res.data
      this.getCheckedKeysId(role, this.defKeys)
      this.allotRightsDialogVisible = true
    },
    getCheckedKeysId(node, array) {
      if (!node.children) {
        return array.push(node.id)
      }
      node.children.forEach((item) => {
        this.getCheckedKeysId(item, array)
      })
    },
    rightsDialogClosed() {
      this.defKeys = []
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keysStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: keysStr }
      )
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.allotRightsDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.add {
  display: flex;
  justify-content: flex-end;
  margin-right: 5px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.center {
  display: flex;
  align-items: center;
}
</style>
