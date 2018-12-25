<template>
  <div class="resultsCenter">
    <form class="searchForm">
      <el-date-picker v-model="search.startDate" placeholder="请选择开始时间"></el-date-picker>
      <el-date-picker v-model="search.endDate" placeholder="请选择结束时间"></el-date-picker>
      <el-input v-model="search.keyWord" placeholder="请输入学生姓名或关键字进行查询"></el-input>
      <el-button type="primary" icon="el-icon-search"> </el-button>
    </form>
    <teaching-tab></teaching-tab>
  </div>
</template>

<script>
import teachingTab from '@/components/teaching/teachingTab'



export default {
  name: 'resultsCenter',
  components: { teachingTab },
  data(){
    return{
      search:{
        startDate:'',
        endDate:'',
        keyWord:''
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="less" scoped>
.resultsCenter {
  .searchForm{
    height:50px;
    line-height:50px;
    margin-top:10px;
    .el-input{
      width:220px;
      margin-left:20px;

    }
  }
}
</style>
