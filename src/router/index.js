import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login')
// import Home from '../components/Home'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home')
// import Welcome from '../components/Welcome'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome')
// import Users from '../components/user/Users'
const Users = () => import(/* webpackChunkName:"user" */ '../components/user/Users')
// import Rights from '../components/rights/Rights'
const Rights = () => import(/* webpackChunkName:"rights" */ '../components/rights/Rights')
// import Roles from '../components/rights/Roles'
const Roles = () => import(/* webpackChunkName:"rights" */ '../components/rights/Roles')
// import Cate from '../components/goods/Cate'
const Cate = () => import(/* webpackChunkName:"goods" */ '../components/goods/Cate')
// import Params from '../components/goods/Params'
const Params = () => import(/* webpackChunkName:"goods" */ '../components/goods/Params')
// import List from '../components/goods/List'
const List = () => import(/* webpackChunkName:"goods" */ '../components/goods/List')
// import Add from '../components/goods/Add'
const Add = () => import(/* webpackChunkName:"goods" */ '../components/goods/Add')
// import Order from '../components/orders/Order'
const Order = () => import(/* webpackChunkName:"order" */ '../components/orders/Order')
// import Report from '../components/report/Report'
const Report = () => import(/* webpackChunkName:"report" */ '../components/report/Report')

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
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({ routes })

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const hasToken = window.sessionStorage.getItem('token')
  if (!hasToken) return next('/login')
  next()
})

export default router
