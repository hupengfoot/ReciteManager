import request from '@/utils/request'
function getUrlBase(){
	return '/api'
}
/*班级 -S */
export function getAllClassByTeacherId(params) {
  return request({//查询班级列表
    url: getUrlBase()+'/pkClass/getAllClassByTeacherId',
    method: 'get',
    params:params
  })
}
// export function getAllClass(params) {
//   return request({//查询所有课程或未完成课程
//     url: getUrlBase()+'/pkClass/getAllClass',
//     method: 'get',
//     params:params
//   })
// }
export function getSubjectList(params) {
  return request({//查询所有课程或未完成课程
    url: getUrlBase()+'/pkCourse/getNoUnitList',
    method: 'get',
    params:params
  })
}

export function createClass(params) {
  return request({//添加班级
    url: getUrlBase()+'/pkClass/createNewClass',
    method: 'post',
    data:params
  })
}
export function getUserList(params){
  return request({//查询下拉菜单老师列表
    url: getUrlBase() + '/pkUser/teacherList',
    method: 'get',
    params:params
  })
}
export function getSingleClass(id) {
  return request({//查询单个班级信息
    url: getUrlBase()+'/pkClass/getSingleClass/'+id,
    method: 'get'
  })
}
export function updateClass(params) {
  return request({//修改单个班级信息
    url: getUrlBase()+'/pkClass/updateClass',
    method: 'put',
    data:params
  })
}
/*班级 -E */

/*学生 - S */
export function getStuAndGroupInClass(path,params) {
  return request({//通过班级查询学生
    url: getUrlBase()+'/pkStudent/getStuAndGroupInClass/'+path,
    method: 'get',
    params:params
  })
}
export function createStu(params) {
  return request({//添加学生
    url: getUrlBase()+'/pkStudent/createStu',
    method: 'post',
    data:params
  })
}
export function deleteStu(params,id) {
  return request({//删除学生
    url: getUrlBase()+'/pkStudent/deleteStu/'+id,
    method: 'delete',
    params:params
  })
}
export function getStuInfoByStuId(id) {
  return request({//查询单个学生
    url: getUrlBase()+'/pkStudent/getStuInfoByStuId/'+id,
    method: 'get'
  })
}
export function updateStu(params) {
  return request({//修改学生信息
    url: getUrlBase()+'/pkStudent/updateStu',
    method: 'put',
    data:params
  })
}
export function resetPassword(id) {
  return request({//重置学生密码
    url: getUrlBase()+'/pkStudent/resetPassword/'+id,
    method: 'put'
  })
}
export function exportExcel(id) {
  return request({//导出学生信息
    url: getUrlBase()+'/pkStudent/exportExcel/'+id,
    method: 'get'
  })
}
export function sudentImport(id) {
  return request({//导出学生信息
    url: getUrlBase()+'/pkStudent/import/'+id,
    method: 'post'
  })
}

/**学生 -E */


export function updateUserForAdmin(params){
  return request({
    url:getUrlBase() + '/pkUser/updateForAdmin',
    method: 'PUT',
    data:params
  })
}
export function deleteUserFromAdmin(params){
  return request({
    url:getUrlBase() + '/pkUser/delete',
    method: 'DELETE',
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
