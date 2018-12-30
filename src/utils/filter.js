import Vue from 'vue'
//过滤器

//性别
Vue.filter('gender', function(value) {
  if (value===1) {
    return "男";
  }else{
    return "女";
  }
});
Vue.filter('timestamp',function(value){
  var date = new Date(value);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = date.getDate() + ' ';
  return Y+M+D;
})