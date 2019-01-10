<template>
  <div class="diagnosisInfo">
    <div class="diagnosisTab">
      <ul>
        <li @click="type='classcompare'"  :class="{'default':type=='classcompare'}">词汇量比较</li>
        <li @click="type='classquesrate'"  :class="{'default':type=='classquesrate'}">班级得分率比较</li>
      </ul>
    </div>
    <div>
      <el-dropdown class="avatar-container" trigger="click" :hide-on-click="false" ref="messageDrop">
      <div class="avatar-wrapper">
        <img src="@/assets/shaixuan.jpeg" class="user-avatar" height="20" width="20">
        <span class="name">筛选</span>
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown" style="height:300px">
        <el-scrollbar style="height:100%">
          <div class="classList" v-for="(item, index) in classList" :key="index">
            <el-dropdown-item divided>
              <span><el-checkbox @change="handleCheckAllChange(item)"/></span> <span>{{item.className}}</span>
            </el-dropdown-item>
          </div>
        </el-scrollbar>
        <div>
          <el-button size="mini" type="danger" @click="getCompareData()">{{ '确定' }}</el-button>
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
      <div class="classquesrate" v-show="type=='classquesrate'" style="width: 700px">
        <h3>班级得分率分析</h3>
        <div class="classquesrateMain" style="width: 700px">
          <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;width: 700px">
            <histogram-chart :chart-data="histogramChartData" id="classquesrateMain1" style="position: absolute; left: 0px; top: 0px; width: 1332px; "/>
          </el-row>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import {getAllClassByTeacherId, getAllClass, getClassGradePerDay, getClassExamCorrectRate } from '@/api/table'
import LineChart from '@/components/echarts/LineChart'
import HistogramChart from '@/components/echarts/HistogramChart'
import moment from 'moment'

const lineChartData = {
  xAxisData: [],
  yAxisData:[
  ]
}

const HistogramChartData = {
  xAxisData: ['汉选英', '看义拼单词', '英选汉', '听音选英'],
  yAxisData:[
  ]
}

export default {
  name: 'diagnosisInfo',
  components: { 
    LineChart,
    HistogramChart
  },
  data(){
    return{
        type:'classcompare',
        lineChartData: lineChartData,
        histogramChartData: HistogramChartData,
        classList: [],
        selectClassList: []
    }
  },
  mounted(){
    
  },
  created() { 
    this.getAllClass();
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
    getCompareData(){
      this.$refs.messageDrop.hide();
      if(this.type === "classcompare"){
        this.getlineChartData();
      }else{
        this.getHistogramChartData();
      }
    },
    getHistogramChartData(){
      let xAxisData = ["汉选英", "看义拼单词", "英选汉", "听音选英"];
      let yAxisData = [];
      let promiseArray = [];
      for(let i in this.selectClassList){
        promiseArray.push(getClassExamCorrectRate(this.selectClassList[i].classId, {}));
      }
      Promise.all(promiseArray).then(resultList => {
        for(let i in resultList){
          let oneClassItem = {};
          oneClassItem.yName = this.selectClassList[i].className;
          oneClassItem.yDataList = [];
          for(let j in resultList[i].data.examCorrectNum){
            //TODO 这里要取百分数
            oneClassItem.yDataList.push(resultList[i].data.examCorrectNum[j].rightNum / resultList[i].data.examCorrectNum[j].rightNum + resultList[i].data.examCorrectNum[j].wrongNum);
          }
          yAxisData.push(oneClassItem);
        }
        this.histogramChartData.xAxisData = xAxisData;
        this.histogramChartData.yAxisData = yAxisData;
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
          if(resultList[i].data.code === 500){
            oneClassItem.yDataList = [0,0,0,0,0,0,0];
            yAxisData.push(oneClassItem);
            break;
          }
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
        //查询完毕后情况查询班级数组
        this.selectClassList = [];
      })
    },
    handleCheckAllChange(item){
      this.selectClassList.push({classId:item.id, className:item.className});
    }
  }
}
</script>

<style lang="less" scoped>
.el-scrollbar__wrap {
   overflow-x: hidden;
}
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
