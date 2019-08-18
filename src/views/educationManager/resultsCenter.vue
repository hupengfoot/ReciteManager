<template>
  <div class="resultsCenter">
    <form class="searchForm">
      <el-date-picker v-model="startTime" value-format="timestamp" placeholder="请选择开始时间"></el-date-picker>
      <el-select v-model="startHalfDay">
        <el-option value="AM" label="AM"></el-option>
        <el-option value="PM" label="PM"></el-option>
      </el-select>
      <el-date-picker v-model="endTime"  value-format="timestamp" placeholder="请选择结束时间"></el-date-picker>
      <el-select v-model="endHalfDay">
        <el-option value="AM" label="AM"></el-option>
        <el-option value="PM" label="PM"></el-option>
      </el-select>
      <el-input v-model="search.pattern" placeholder="请输入学生姓名或关键字进行查询"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="selectFrom">查找</el-button>
    </form>
    <teaching-tab :classId="classId" ></teaching-tab>
    <div class="resultsMain">
      <div class="mainTop">
        <div class="mainTopButton">
          <el-button @click="type=1" :class="{'dafult':type==1}">班级成绩</el-button>
          <el-button @click="type=2" :class="{'dafult':type==2}">小组成绩</el-button>
        </div>
        <span class="fr sort" @click="orderButton('DESC')" v-if="search.order=='ASC'&&type==1">升序</span>
        <span class="fr sort" @click="orderButton('ASC')" v-if="search.order=='DESC'&&type==1">降序</span>
        <span class="fr sort" v-if="type==2" @click="splitScreen">分屏展示</span>
          
      </div>
      <div v-if="type==1">
        <el-table border :data="eduList"  @row-click="stuInfo">
          <el-table-column label="ID" prop="stuId"></el-table-column>
          <el-table-column label="姓名" prop="realName"></el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              {{scope.row.gender | gender}}
            </template>
          </el-table-column>
          <el-table-column label="已掌握的词汇量" prop="wordNum"></el-table-column>
          <el-table-column label="已学到的词汇量" prop="learnWordNum"></el-table-column>
          <el-table-column label="进度" width="400">
            <template slot-scope="scope">
              <p v-if="scope.row.wordNum==0" class="progress"><span :style="{width:0+'px'}"></span></p>
              <p v-else class="progress"><span :style="{width:(scope.row.wordNum/maxWordNum)*300+'px'}"></span></p>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="totalNum>0" :total="totalNum" :page.sync="search.page" :limit.sync="search.limit" @pagination="getClassGrade" />
      </div>
      <div v-if="type==2">
        <el-table border :data="groupList">
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="小组名" prop="groupItemName"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{scope.row.createTime}}
            </template>
          </el-table-column>
          <el-table-column label="已掌握的词汇量" prop="wordNum"></el-table-column>
          <el-table-column label="已学到的词汇量" prop="learnWordNum"></el-table-column>
          <el-table-column label="进度" width="400">
            <template slot-scope="scope">
              <p class="progress groupProgress"><span :style="{width:(scope.row.wordNum/maxGroupWordNum)*300+'px'}"></span></p>
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
      maxWordNum:0,
      maxGroupWordNum:0,
      startTime:'',
      endTime:'',
      startHalfDay:'AM',
      endHalfDay:'PM',
      search:{
        page:1,
        limit:10,
        startTime:'',
        endTime:'',
        pattern:'',
        order:'DESC'
      },
      groupList:[],
      classId:0,
    }
  },
  mounted(){
    this.getClassGrade();
    this.getClassGroupGrade();
    this.classId = this.$route.query.classId*1;
  },
  methods:{
    selectFrom(){
      this.getClassGrade();
      this.getClassGroupGrade();
    },
    stuInfo(row){//链接
      this.$router.push({
        name:'stuInfo',
        query:{
          stuId:row.stuId,
          classId:this.$route.query.classId,
          startDate:this.$route.query.startDate
        }
      })
    },
    getClassGrade(){//查询班级成绩
    
      if(this.startTime){
        let half;
        this.startHalfDay=='AM'?half=0:half=43200;
        this.search.startTime = this.startTime.toString().substr(0,10)*1+half*1;
      }else{
        this.search.startTime = ''
      }
      if(this.endTime){
        let half;
        this.endHalfDay=='PM'?half=0:half=43200;
        this.search.endTime = this.endTime.toString().substr(0,10)*1+86400-half;
      }else{
        this.search.endTime = ''
      }
      getClassGrade(this.$route.query.classId,this.search).then(res=>{
        this.maxWordNum = 0;
        this.eduList = res.data.stuList.records;
        for(let i=0;i<res.data.stuList.records.length;i++){
          this.maxWordNum = this.maxWordNum>res.data.stuList.records[i].wordNum?this.maxWordNum:res.data.stuList.records[i].wordNum;
        }
        this.totalNum = res.data.stuList.total;
      })
    },
    orderButton(order){//排序
      this.search.order = order;
      this.getClassGrade();
    },
    getClassGroupGrade(){//查询小组成绩
      let startTime;
      let endTime;
      if(this.startTime){
        let groupHhalf;
        this.startHalfDay=='AM'?groupHhalf=0:groupHhalf=43200;
        startTime = this.startTime.toString().substr(0,10)*1+groupHhalf*1;
      }else{
        startTime = ''
      }
      if(this.endTime){
        let groupHhalf;
        this.endHalfDay=='PM'?groupHhalf=0:groupHhalf=43200;
        endTime = this.endTime.toString().substr(0,10)*1+86400-groupHhalf;
      }else{
        endTime = ''
      }
      getClassGroupGrade(this.$route.query.classId,{
        startTime:startTime,
        endTime:endTime,
        order:'DESC'
        }).then(res=>{
        for(let i=0;i<res.data.groupItemList.length;i++){
          res.data.groupItemList[i].wordNum = 0;
          for(let j=0;j<res.data.groupItemList[i].stuInfoList.length;j++){
              res.data.groupItemList[i].wordNum = res.data.groupItemList[i].stuInfoList[j].wordNum+res.data.groupItemList[i].wordNum
          }
          for(let n=0;n<res.data.groupItemList.length;n++){
             this.maxGroupWordNum = this.maxGroupWordNum>res.data.groupItemList[n].wordNum?this.maxGroupWordNum:res.data.groupItemList[n].wordNum;
          }
        }
        this.groupList = res.data.groupItemList;
      })
    },
    splitScreen(){
      for(let i=0;i<this.groupList.length/2;i++){
        if(this.groupList.length>2*i+1){
          window.open('/splitScreen?classId='+this.$route.query.classId+'&first='+this.groupList[2*i].id+'&groupName='+this.groupList[2*i].groupItemName+'&firstRank='+((1+i)*2-1)+'&groupSecondName='+this.groupList[2*i+1].groupItemName+'&second='+this.groupList[2*i+1].id+'&secondRank='+(2*(i+1)),'newwindows'+i,"height=800, width=800, top=100, left=100,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
        }else{
          window.open('/splitScreen?classId='+this.$route.query.classId+'&first='+this.groupList[2*i].id+'&groupName='+this.groupList[2*i].groupItemName+'&firstRank='+((1+i)*2-1),'newwindows'+i,"height=800, width=800, top=100, left=100,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
        }
      }
      
      
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
    .el-select{
      width:80px;
    }
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
      height:10px;
      width:300px;
      background:rgba(233, 233, 233, 1);
      border-radius:20px;
      position:relative;
      span{
        position:absolute;
        left:0;
        top:0;
        display:inline-block;
        background:#409eff;
        height:10px;
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
