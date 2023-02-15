import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 配置自己的路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    // name: 'layout', // 如果父路由有默认子路由 那它的name没有意义
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '', // 默认子路由，只能有一个
        name: 'home',
        component: () => import('@/views/shouye/index.vue')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/wenda/index.vue')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/shipin/index.vue')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/wode/index.vue')
      } 
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/index.vue')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true // 开启props传参
  } 
]

const router = new VueRouter({
  routes
})

export default router
