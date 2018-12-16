import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/teachermanager/index',
    name: '主页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/teachermanager',
    component: Layout,
    meta: { title: '教师管理', icon: 'example' },
    children: [
      {
        path: 'index',
        name: '教师管理',
        component: () => import('@/views/table/index'),
        meta: { title: '教师管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/classmanager',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '班级管理',
        component: () => import('@/views/table/classlist'),
        meta: { title: '班级管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/teachingmanager',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '教学管理',
        component: () => import('@/views/form/index'),
        meta: { title: '教学管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/diagnosis',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '诊断报告',
        component: () => import('@/views/form/index'),
        meta: { title: '诊断报告', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
