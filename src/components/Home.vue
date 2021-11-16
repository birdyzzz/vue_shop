<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/apple.png" class="logo" />
        <span>随心购-后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="collapse" @click="collapse">
          <i
            :class="
              isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'
            "
            >{{ isCollapse ? '展开' : '收起' }}</i
          >
        </div>
        <el-menu
          background-color="#323743"
          text-color="#fff"
          active-text-color="rgb(67,156,215)"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id.toString()"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="menuObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :index="'/' + subItem.path"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-s-operation"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      menuObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('path')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.erro('获取菜单列表失败！')
      this.menuList = res.data
    },
    collapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(path) {
      window.sessionStorage.setItem('path', path)
      this.activePath = path
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 16px;
  background-color: #323743;
  > div {
    display: flex;
    align-items: center;
    .logo {
      width: 40px;
      margin-left: 10px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #323743;
  .collapse {
    color: #666;
    margin-right: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .el-menu {
    border: none;
  }
}
.home_container {
  width: 100%;
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
</style>
