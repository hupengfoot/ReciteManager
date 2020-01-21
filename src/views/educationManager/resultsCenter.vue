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
      <el-button type="primary" style="float:right;" @click="goldFormVisible = true">颁发金币</el-button>
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
      <div v-show="type==1">
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
          <el-table-column label="看英选义" prop="englishToChinese"></el-table-column>
          <el-table-column label="听音辨英" prop="listenToEnglish"></el-table-column>
          <el-table-column label="看义拼词" prop="chineseToChoice"></el-table-column>
          <el-table-column label="看义选英" prop="chineseToEnglish"></el-table-column>
          <el-table-column label="进度" width="400">
            <template slot-scope="scope">
              <p v-if="scope.row.wordNum==0" class="progress"><span :style="{width:0+'px'}"></span></p>
              <p v-else class="progress"><span :style="{width:(scope.row.wordNum/maxWordNum)*300+'px'}"></span></p>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="totalNum>0" :total="totalNum" :page.sync="search.page" :limit.sync="search.limit" @pagination="getClassGrade" />
      </div>
      <div v-show="type==2">
        <el-table border :data="groupList">
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="小组名" prop="groupItemName"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{scope.row.createTime}}
            </template>
          </el-table-column>
          <el-table-column label="已掌握的词汇量" prop="wordNum"></el-table-column>
          <el-table-column label="平均词汇量" prop="averageGrader"></el-table-column>
          <el-table-column label="已掌握词汇的进度" width="400">
            <template slot-scope="scope">
              <p class="progress groupProgress"><span :style="{width:(scope.row.wordNum/maxGroupWordNum)*300+'px'}"></span></p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog class="awardsDialog" title="颁发金币" :visible.sync="goldFormVisible">
      <!-- <el-form ref="goldForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="金币">
          <el-input v-model="goldNum" @keyup.native="testNumber($event)" placeholder="请输入添加数量" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="remark" placeholder="请输入备注"  type="textarea" />
        </el-form-item>
      </el-form> -->
      <el-form ref="goldForm" label-position="left" label-width="70px" style="width: 100%; margin-left:50px;">
        <div class="awardsDialog">
          <div class="formSearch">
            <el-button class="awardsSubmit" @click="awardsSubmit" type="primary">颁奖</el-button>
            <el-date-picker v-model="courseDate" @change="getWillRewardStuInfo" value-format="yyyy-MM-dd" placeholder="请选择日期"></el-date-picker>
            <el-select v-model="courseTime"  @change="getWillRewardStuInfo">
              <el-option value="00:00:00" label="AM"></el-option>
              <el-option value="12:00:00" label="PM"></el-option>
            </el-select>
          </div>
          <h6>当前课次</h6>
          <ul v-if="goldList.wordKingList&&goldList.wordKingList.length!=0">
            <li>
              <label>1、单词王</label>
              <span>
                第一名:
              {{goldList.wordKingList[0].name}}
              <el-input v-model="wordKingNum0"  />
              </span>
              <span v-if="goldList.wordKingList.length>1">
                第二名:
              {{goldList.wordKingList[1].name}}
              <el-input v-model="wordKingNum1" />
              </span>
              <span v-if="goldList.wordKingList.length>2">
                第三名:
              {{goldList.wordKingList[2].name}}
              <el-input v-model="wordKingNum2"  />
              </span>
            </li>
            <li>
              <label>2、团队冠军</label>
              <span v-if="goldList.championGroup">{{goldList.championGroup.groupName}}:</span>
              <span v-for="(list,index) in goldList.championGroup.stuGoldList" :key="index"><i v-if="index !=0">,</i>{{list.name}}</span>
              <el-input v-model="stuGoldNum"  />
            </li>

            <li>
              <label>3、最快进步奖</label>
              <!-- <span v-for="(list,index) in goldList.advanceList" :key="index">
                第{{index==0?'一':(index==1?'二':'三')}}名:
              {{list.name}}
              <el-input :v-model="advanceNum+index" :value="index==0?'100':(index==1?'70':'50')" />
              </span> -->
              <span v-if="goldList.advanceList.length>1">
                第一名:
              {{goldList.advanceList[0].name}}
              <el-input v-model="advanceNum0"  />
              </span>
              <span v-if="goldList.advanceList.length>1">
                第二名:
              {{goldList.advanceList[1].name}}
              <el-input v-model="advanceNum1" />
              </span>
              <span v-if="goldList.advanceList.length>2">
                第三名:
              {{goldList.advanceList[2].name}}
              <el-input v-model="advanceNum2"  />
              </span>
            </li>
            <li>
              <label>4、测试排名</label>
              <!-- <span v-for="(list,index) in goldList.testRankList" :key="index">
                第{{index==0?'一':(index==1?'二':'三')}}名:
              {{list.name}}
              <el-input :v-model="testRank+index" :value="index==0?'100':(index==1?'70':'50')" />
              </span> -->
              <span v-if="goldList.testRankList.length>0">
                第一名:
              {{goldList.testRankList[0].name}}
              <el-input v-model="testRankNum0"  />
              </span>
              <span v-if="goldList.testRankList.length>1">
                第二名:
              {{goldList.testRankList[1].name}}
              <el-input v-model="testRankNum1"  />
              </span>
              <span v-if="goldList.testRankList.length>2">
                第三名:
              {{goldList.testRankList[2].name}}
              <el-input v-model="testRankNum2"  />
              </span>
            </li>
          </ul>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="goldFormVisible = false">{{ '关闭' }}</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getClassGrade,getClassGroupGrade,getWillRewardStuInfo,batchRewardGold } from '@/api/table'
