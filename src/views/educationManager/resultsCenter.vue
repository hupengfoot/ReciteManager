<template>
  <div class="resultsCenter">
    <form class="searchForm">
      <el-date-picker v-model="search.startDate" placeholder="请选择开始时间"></el-date-picker>
      <el-date-picker v-model="search.endDate" placeholder="请选择结束时间"></el-date-picker>
      <el-input v-model="search.pattern" placeholder="请输入学生姓名或关键字进行查询"></el-input>
      <el-button type="primary" icon="el-icon-search"> </el-button>
    </form>
    <teaching-tab></teaching-tab>
    <div class="resultsMain">
      <div class="mainTop">
        <div class="mainTopButton">
          <el-button @click="type=1" :class="{'dafult':type==1}">班级成绩</el-button>
          <el-button @click="type=2" :class="{'dafult':type==2}">小组成绩</el-button>
        </div>
        <span class="fr sort" @click="orderButton('DESC')" v-if="search.order=='ASC'&&type==1">升序</span>
        <span class="fr sort" @click="orderButton('ASC')" v-if="search.order=='DESC'&&type==1">降序</span>
          </span>
      </div>
      <div v-if="type==1">
        <el-table border :data="eduList">
          <el-table-column label="ID" prop="stuId"></el-table-column>
          <el-table-column label="姓名" prop="realName"></el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              {{scope.row.gender | gender}}
            </template>
          </el-table-column>
          <el-table-column label="词汇量" prop="wordNum"></el-table-column>
          <el-table-column label="进度" width="400">
            <template slot-scope="scope">
              <p class="progress"><span :style="{width:scope.row.wordNum*3+'px'}"></span></p>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="totalNum>0" :total="totalNum" :page.sync="search.page" :limit.sync="search.limit" @pagination="getClassGrade" />
      </div>
      <div v-if="type==2">
        <el-table border :data="groupList">
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="姓名" prop="groupItemName"></el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              {{scope.row.gender | gender}}
            </template>
          </el-table-column>
          <el-table-column label="词汇量" prop="wordNum"></el-table-column>
          <el-table-column label="进度" width="400">
            <template slot-scope="scope">
              <p class="progress groupProgress"><span :style="{width:scope.row.wordNum*3+'px'}"></span></p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {getClassGrade,getClassGroupGrade } from '@/api/table'
import Pagination from '@/components/Pagination'
import teachingTab from '@/components/teaching/teachingTab'
export default {
  name: 'resultsCenter',
  components: { teachingTab,Pagination },
  data(){
    return{
      type:1,
      eduList:[],
      totalNum:0,
      search:{
        page:1,
        limit:15,
        startDate:'',
        endDate:'',
        pattern:'',
        order:'ASC'
      },
      groupList:[],
    }
  },
  mounted(){
    this.getClassGrade();
    this.getClassGroupGrade();
  },
  methods:{
    getClassGrade(){//查询班级成绩
      getClassGrade(this.$route.query.classId,this.search).then(res=>{
        this.eduList = res.data.stuList.records;
        this.totalNum = res.data.stuList.pages;
      })
    },
    orderButton(order){//排序
    console.log(order)
      this.search.order = order;
      this.getClassGrade();
    },
    getClassGroupGrade(){//查询小组成绩
      getClassGroupGrade(this.$route.query.classId,this.search).then(res=>{
        for(let i=0;i<res.data.groupItemList.length;i++){
          res.data.groupItemList[i].wordNum = 0;
          for(let j=0;j<res.data.groupItemList[i].stuInfoList.length;j++){
              res.data.groupItemList[i].wordNum = res.data.groupItemList[i].stuInfoList[j].wordNum+res.data.groupItemList[i].wordNum
          }
        }
        this.groupList = res.data.groupItemList;
      })
    },
  }
}
</script>

<style lang="less" scoped>
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
      margin:20px 0;
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
    
  }
  .el-table{
    .progress{
      height:5px;
      width:300px;
      background:rgba(233, 233, 233, 1);
      border-radius:20px;
      position:relative;
      span{
        position:absolute;
        left:0;
        top:0;
        display:inline-block;
        background:rgb(255,210,21,1);
        height:5px;
      }
    }
    
      &:nth-child(1){
        .groupProgress{
          span{
            background:#409eff;
          }
        }
      }
      &:nth-child(2){
        .groupProgress{
          span{
            background:#67c23a;
          }
        }
      }
      // &:nth-child(3){
      //   span{
      //     background:#e6a23c;
      //   }
      // }
      // &:nth-child(4){
      //   span{
      //     background:#f56c6c;
      //   }
      // }
    

  }
  
}
</style>
