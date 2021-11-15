<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0"
        class="form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="warning" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginStatusMsg: '',
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度应在3~10个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '登录密码长度应在6~15个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      console.log(this.$refs)
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        this.loginStatusMsg = res.meta.msg
        if (res.meta.status !== 200) return this.loginError()
        this.loginSuccess()
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    loginSuccess() {
      this.$msg({
        message: '登录成功！',
        center: true,
        showClose: true,
        type: 'success'
      })
    },
    loginError() {
      this.$msg({
        message: this.loginStatusMsg,
        center: true,
        showClose: true,
        type: 'error'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: rgb(29, 44, 37);
  width: 100%;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  box-shadow: 0 0 5px;
  .avatar {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: rgb(223, 223, 223);
      vertical-align: middle;
    }
  }
  .form {
    position: absolute;
    bottom: 20px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    .btns {
      display: flex;
      justify-content: flex-end;
      .el-button {
        margin-left: 30px;
      }
    }
  }
}
</style>
>
