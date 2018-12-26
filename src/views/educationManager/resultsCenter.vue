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
          <el-button @click="type=1" :class="{'dafult':type==1}">班级成绩</el-button>
          <el-button @click="type=2" :class="{'dafult':type==2}">小组成绩</el-button>
        </div>
        <span class="fr sort" >
          <template v-if="sort==1">升序</template>
          <template v-else>降序</template>
          </span>
      </div>
      <div v-if="type==1">
        <el-table border>
          <el-table-column label="ID"></el-table-column>
          <el-table-column label="姓名"></el-table-column>
          <el-table-column label="性别"></el-table-column>
          <el-table-column label="词汇量"></el-table-column>
          <el-table-column label="进度"></el-table-column>
        </el-table>
      </div>
      <div v-if="type==2">2</div>
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
      type:1,
      sort:1,
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
  padding:20px;
  .searchForm{
    height:50px;
    line-height:50px;
    .el-input{
      width:220px;
      margin-left:20px;

    }
  }
  .resultsMain{
    .mainTop{
      margin-top:20px;
      text-align:center;
      .mainTopButton{
        display:inline-block;
      
        .el-button{
          height:35px;
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
      .sort{
        margin-right:20px;
        font-size:14px;
        line-height:35px; 
        cursor:pointer;
      }
    }
    .el-table{
      th{
        text-align:center;
      }
      
    }
  }
  
}
</style>
