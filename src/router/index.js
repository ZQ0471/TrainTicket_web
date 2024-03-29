import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/train',
    name: 'Example',
    meta: { title: '信息查询', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'train',
        name: 'Train',
        component: () => import('@/views/train/index'),
        meta: { title: '车次信息', icon: 'table' }
      },
      {
        path: 'station',
        name: 'Station',
        component: () => import('@/views/station/index'),
        meta: { title: '直达车次', icon: 'tree' }
      },
      {
        path: 'transit',
        name: 'Transit',
        component: () => import('@/views/transit/index'),
        meta: { title: '中转车次', icon: 'tree' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
