<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="100">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="queryInfo.query"
              :clearable="true"
              @clear="getUserList"
              @change="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="3" :offset="12">
          <div class="grid-content bg-purple">
            <el-button type="primary" round @click="addUserDialogVisible = true"
              >添加用户</el-button
            >
          </div>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180"
        ></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeUserState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
              :open-delay="800"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="showRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="30%"
      center
      @close="resetAddDialog"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUserFormRef"
        label-width="90px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户信息"
      :visible.sync="editDioalogVisible"
      width="30%"
      @close="resetEditDialog"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editUserRef"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDioalogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser(editForm.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="分配角色"
      :visible.sync="roleDialogVisible"
      width="30%"
      @close="roleDialogClosed"
    >
      <div>
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <p>
          新角色：
          <el-select placeholder="请选择..." v-model="selectedRoleId">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole(userInfo.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
      addUserDialogVisible: false,
      editDioalogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 7,
            message: '用户名长度应在2~7个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度应在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern:
              /^((13|14|15|16|17|18)[0-9]{1}\d{8})|((166|199|198)[0-9]{1}\d{7})$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      },
      editForm: {},
      editRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern:
              /^((13|14|15|16|17|18)[0-9]{1}\d{8})|((166|199|198)[0-9]{1}\d{7})$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      },
      roleDialogVisible: false,
      userInfo: {},
      roleList: [],
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$msg.error('获取用户列表失败！')
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async changeUserState(userInfo) {
      const { data: res } = await this.$http.put(
        `/users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$msg.error('更新用户状态失败!')
      }
      this.$msg.success('更新用户状态成功!')
    },
    resetAddDialog() {
      this.$refs.addUserFormRef.resetFields()
    },
    addUserInfo() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return this.$msg.error('请确认用户信息合法后再提交！')
        const { data: res } = await this.$http.post('/users', this.addUserForm)
        if (res.meta.status !== 201) return this.$msg.error('添加用户信息失败!')
        this.$msg.success('添加用户信息成功!')
        this.addUserDialogVisible = false
        this.getUserList()
      })
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$msg.error('获取用户信息失败')
      this.editForm = res.data
      this.editDioalogVisible = true
    },
    editUser(id) {
      this.$refs.editUserRef.validate(async (valid) => {
        if (!valid) return this.$msg.error('更新用户信息失败！')
        const { data: res } = await this.$http.put(`users/${id}`, this.editForm)
        if (res.meta.status !== 200) {
          return this.$msg.error(res.meta.msg)
        }
        this.$msg.success('更新用户信息成功!')
        this.getUserList()
        this.editDioalogVisible = false
      })
    },
    resetEditDialog() {
      this.$refs.editUserRef.resetFields()
    },
    deleteUser(id) {
      this.$confirm('此操作将永久删除此用户，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancleButtonText: '取消',
        type: 'warnimg'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
          this.getUserList()
          this.$msg.success('删除用户信息成功！')
        })
        .catch(() => {
          this.$msg.info('已取消删除操作！')
        })
    },
    async showRoleDialog(role) {
      this.userInfo = role
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$msg.error('获取角色列表失败！')
      this.roleList = res.data
      this.roleDialogVisible = true
    },
    async setRole(id) {
      const { data: res } = await this.$http.put(`users/${id}/role`, {
        rid: this.selectedRoleId
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.getUserList()
      this.$msg.success('分配角色成功！')
      this.roleDialogVisible = false
    },
    roleDialogClosed() {
      this.userInfo = {}
      this.selectedRoleId = ''
    }
  }
}
</script>

<style lang="less" scoped></style>
