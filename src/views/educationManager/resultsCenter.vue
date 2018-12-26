<template>
  <div class="resultsCenter">
    <form class="searchForm">
      <el-date-picker v-model="search.startDate" placeholder="请选择开始时间"></el-date-picker>
      <el-date-picker v-model="search.endDate" placeholder="请选择结束时间"></el-date-picker>
      <el-input v-model="search.keyWord" placeholder="请输入学生姓名或关键字进行查询"></el-input>
      <el-button type="primary" icon="el-icon-search"> </el-button>
    </form>
    <teaching-tab></teaching-tab>
    <div class="resultsMain">
      <div class="mainTop">
        <div class="mainTopButton">
          <el-button class="dafult">班级成绩</el-button>
          <el-button>小组成绩</el-button>
        </div>
        <span class="fr">升序</span>
      </div>
    </div>
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
  .resultsMain{
    .mainTop{
      margin-top:20px;
      text-align:center;
      .el-button{
        height:35px;
        line-height:35px;
        padding:0;
        width:325px;
        border-radius:0;
        &:first-child{
          border-top-left-radius:20px;
          border-bottom-left-radius:20px;
        }
        &:nth-child(2){
          border-top-right-radius:20px;
          border-bottom-right-radius:20px;
          position:relative;
          left:-15px;
          border-left:none;
        }
        &.dafult{
          background:#409EFF;
          color:#fff;
        }
      }
    }
  }
  
}
</style>
