import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/rights/Rights'
import Roles from '../components/rights/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import List from '../components/goods/List'
import Add from '../components/goods/Add'
import Order from '../components/orders/Order'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const hasToken = window.sessionStorage.getItem('token')
  if (!hasToken) return next('/login')
  next()
})

export default router
