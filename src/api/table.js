import request from '@/utils/request'
function getUrlBase(){
	return '/api'
}
export function getList(params) {
  return request({//查询班级列表
    url: getUrlBase()+'lass/getAllClassByTeacherId',
    method: 'get',
    params:params
  })
}
export function createClass(params) {
  return request({//添加班级
    url: getUrlBase()+'/pkClass/createNewClass',
    method: 'get',
    params:params
  })
}
// export function create(params) {
//   return request({//查询班级列表
//     url: '/api/pkClass/getAllClassByTeacherId',
//     method: 'get',
//     params:params
//   })
// }