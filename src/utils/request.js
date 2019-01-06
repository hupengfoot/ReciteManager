import axios from 'axios'
// axios.defaults.headers.post['Content-Type'] = 'application/json';
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import {successShow,errorShow} from '@/utils/notice.js'
// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    //config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    //let myToken = window.localStorage.ReciteManager_Token
    //console.log(getToken());
    config.headers['token'] = getToken()
    if(getToken() === null && getToken() === undefined){
      $router.push('/')
    }
    // config.headers['Accept'] = '*/*'
    // config.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
    return config
  },
  error => {
    // Do something with request error
    //console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    if(response.data.code === 500){
      errorShow(response.data.msg);
      return Promise.reject(response)
    }

    return response
    
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
