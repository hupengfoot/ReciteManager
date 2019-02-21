<template>
  <div class="monitoring">
    <el-select v-model="classId">
      <el-option  v-for="(item,index) in classList" :key="index" :label="item.className" :value="item.id"></el-option>
    </el-select>
    <h3>班级列表</h3>
    <div class="classList">
        <el-dropdown class="avatar-container" trigger="click" :hide-on-click="false" ref="messageDrop">
          <div class="avatar-wrapper">
            <img src="@/assets/shaixuan.jpeg" class="user-avatar" height="20" width="20">
            <span class="name">筛选</span>
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-scrollbar style="height:100%">
              <div class="classList" v-for="(item, index) in classList" :key="index">
                <el-dropdown-item divided>
                  <span><el-checkbox @change="handleCheckAllChange(index)"/></span> <span>{{item.className}}</span>
                </el-dropdown-item>
              </div>
            </el-scrollbar>
            <el-dropdown-item divided>
              <el-button size="mini" type="danger" @click="getCompareData()">{{ '确定' }}</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
          <line-chart :chart-data="lineChartData" id="classcompareMain1" style="position: absolute; left: 0px; top: 0px; width: 1332px; "/>
        </el-row>
        <!-- <div class="dashboard" v-show="type=='dashboard'">
          <h3>{{stuInfo.realName}}单词学习仪表盘</h3>
          <div class="dashboardMain">
            <div id="unitPassNum" :style="{width: '300px', height: '300px'}"></div> 
            <div id="wordNum" :style="{width: '300px', height: '300px'}"></div>
          </div>
        </div> -->
    </div>
    

  </div>
</template>

<script>
import { getList,getAllClass,createClass,getAllClassByTeacherId,getClassGradePerDay, getClassExamCorrectRate } from '@/api/table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import {successShow,errorShow} from '@/utils/notice.js'
import classDialog from '@/components/dialog/classDialog'
import store from '@/store'

import LineChart from '@/components/echarts/LineChart'
import HistogramChart from '@/components/echarts/HistogramChart'
import moment from 'moment'
const lineChartData = {
  xAxisData: [],
  yAxisData:[
  ]
}

export default {
  name: 'monitoring',
  components: { Pagination,classDialog,LineChart,HistogramChart },

  data() {
    return {
      classList:[],
      classId:'',
      type:'classcompare',
      lineChartData: lineChartData,
      classList: [],
      classSelectStatusList: [],
      selectClassList: []
    }
  },
  created() {
    this.getAllClass();
  },
  watch:{
    
  },
  methods: {
    


    //诊断报告代码
     getAllClass(){
      getAllClass({
        isAll:1,
        pattern:""
      }).then(res=>{
        this.classList = res.data.classList;
        for(var i in this.classList){
          this.classSelectStatusList.push(0);
        }
      });
    },
    getlineChartData(){
      let xAxisData = [];
      let yAxisData = [];
      for(let i = 6; i >= 0; i--){
        xAxisData.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
      }
      let promiseArray = [];
      for(var i in this.classSelectStatusList){
        if(this.classSelectStatusList[i] === 1){
          this.selectClassList.push(this.classList[i]);
          promiseArray.push(getClassGradePerDay(this.classList[i].id, {}));
        }
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
    getCompareData(){
      this.$refs.messageDrop.hide();
      if(this.type === "classcompare"){
        this.getlineChartData();
      }else{
        this.getHistogramChartData();
      }
    },
    handleCheckAllChange(index){
      this.classSelectStatusList[index] = (this.classSelectStatusList[index] + 1) % 2
    }
  }
  
}
</script>
<style lang="less" scope>
.user-dropdown{
    height:350px;
    padding-bottom:50px;
    >.el-dropdown-menu__item{
      text-align:center;
    }
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
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
  .monitoring{
    padding:20px 20px 0;
    font-size:14px;
    
  .dashboard{
    h3{
      text-align:center;
      height:80px;
      line-height:65px;
      font-size:24px;
      margin-bottom:50px;
      background: url("../../assets/greenTitle.png") no-repeat center;
      background-size:557px 100%;
    }
  }
  }
</style>