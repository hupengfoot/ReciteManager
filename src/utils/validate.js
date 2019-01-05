/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  if(typeof str === 'string'){
    return true;
  }else{
    return false;
  }
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

//日期增加
export function addDate(date,days){
  var d=new Date(date);
  d.setDate(d.getDate()+days);
  var month=d.getMonth()+1;
  var day = d.getDate();
  if(month<10){
    month = "0"+month;
  }
  if(day<10){
    day = "0"+day;
  }
  var val = d.getFullYear()+"-"+month+"-"+day;
  return val;
}
