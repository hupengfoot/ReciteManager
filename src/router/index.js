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
    path: '/splitScreen',
    name: 'splitScreen',
    component: () => import('@/views/educationManager/splitScreen'),
    meta: { title: '分屏展示学生信息', icon: 'table' },
    hidden:true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/classmanager/index',
    name: '主页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/classmanager',
    name: '班级管理',
    meta: { title: '班级管理', icon: 'table' },
    redirect: '/classmanager/index',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '班级管理',
        component: () => import('@/views/table/classlist'),
        meta: { title: '班级管理', icon: 'table' }
      },
      {
        path: '/student',
        name: '学生管理',
        component: () => import('@/views/table/studentList'),
        meta: { title: '学生管理', icon: 'table' },
        hidden:true
      }
    ]
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
    path: '/teachingmanager',
    name: "教学管理",
    meta: { title: '教学管理', icon: 'example' },
    redirect: '/teachingmanager/index',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'teachingmanager',
        component: () => import('@/views/table/teachingmanager'),
        meta: { title: '教学管理', icon: 'table' }
      },
      {
        path: 'classmatelist',
        name: 'classmatelist',
        component: () => import('@/views/educationManager/classmatelist'),
        meta: {title: '班级管理', icon: 'table'},
        hidden:true,
      },
      {
        path: 'groupmanager',
        name: 'groupmanager',
        component: () => import('@/views/educationManager/groupmanager'),
        meta: {title: '分组管理', icon: 'table'},
        hidden:true,
      },
      {
        path: 'groupmembermanager',
        name: 'groupmembermanager',
        component: () => import('@/views/educationManager/groupmembermanager'),
        meta: {title: '分组成员管理', icon: 'table'},
        hidden:true,
      },
      {
        path: 'testmanager',
        name: 'testmanager',
        component: () => import('@/views/educationManager/testmanager'),
        meta: {title: '测试管理', icon: 'table'},
        hidden:true,
      },
      {
        path: 'testdetail',
        name: 'testdetail',
        component: () => import('@/views/educationManager/testdetail'),
        meta: {title: '试卷详情', icon: 'table'},
        hidden:true,
      },
      {
        path:'wordlist',
        name:'wordlist',
        component: () => import('@/views/educationManager/wordlist'),
        meta: {title: '词库', icon:'table'},
        hidden:true
      },
      {
        path: 'educationManager',
        name: 'educationManager',
        component: () => import('@/views/educationManager/resultsCenter'),
        meta: { title: '成绩列表', icon: 'table' },
        hidden:true,
      },
      {
        path: 'stuInfo',
        name: 'stuInfo',
        component: () => import('@/views/educationManager/stuInfo'),
        meta: { title: '学生学习信息', icon: 'table' },
        hidden:true,
      },
      {
        path: 'wrongTopicRecord',
        name: 'wrongTopicRecord',
        component: () => import('@/views/educationManager/wrongTopicRecord'),
        meta: { title: '错题本', icon: 'table' },
        hidden:true,
      },
      
    ]
  },
  {
    path: '/diagnosis',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '诊断报告',
        component: () => import('@/views/dashboard/diagnosis'),
        meta: { title: '诊断报告', icon: 'form' }
      }
    ]
  },
  {
    path: '/monitoring',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '监控中心',
        component: () => import('@/views/monitoring/index'),
        meta: { title: '监控中心', icon: 'form' }
      }
    ]
  },

  


  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
