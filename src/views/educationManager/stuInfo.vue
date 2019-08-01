<template>
  <div class="stuInfo">
    <div class="stuTypeTab">
      <ul>
        <li @click="type='dashboard'"  :class="{'default':type=='dashboard'}">分析仪表盘</li>
        <li @click="type='growth'"  :class="{'default':type=='growth'}">成长记录</li>
        <li @click="type='score'"  :class="{'default':type=='score'}">得分率分析</li>
        <li @click="type='details'"  :class="{'default':type=='details'}">学习详情</li>
        <li @click="type='wordNum'"  :class="{'default':type=='wordNum'}">词汇量测试</li>
      </ul>
    </div>
    <div class="stuMain">
      <div class="dashboard" v-show="type=='dashboard'">
        <h3>{{stuInfo.realName}}单词学习仪表盘</h3>
        <div class="dashboardMain">
          <div id="unitPassNum" :style="{width: '300px', height: '300px'}"></div> 
          <div id="wordNum" :style="{width: '300px', height: '300px'}"></div>
        </div>
      </div>
      <div class="growth" v-show="type=='growth'">
        <h3>{{stuInfo.realName}}成长记录</h3>
        <div class="growthMain">
          <div id="getStuWordNumPerDay" :style="{width: '800px', height: '400px'}"></div>
          <div class="mask"></div>
          <div id="getStuGradeRankPer" :style="{width:'800px',height:'300px'}"></div>
        </div>
      </div>
      <div class="score" v-show="type=='score'">
        <h3>{{stuInfo.realName}}题型得分率分析</h3>
        <div class="scoreMain">
          <div id="ClassExamCorrectRate" :style="{width: '600px', height: '300px'}"></div>
        </div>
      </div>
      <div class="details" v-show="type=='details'">
        <div class="detailsMain">
          <el-table border :data="StuUnitCompleteInfoData.records">
            <el-table-column label="章节" prop="chapter"></el-table-column>
            <el-table-column label="组名" prop="group"></el-table-column>
            <el-table-column label="单元" prop="unit"></el-table-column>
            <el-table-column label="首次掌握" prop="firstPass"></el-table-column>
            <el-table-column label="二次掌握" prop="timesPass"></el-table-column>
            <el-table-column label="未掌握" prop="noPass"></el-table-column>
            <el-table-column label="学习时间" prop="learnTime">
              <template slot-scope="scope">
                {{scope.row.learnTime | timestamp}}
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="stuInfoTotal>0" :total="stuInfoTotal" :page.sync="stuInfoPage.page" :limit.sync="stuInfoPage.limit" @pagination="getStuUnitCompleteInfo" />
        </div>
      </div>
      <div class="wordNum" v-show="type=='wordNum'">
        <h3>{{stuInfo.realName}}词汇量分析</h3>,
        <div class="wordNumMain">
          <div class="wordNumCenter" v-show="StuAdmissionAnalysisData.score">
            <div class="wordNumLeft">
              <div id="wordNumProgress" :style="{width: '400px', height: '300px'}"></div>
              <div class="leftMain">
                <p>词汇量：{{StuAdmissionAnalysisData.score}}</p>
                <p>题数：{{StuAdmissionAnalysisData.testNum}}</p>
                <p>用时：{{StuAdmissionAnalysisData.time}}</p>
                <p class="blue">很棒哦，继续加油！</p> 
              </div>
            </div>
            <div class="wordNumRight">
              <h5>测评分析</h5>
              <p>根据你的测试情况，认为你的词汇水平位于<span class="blue">{{StuAdmissionAnalysisData.testLevel}}水平</span>
              <h5>学习建议</h5>
              <p v-for="(i,index) in StuAdmissionAnalysisData.comments">{{index+1}}、{{i}}</p>
            </div>
          </div>
          <div>尚未测试</div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import {getStuAdmissionAnalysis,getStuGradeRankPerDay,getStuWordNumPerDay,getClassUnitNum,getStuInfoByStuId,getStuUnitPassNum,getStuWordNum,getStuUnitCompleteInfo,getStuExamCorrectRate } from '@/api/table'
