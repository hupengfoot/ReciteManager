import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import {successShow,errorShow} from '@/utils/notice.js'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (!store.getters.roles) {
        next()
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          
          if(res.data.code==500){
            //errorShow('token失效，请重新登录')
            store.dispatch('LogOut').then(() => {
              
              next({ path: '/' })
            })
          }else{
            next()
          }
          
        }).catch((err) => {
          //errorShow('token失效，请重新登录')
          store.dispatch('LogOut').then(() => {
            
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      //errorShow('token失效，请重新登录')
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
