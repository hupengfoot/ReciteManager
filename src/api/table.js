import request from '@/utils/request'
function getUrlBase(){
	return '/api'
}
/*班级 -S */
export function getAllClass(params) {
  return request({//查询班级列表
    url: getUrlBase()+'/pkClass/getAllClass',
    method: 'get',
    params:params
  })
}
export function getAllClassByTeacherId(params) {
  return request({//根据老师查询班级列表
    url: getUrlBase()+'/pkClass/getAllClassByTeacherId',
    method: 'get',
    params:params
  })
}
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
export function getUserManagerList(params){
  return request({
    url: getUrlBase() + '/pkUser/userList',
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
export function templet(id) {
  return request({//导出模板
    url: getUrlBase()+'/import-template/stu_import_template.xlsx',
    method: 'get'
  })
}
export function sudentImport(id,params) {
  return request({//导入学生信息
    url: getUrlBase()+'/pkStudent/import/'+id,
    method: 'post',
    data:params
  })
}

/**学生 -E */

/**成绩列表 -S */

export function getClassGrade(id,params) {
  return request({//查询班级成绩
    url: getUrlBase()+'/pkStuUnitExam/getClassGrade/'+id,
    method: 'get',
    params:params
  })
}
export function getClassGroupGrade(id,params){
  return request({//查询分组成绩
    url:getUrlBase()+'/pkStuUnitExam/getClassGroupGrade/'+id,
    method:'get',
    params:params
  })
}

export function getClassUnitNum(id,params){
  return request({//总单元数
    url:getUrlBase()+'/pkCourse/getClassUnitNum/'+id,
    method:'get',
    params:params
  })
}
export function getStuUnitPassNum(id,params){
  return request({//通过的单元数
    url:getUrlBase()+'/pkStuUnitLearning/getStuUnitPassNum/'+id,
    method:'get',
    params:params
  })
}
export function getStuWordNum(id,params){
  return request({//查询生词、夹生词等
    url:getUrlBase()+'/pkStuWordLearning/getStuWordNum/'+id,
    method:'get',
    params:params
  })
}
export function getStuUnitCompleteInfo(id,params){
  return request({//查询学生学习详情
    url:getUrlBase()+'/pkStuUnitLearning/getStuUnitCompleteInfo/'+id,
    method:'get',
    params:params
  })
}
export function getStuExamCorrectRate(id,params){
  return request({//查询题型得分率分析
    url:getUrlBase()+'/pkStuExamAnswer/getStuExamCorrectRate/'+id,
    method:'get',
    params:params
  })
}

export function getStuWordNumPerDay(id,params){
  return request({//查询早晚生词熟词夹生词
    url:getUrlBase()+'/pkStuWordLearning/getStuWordNumPerDay/'+id,
    method:'get',
    params:params
  })
}

export function getStuInfoInGroup(params){
  return request({//查询小组内学生信息
    url:getUrlBase()+'/pkGroupItem/getStuInfoInGroup',
    method:'get',
    params:params
  })
}

/**成绩列表 -E */

export function createUser(params){
  return request({
    url:getUrlBase() + '/pkUser/create',
    method: 'post',
    data:params
  })
}
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
export function getGroupItemList(id, params){
  return request({
    url:getUrlBase() + '/pkGroupItem/getGroupItemList/' + id,
    method: 'GET',
    params: params
  })
}
export function createGroupItemBatch(id, params){
  return request({
    url:getUrlBase() + '/pkGroupItem/createGroupItemBatch/' + id,
    method: 'PUT',
    params: params
  })
}
export function rewardGold(params){
  return request({
    url: getUrlBase() + '/pkStudent/rewardGold',
    method: 'PUT',
    params: params
  })
}