import Pagination from '@/components/Pagination'
import pieChart from "@/components/echarts/dashboard";
import {isUndefined} from '@/utils/index.js'
import {addDate} from '@/utils/validate.js'
export default {
  name: 'stuInfo',
  components: { Pagination,pieChart },
  data(){
    return{
      stuInfo:{},
      type:'dashboard',
      unitPassNum:[],
      understandNum:[],
      StuUnitCompleteInfoData:{},
      stuInfoPage:{
        page:1,
        limit:10
      },
      stuInfoTotal:0,
      ClassExamCorrectRateData:[],
      earlyUnderstand:[],
      earlyHalfUnderstand:[],
      earlyNotUnderstand:[],
      eveningUnderstand:[],
      eveningHalfUnderstand:[],
      eveningNotUnderstand:[],
      StuAdmissionAnalysisData:{
        time:''
      },
      classRank:[],
    }
  },
  mounted(){
    
    this.getStuInfoByStuId()
    this.getClassUnitNum()
    // this.getStuWordNum()
    this.getStuUnitCompleteInfo()
    this.getStuExamCorrectRate()
    this.getStuWordNumPerDay()
    this.getStuGradeRankPerDay()
    this.getStuAdmissionAnalysis()
  },
  methods:{
    getClassUnitNum(){//总单元数
      getClassUnitNum(this.$route.query.stuId).then(res=>{
        // this.unitPassNum.push({value:res.data.unitNum,name:'总单元数'});
        this.getStuUnitPassNum(res.data.stuUnitPassNum)
      })
    },
    getStuUnitPassNum(countNum){//通过的单元数
      getStuUnitPassNum(this.$route.query.stuId).then(res=>{
         this.unitPassNum.push({value:res.data.stuUnitPassNum,name:'已掌握'});
         this.unitPassNum.push({value:countNum,name:'未掌握'});
         this.getStuWordNum()
      })
    },
    getStuInfoByStuId(){//学生信息
      getStuInfoByStuId(this.$route.query.stuId).then(res=>{
        this.stuInfo = res.data.stuInfo;
      })
    },
    getStuWordNum(){//查询生词、夹生词等
      getStuWordNum(this.$route.query.stuId).then(res=>{
        this.understandNum.push({value:res.data.stuWordNum.understand,name:'熟词'},{value:res.data.stuWordNum.halfUnderstand,name:'夹生词'},{value:res.data.stuWordNum.notUnderstand,name:'生词'})
        this.drawLine()
      })
    },
    getStuWordNumPerDay(){// 获取学生每天上午下午的熟词生词夹生词的数量
      getStuWordNumPerDay(this.$route.query.stuId).then(res=>{
        // this.stuWordNumPerDay = res.data.stuWordNum;
        let nowDay = new Date();
        let days = nowDay.getTime() - new Date(this.$route.query.startDate.replace(/-/g, "/"));
        let time = parseInt(days / (1000 * 60 * 60 * 24));
        for(let i = 0; i < time; i ++){
          this.earlyUnderstand.push(0);
          this.earlyHalfUnderstand.push(0);
          this.earlyNotUnderstand.push(0);
          this.eveningUnderstand.push(0);
          this.eveningHalfUnderstand.push(0);
          this.eveningNotUnderstand.push(0);
        }
        for(let i=0;i<res.data.stuWordNum.length;i++){
          let index = -1;
          for(let j = 0; j < time; j++){
            if(res.data.stuWordNum[i].date === addDate(this.$route.query.startDate,j)){
              index = j;
              break;
            }
          }
          if(index >= 0){
            if(res.data.stuWordNum[i].period===1){
                this.earlyUnderstand[index] = res.data.stuWordNum[i].understanded;
                this.earlyHalfUnderstand[index] = res.data.stuWordNum[i].understanding;
                this.earlyNotUnderstand[index] = res.data.stuWordNum[i].notUnderstand;
            }else{
                this.eveningUnderstand[index] = res.data.stuWordNum[i].understanded;
                this.eveningHalfUnderstand[index] = res.data.stuWordNum[i].understanding;
                this.eveningNotUnderstand[index] = res.data.stuWordNum[i].notUnderstand;
            }
          }
        }
        this.getStuWordNumPerEcharts(time)
      })
    },
    getStuGradeRankPerDay(){//查询班级排名
      getStuGradeRankPerDay({classStuId:this.$route.query.stuId,classId:this.$route.query.classId}).then(res=>{
        this.classRank.push(res.data.stuRankList.day1AM,res.data.stuRankList.day1PM,res.data.stuRankList.day2AM,res.data.stuRankList.day2PM,res.data.stuRankList.day3AM,res.data.stuRankList.day3PM,res.data.stuRankList.day4AM,res.data.stuRankList.day4PM,res.data.stuRankList.day5AM,res.data.stuRankList.day5PM,res.data.stuRankList.day6AM,res.data.stuRankList.day6PM);
        this.getStuGradeRankPerEcharts()
      })
    },
    getStuUnitCompleteInfo(){//学习详情
      getStuUnitCompleteInfo(this.$route.query.stuId,this.stuInfoPage).then(res=>{
        for(let i=0;i<res.data.stuUnitLearningInfo.records.length;i++){
          res.data.stuUnitLearningInfo.records[i].chapter = res.data.stuUnitLearningInfo.records[i].course.split(';')[0]
          res.data.stuUnitLearningInfo.records[i].group = res.data.stuUnitLearningInfo.records[i].course.split(';')[1]
          res.data.stuUnitLearningInfo.records[i].unit = res.data.stuUnitLearningInfo.records[i].course.split(';')[2]
        }
        this.StuUnitCompleteInfoData = res.data.stuUnitLearningInfo
        //console.log(this.StuUnitCompleteInfoData)
        this.stuInfoTotal = res.data.stuUnitLearningInfo.total
      })
    },
    getStuExamCorrectRate(){//题型得分率分析
      getStuExamCorrectRate(this.$route.query.stuId).then(res=>{
        this.ClassExamCorrectRateData.name = ['英文选义','听音选英','中文选词','看义拼词'];
        this.ClassExamCorrectRateData.percentage = [isUndefined(res.data.examCorrectNum.EnglishToChinese),isUndefined(res.data.examCorrectNum.ListenToEnglish),isUndefined(res.data.examCorrectNum.ChineseToChoice),isUndefined(res.data.examCorrectNum.ChineseToEnglish)]
        //console.log(this.ClassExamCorrectRateData)
        this.ClassExamCorrectRate()
      })
    },
    getStuGradeRankPerEcharts(){//成长记录-班级排名
      let wordNum = this.$echarts.init(document.getElementById('getStuGradeRankPer'))
        // 绘制图表
        wordNum.setOption({
            tooltip: {
              // trigger: 'axis',
              formatter:'第{c}'
            },
            xAxis: {
                type: 'category',
                axisLine: {onZero: false},
                // data:this.classRank
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, 1],
                inverse:true
            },
            series: [{
                data: this.classRank,
                type: 'line'
            }]
        });
    },
    getStuWordNumPerEcharts(time){//成长记录
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('getStuWordNumPerDay'))
        let xAxisData = [];
        for(let i = 0; i < time; i++){
          xAxisData.push(addDate(this.$route.query.startDate,i))
        }
        // 绘制图表
        myChart.setOption({
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
                data: xAxisData,
                name: '',
            },
            yAxis: {
            },
            series: [
                {
                    name: 'AM 熟词',
                    type: 'bar',
                    stack: 'one',
                    data: this.earlyUnderstand
                },
                {
                    name: 'AM 夹生词',
                    type: 'bar',
                    stack: 'one',
                    data:  this.earlyHalfUnderstand
                },
                {
                    name: 'AM 生词',
                    type: 'bar',
                    stack: 'one',
                    data:  this.earlyNotUnderstand
                },
                {
                    name: 'PM 熟词',
                    type: 'bar',
                    stack: 'two',
                    data: this.eveningUnderstand
                },
                {
                    name: 'PM 夹生词',
                    type: 'bar',
                    stack: 'two',
                    data: this.eveningHalfUnderstand
                },
                {
                    name: 'PM 生词',
                    type: 'bar',
                    stack: 'two',
                    data: this.eveningNotUnderstand
                }
            ]
        })
    },
    getStuAdmissionAnalysis(){
      getStuAdmissionAnalysis(this.$route.query.stuId).then(res=>{
        if(res.data.admissionTest){
          this.StuAdmissionAnalysisData = res.data.admissionTest
          this.StuAdmissionAnalysisData.time = parseInt(this.StuAdmissionAnalysisData.testTime*1/100/60)+"分"+parseInt(this.StuAdmissionAnalysisData.testTime*1/100%60)+"秒";
          this.wordNumProgress(res.data.admissionTest)
        }
        
      })
    },
    wordNumProgress(data){//词汇量分析图表
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('wordNumProgress'))
        // 绘制图表
        myChart.setOption({
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
            },
            series: [
                {
                    name: '业务指标',
                    type: 'gauge',
                    detail: {formatter:'{value}%'},
                    data: [{value: data.accuracy*1, name: ''}]
                }
            ]
        })
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
    },
    ClassExamCorrectRate(){
      // console.log(this.ClassExamCorrectRateData.percentage)
      let wordNum = this.$echarts.init(document.getElementById('ClassExamCorrectRate'))
        // 绘制图表
        wordNum.setOption({
            color: ['#3398DB'],
            tooltip : {
              formatter:'{c}%'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : this.ClassExamCorrectRateData.name,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    barWidth: '60%',
                    formatter: '{b}\n{c}%',
                    data:this.ClassExamCorrectRateData.percentage
                    
                    
                }
            ]
        });
    }
  }
}
</script>

