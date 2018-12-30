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
    </div>
    
  </div>
</template>

<script>
import {getClassUnitNum,getStuInfoByStuId,getStuUnitPassNum,getStuWordNum,getStuUnitCompleteInfo,getStuExamCorrectRate } from '@/api/table'
import Pagination from '@/components/Pagination'
import pieChart from "@/components/echarts/dashboard";
import {isUndefined} from '@/utils/index.js'
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
      ClassExamCorrectRateData:[]
    }
  },
  mounted(){
    this.getStuInfoByStuId()
    this.getClassUnitNum()
    // this.getStuWordNum()
    this.getStuUnitCompleteInfo()
    this.getStuExamCorrectRate()
    
    
  },
  methods:{
    getClassUnitNum(){//总单元数
      getClassUnitNum(this.$route.query.classId).then(res=>{
        // this.unitPassNum.push({value:res.data.unitNum,name:'总单元数'});
        this.getStuUnitPassNum(res.data.unitNum)
      })
    },
    getStuUnitPassNum(countNum){//通过的单元数
      getStuUnitPassNum(this.$route.query.stuId).then(res=>{
         this.unitPassNum.push({value:res.data.stuUnitPassNum,name:'已掌握'});
         this.unitPassNum.push({value:countNum-res.data.stuUnitPassNum,name:'未掌握'});
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
    getStuUnitCompleteInfo(){
      getStuUnitCompleteInfo(this.$route.query.stuId,this.stuInfoPage).then(res=>{
        for(let i=0;i<res.data.stuUnitLearningInfo.records.length;i++){
          res.data.stuUnitLearningInfo.records[i].chapter = res.data.stuUnitLearningInfo.records[i].course.split(';')[0]
          res.data.stuUnitLearningInfo.records[i].group = res.data.stuUnitLearningInfo.records[i].course.split(';')[1]
          res.data.stuUnitLearningInfo.records[i].unit = res.data.stuUnitLearningInfo.records[i].course.split(';')[2]
        }
        this.StuUnitCompleteInfoData = res.data.stuUnitLearningInfo
        console.log(this.StuUnitCompleteInfoData)
        this.stuInfoTotal = res.data.stuUnitLearningInfo.pages
      })
    },
    getStuExamCorrectRate(){
      getStuExamCorrectRate(this.$route.query.stuId).then(res=>{
        this.ClassExamCorrectRateData.name = ['英文选义','听音选英','中文选词','看义拼词'];
        this.ClassExamCorrectRateData.percentage = [isUndefined(res.data.examCorrectNum.EnglishToChinese),isUndefined(res.data.examCorrectNum.ListenToEnglish),isUndefined(res.data.examCorrectNum.ChineseToChoice),isUndefined(res.data.examCorrectNum.ChineseToEnglish)]
        //console.log(this.ClassExamCorrectRateData)
        this.ClassExamCorrectRate()
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
    line-height:50px;
    font-size:24px;
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
  .scoreMain{
    width:600px;
    margin:0 auto;
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
