import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/api/pkLogin/login'+'?username='+username+'&password='+password,
    method: 'post',

  })
}

export function getInfo(token) {
  return request({
    url: '/api/pkLogin/getInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
