<template>
  <div class="diagnosisInfo">
    <div class="diagnosisTab">
      <ul>
        <li @click="type='classcompare'"  :class="{'default':type=='classcompare'}">词汇量比较</li>
        <li @click="type='classquesrate'"  :class="{'default':type=='classquesrate'}">班级得分率比较</li>
      </ul>
    </div>
    <div>
      <el-dropdown class="avatar-container" trigger="click" :hide-on-click="false">
      <div class="avatar-wrapper">
        <img src="@/assets/shaixuan.jpeg" class="user-avatar" height="20" width="20">
        <span class="name">筛选</span>
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <div class="classList" v-for="(item, index) in classList" :key="index">
          <el-dropdown-item divided>
            <span><el-checkbox/></span> <span>{{item.className}}</span>
          </el-dropdown-item>
        </div>
        <div>
          <el-button size="mini" type="danger" @click="">{{ '确定' }}</el-button>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
    </div>
    <div class="diagnosisMain">
      <div class="classcompare" v-show="type=='classcompare'">
        <h3>班级词汇比较</h3>
        <div class="classcompareMain">
          <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
            <line-chart :chart-data="lineChartData"/>
          </el-row>
        </div>
      </div>
      <div class="classquesrate" v-show="type=='classquesrate'">
        <h3>班级得分率分析</h3>
        <div class="classquesrateMain">
          <div id="ClassExamCorrectRate" :style="{width: '600px', height: '300px'}"></div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import {getAllClassByTeacherId, getAllClass, getClassGradePerDay } from '@/api/table'
import LineChart from '@/components/echarts/LineChart'
import moment from 'moment'

const lineChartData = {
  xAxisData: ['2018-12-30', '2018-12-31', '2019-01-01', '2019-01-02', '2019-01-03', '2019-01-04', '2019-01-05'],
  yAxisData:[
    {
      yName: '三年一班',
      yDataList: [100, 120, 161, 134, 105, 160, 165]
    },
    {
      yName: '三年二班',
      yDataList: [120, 82, 91, 154, 162, 140, 145]
    }
  ]
}

export default {
  name: 'diagnosisInfo',
  components: { LineChart },
  data(){
    return{
        type:'classcompare',
        lineChartData: lineChartData,
        classList: [],
        selectClassList: [{classId:1, className: "三年一班"}, {classId:1, className: "三年二班"}, {classId:9, className: '三年三班'}]
    }
  },
  mounted(){
    
  },
  created() { 
    //this.getAllClass();
    this.getlineChartData();
  },
  methods:{
    getAllClassByTeacherId(){
      getAllClassByTeacherId({
        isAll:1,
        pattern:""
      }).then(res=>{
        this.classList = res.data.classList;
      });
    },
     getAllClass(){
      getAllClass({
        isAll:1,
        pattern:""
      }).then(res=>{
        this.classList = res.data.classList;
      });
    },
    getlineChartData(){
      let xAxisData = [];
      let yAxisData = [];
      for(let i = 6; i >= 0; i--){
        xAxisData.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
      }
      let promiseArray = [];
      for(let i in this.selectClassList){
        promiseArray.push(getClassGradePerDay(this.selectClassList[i].classId, {}));
      }
      Promise.all(promiseArray).then(resultList => {
        for(let i in resultList){
          let oneClassItem = {};
          oneClassItem.yName = this.selectClassList[i].className;
          oneClassItem.yDataList = [];
          for(let j in xAxisData){
            let found = 0;
            for(let k in resultList[i].data.classGrade){
              if(resultList[i].data.classGrade[k].date === xAxisData[j]){
                oneClassItem.yDataList.push(resultList[i].data.classGrade[k].wordNum);
                found = 1;
                break;
              }
            }
            if(found === 0){
              oneClassItem.yDataList.push(0);
            }
          }
          yAxisData.push(oneClassItem);
        }
        this.lineChartData.xAxisData = xAxisData;
        this.lineChartData.yAxisData = yAxisData;
      })
    },
  }
}
</script>

<style lang="less" scoped>
.diagnosisInfo{
  width:100%;
  position:relative;
  padding:0 20px;
  h3{
    text-align:center;
    line-height:50px;
    font-size:24px;
  }
  .diagnosisMain{
    .dashboardMain{
      width:600px;
      margin:0 auto;
      > div{
        float:left;
      }
    }
  }
  .classquesrateMain{
    width:600px;
    margin:0 auto;
  }
  .diagnosisTab{
    // position: fixed;
    // bottom:0;
    width:100%;
    height:80px;
    line-height:80px;
    text-align:center;
    ul{
      padding:0;
      overflow:hidden;
      width:600px;
      margin:30px auto 0;
      line-height:80px;
      li{
        float:left;
        width:100px;
        list-style: none;
        height:25px;
        line-height:25px;
        color:#333;
        border-radius:20px;
        border:1px solid #fff;
        cursor:pointer;
        margin:0 10px;
        &.default{
          color:#309bff;
          border:1px solid #309bff; 
        }
      }
    }
  }
}

</style>
