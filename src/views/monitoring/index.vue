<template>
  <div class="monitoring">
    <el-select v-model="classInfo" value-key="id">
      <el-option  v-for="(item,index) in classList" :label="item.className" :value="item" :key="item.id"></el-option>
    </el-select>
    <h3>班级词汇比较</h3>
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
        <el-row style="height:350px;background:#fff;padding:16px 16px 0;margin-bottom:32px;">
          <line-chart :chart-data="lineChartData" id="classcompareMain1" style="position: absolute; left: 0px; top: 0px; width: 1332px; "/>
        </el-row>
        <div class="dashboard">
          <h3>{{classInfo.className}}单词学习仪表盘</h3>
          <div class="dashboardMain">
            <div id="unitPassNum" :style="{float:'left',width: '300px', height: '300px'}"></div> 
            <div id="wordNum" :style="{float:'left',width: '300px', height: '300px'}"></div>
          </div>
          
        </div>
        <div class="dashboard">
          <h3>{{classInfo.className}}题型得分率分析</h3>
          <div class="dashboardMain">
            <div id="scoringAverage" :style="{float:'left',width: '550px', height: '500px'}"></div> 
          </div>
        </div>
    </div>
    

  </div>
</template>

<script>
import {unitStudyInfo,unitWordNum,scoringAverage, getList,getAllClass,createClass,getAllClassByTeacherId,getClassGradePerDay, getClassExamCorrectRate } from '@/api/table'
import {successShow,errorShow} from '@/utils/notice.js'

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
  components: { LineChart,HistogramChart },

  data() {
    return {
      classList:[],
      classInfo:{
        id:'',
        className:''
      },
      lineChartData: lineChartData,
      classSelectStatusList: [],
      selectClassList: [],
      unitPassNum:[],
      understandNum:[],
      scoringAverageNum:[]
    }
  },
  created() {
    this.getAllClass();
    // this.unitStudyInfo();
  },
  watch:{
    classInfo: {
      handler: function (newVal, oldVal) {
        this.unitStudyInfo()
      },
      deep: true
    }
  },
  methods: {
    unitStudyInfo(){//总单元数
      this.unitPassNum=[];
      unitStudyInfo({classId:this.classInfo.id}).then(res=>{
        this.unitPassNum.push({value:res.data.classUnitNum.stuUnitPassNum,name:'已掌握'});
        this.unitPassNum.push({value:res.data.classUnitNum.stuUnitNoPassNum,name:'未掌握'});
        this.unitWordNum();
      })
    },
    unitWordNum(){//通过的单元数
      this.understandNum=[];
      unitWordNum({classId:this.classInfo.id}).then(res=>{
         this.understandNum.push({value:res.data.classWordNum.understand,name:'熟词'},{value:res.data.classWordNum.halfUnderstand,name:'夹生词'},{value:res.data.classWordNum.notUnderstand,name:'生词'})
         this.scoringAverage();
      })
    },
    scoringAverage(){//题型得分率分析
      this.scoringAverageNum=[];
      scoringAverage({classId:this.classInfo.id}).then(res=>{
         this.scoringAverageNum.push(res.data.scoringAverage.questionType0,res.data.scoringAverage.questionType1,res.data.scoringAverage.questionType2,res.data.scoringAverage.questionType3,res.data.scoringAverage.questionType4)
         this.drawLine();
      })
    },
    //诊断报告代码
     getAllClass(){
      getAllClass({
        isAll:1,
        pattern:""
      }).then(res=>{
        this.classList = res.data.classList;
        this.classInfo = res.data.classList[0];
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
        this.getlineChartData();
    },
    handleCheckAllChange(index){
      this.classSelectStatusList[index] = (this.classSelectStatusList[index] + 1) % 2
    },
    drawLine(){//饼状图
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('unitPassNum'))
        // 绘制图表
        myChart.setOption({
            tooltip: {
            },
            legend: {
                orient: 'vertical',
                x: 'left',
            },
            series: [
                {
                    name:'单元数',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    data:this.unitPassNum
                }
            ]
        });
        let wordNum = this.$echarts.init(document.getElementById('wordNum'))
        // 绘制图表
        wordNum.setOption({
            tooltip: {
            },
            legend: {
                orient: 'vertical',
                x: 'right',
            },
            series: [
                {
                    name:'',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    data:this.understandNum
                }
            ]
        });
        // 基于准备好的dom，初始化echarts实例
        let scoringAverage  = this.$echarts.init(document.getElementById('scoringAverage'))
        // 绘制图表
        scoringAverage.setOption({
            title: {
                
            },
            
            radar: [
                {},
                {
                    indicator: [
                        { text: '综合', max: 100 },
                        { text: '听音辨英', max: 100 },
                        { text: '看英选义', max: 100 },
                        { text: '看义拼词', max: 100 },
                        { text: '中文选英', max: 100 }
                    ],
                    
                    radius: 200
                }
            ],
            series: [
                {
                    name: '成绩单',
                    type: 'radar',
                    radarIndex: 1,
                    data: [
                        {
                            value: this.scoringAverageNum,
                            name: '成绩单',
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value+'%';
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        });
    },
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
    h3{
      text-align:center;
      
      
      font-size:24px;
      
    }
    .dashboard{
      overflow:hidden;
      .dashboardMain{
        width:600px;
        margin:0 auto;
      }
      h3{
        height:80px;
        line-height:65px;
        margin-bottom:50px;
        background: url("../../assets/greenTitle.png") no-repeat center;
        background-size:557px 100%;
      }
        
    }
  
  }
</style>