import Pagination from '@/components/Pagination'
import teachingTab from '@/components/teaching/teachingTab'
import {successShow,errorShow} from '@/utils/notice.js'

export default {
  name: 'resultsCenter',
  components: { teachingTab,Pagination },
  data(){
    return{
      goldFormVisible:false,
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
      courseDate:'',
      courseTime:'00:00:00',
      goldList:[],
      wordKingNum:[],
      wordKingNum0:100,
      wordKingNum1:70,
      wordKingNum2:50,
      stuGoldNum:50,
      advanceNum0:50,
      advanceNum1:30,
      advanceNum2:20,

      testRankNum0:50,
      testRankNum1:30,
      testRankNum2:20
    }
  },
  mounted(){
    this.getClassGrade();
    this.getClassGroupGrade();
    this.classId = this.$route.query.classId*1;

  },
  created(){
    var len = 3;
      for (var i = 0; i < len; i++) {
        var item = {value1: 100};
        this.wordKingNum.push(item);
      }
  },
  methods:{
    // 颁奖

    awardsSubmit(){
      let params = [];
      this.$confirm('是否确定颁奖?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res=>{
          if(this.goldList.wordKingList.length>0){
            params=params.concat({"name":this.goldList.wordKingList[0].name ,"remark":"", "rewardGold": this.wordKingNum0,"stuId": this.goldList.wordKingList[0].stuId})
          }
          if(this.goldList.wordKingList.length>1){
            params=params.concat({"name":this.goldList.wordKingList[1].name ,"remark":"", "rewardGold": this.wordKingNum1,"stuId": this.goldList.wordKingList[1].stuId})      }
          if(this.goldList.wordKingList.length>2){
            params=params.concat({"name":this.goldList.wordKingList[2].name ,"remark":"", "rewardGold": this.wordKingNum2,"stuId": this.goldList.wordKingList[2].stuId})      }
          if(this.goldList.championGroup.groupName){
            for(let i=0;i<this.goldList.championGroup.stuGoldList.length;i++){
              params=params.concat({"name":this.goldList.championGroup.stuGoldList[i].name ,"remark":"", "rewardGold": this.stuGoldNum,"stuId": this.goldList.championGroup.stuGoldList[i].stuId})
            }
          }
          //最快进不
          if(this.goldList.advanceList.length>0){
            params=params.concat({"name":this.goldList.advanceList[0].name ,"remark":"", "rewardGold": this.advanceNum0,"stuId": this.goldList.advanceList[0].stuId})
          }
          if(this.goldList.advanceList.length>1){
            params=params.concat({"name":this.goldList.advanceList[1].name ,"remark":"", "rewardGold": this.advanceNum1,"stuId": this.goldList.advanceList[1].stuId})
          }
          if(this.goldList.advanceList.length>2){
            params=params.concat({"name":this.goldList.advanceList[2].name ,"remark":"", "rewardGold": this.advanceNum2,"stuId": this.goldList.advanceList[2].stuId})
          }
          //测试排名
          if(this.goldList.testRankList.length>0){
            params=params.concat({"name":this.goldList.testRankList[0].name ,"remark":"", "rewardGold": this.testRankNum0,"stuId": this.goldList.testRankList[0].stuId})
          }
          if(this.goldList.testRankList.length>1){
            params=params.concat({"name":this.goldList.testRankList[1].name ,"remark":"", "rewardGold": this.testRankNum1,"stuId": this.goldList.testRankList[1].stuId})
          }
          if(this.goldList.testRankList.length>2){
            params=params.concat({"name":this.goldList.testRankList[2].name ,"remark":"", "rewardGold": this.testRankNum2,"stuId": this.goldList.testRankList[2].stuId})
          }
          batchRewardGold(params).then(res=>{
            successShow('颁奖成功')
          })
      }).catch(()=>{

      })
    },
    // 查询颁奖
    getWillRewardStuInfo(){
      // let courseTime = new Date(parseInt(this.courseDate)).toLocaleString().replace(/:\d{1,2}$/,' ');
      // let courseTime = date('Y-m-d',this.courseDate)+' '+this.courseTime;
      // console.log(this.courseDate,this.courseTime,1)
      getWillRewardStuInfo({classId:this.classId,courseTime:this.courseDate+' '+this.courseTime}).then(res=>{
        // console.log(res.data,123)

        this.goldList = res.data.data;
        goldFormVisible = false
        // console.log(this.goldList,111)
      })
    },
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
  .awardsDialog{
    /deep/ .el-dialog__body{
      padding:20px 20px;
      .awardsSubmit{
        float:right;
        margin-top:50px;
        margin-right:50px;
      }
      .formSearch{

      }
      h6{
        margin:20px 0;
      }
      li{
        list-style:none;
        margin:10px 0;
        .el-input{
          width:60px;
          height:25px;
          input{
            height:25px;
          }
        }
      }
    }


  }

}
</style>
