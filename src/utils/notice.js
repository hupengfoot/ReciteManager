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
	return message({
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