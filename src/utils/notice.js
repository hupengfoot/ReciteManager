import {Notification,Message} from 'element-ui'

export function successShow(content){
	return Notification({
		title:'Success',
		message:content,
		type:'success',
		customClass:'z1000'
	})
}

export function errorShow(content){
	return Notification({
		title:'Error',
		center:true,
		message:content,
		type:'error',
		customClass:'z1000'
	})
}

export function warningShowShow(content){
	return Notification({
		title:'Warning',
		message:content,
		type:'warning',
		customClass:'z1000'
	})
}
export function deleteShow() {console.log(111)
	return this.$confirm('是否确定删除?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
}