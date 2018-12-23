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