<style lang="less" scoped>
.stuInfo{
  width:100%;
  position:relative;
  padding:0 20px;
  h3{
    text-align:center;
    height:80px;
    line-height:65px;
    font-size:24px;
    margin-bottom:50px;
  }
  .dashboard{
    h3{
      background: url("../../assets/greenTitle.png") no-repeat center;
      background-size:557px 100%;
    }
  }
  .stuMain{
    .dashboardMain{
      width:600px;
      margin:0 auto;
      > div{
        float:left;
      }
    }
  }
  .score{
    h3{
      background: url("../../assets/orangeTitle.png") no-repeat center;
      background-size:557px 100%;
    }
    .scoreMain{
      width:600px;
      margin:0 auto;
    }
  }
  
  .growth{
    h3{
      background: url("../../assets/blueTitle.png") no-repeat center;
      background-size:557px 100%;
    }
    .growthMain{
      position:relative;
      width:800px;
      margin:0 auto;
      .mask{
        position: absolute;
        height: 20px;
        width: 100%;
        background: #fff;
        top: 445px;
        z-index: 1;
      }
    }
  }
  .wordNum{
    h3{
      background: url("../../assets/gradientTitle.png") no-repeat center;
      background-size:557px 100%;
    }
    .wordNumMain{
      text-align:center;
      .wordNumCenter{
        display:inline-block;
        width:800px;
        margin:0 auto;
        .wordNumLeft{
          float:left;
          .leftMain{
            position:relative;
            top:-96px;
            font-size:18px;
            p{
              height:15px;
              line-height:15px;
            }
            .blue{
              color:#309bff;
              font-size:24px;
            }
            .cyan{
              color:#7aedff;
            }
          }
        }
        .wordNumRight{
          text-align:left;
          float:left;
          width:400px;
          p{
            line-height:22px;
          }
          .blue{
            color:#309bff;
          }
          h5{
            font-size:18px;
            color:#309bff;
          }
        }
      }
      
    }
  }
  
  
  .stuTypeTab{
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
