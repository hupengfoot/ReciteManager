<template>
  <div class="contrast">
    <ul class="topTab">
      <li @click="type='classcompare'"  :class="{'default':type=='classcompare'}">班级互比</li>
      <li @click="type='classquesrate'"  :class="{'default':type=='classquesrate'}">个人互比</li>
    </ul>
    <div v-show="type=='classcompare'">
      <div class="contrastLeft">
        <el-form>
          <el-form-item label="" prop="className">
            <el-select v-model="classListSub[0]" value-key='id'>
              <el-option v-for="(item,index) in classList" :label="item.className" :value="item.id"  :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="" prop="className">
              <el-date-picker type="datetime" placeholder="请选择开课时间" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
          </el-form-item> -->
          <el-form-item label="" prop="className">
            <el-select v-model="classListSub[1]" value-key='id'>
              <el-option v-for="(item,index) in classList" :label="item.className" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="" prop="className">
              <el-date-picker type="datetime" placeholder="请选择开课时间" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
          </el-form-item> -->
        </el-form>
        <el-table :data="classContrastData">
          <el-table-column
            prop="className"
            label=""
            width="180">
          </el-table-column>
          <el-table-column
            prop="studyTime"
            label="学习时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="stuNum"
            label="人数">
          </el-table-column>
        </el-table>
        <el-table :data="differencesData">
          <el-table-column
            prop="name"
            label=""
            width="180">
          </el-table-column>
          <el-table-column
            prop="Aclass"
            :label="classA"
            width="180">
          </el-table-column>
          <el-table-column
            prop="Bclass"
            :label="classB"
            >
          </el-table-column>
          <el-table-column
            prop="differences"
            label="差异">
          </el-table-column>
        </el-table>
      </div>
      <div class="contrastRight">
        <div id="contrastAll" :style="{float:'left',width: '400px', height: '500px'}"></div>
        <div id="scoringAverage" :style="{float:'left',width: '400px', height: '500px'}"></div>
        <div id="contrastChange" :style="{float:'left',width: '400px', height: '500px'}"></div>
        <div id="contrastStars" :style="{float:'left',width: '400px', height: '500px'}"></div>
      </div>
    </div>
    <div v-if="type=='classquesrate'" class="classquesrate">
      <div class="contrastLeft">
        <el-form>
          <el-form-item label="" prop="className">
            <el-select v-model="studentListSub1" value-key='id'>
              <el-option v-for="(item,index) in classList" :label="item.className" :value="item.id"  :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="" prop="className">
              <el-date-picker type="datetime" placeholder="请选择开课时间" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
          </el-form-item> -->
          <el-form-item label="" prop="className">
            <el-select v-model="studentSub1" value-key='id'>
              <el-option v-for="(item,index) in studentData1" :label="item.realName" :value="item.stuId"  :key="item.stuId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="className">
            <el-select v-model="studentListSub2" value-key='id'>
              <el-option v-for="(item,index) in classList" :label="item.className" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="" prop="className">
              <el-date-picker type="datetime" placeholder="请选择开课时间" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
          </el-form-item> -->
          <el-form-item label="" prop="className">
            <el-select v-model="studentSub2" value-key='id'>
              <el-option v-for="(item,index) in studentData2" :label="item.realName" :value="item.stuId"  :key="item.stuId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- <el-table :data="classContrastData">
          <el-table-column
            prop="className"
            label=""
            width="180">
          </el-table-column>
          <el-table-column
            prop="studyTime"
            label="学习时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="stuNum"
            label="人数">
          </el-table-column>
        </el-table> -->
        <el-table :data="stuDifferencesData">
          <el-table-column
            prop="name"
            label=""
            width="180">
          </el-table-column>
          <el-table-column
            prop="Aclass"
            :label="classA"
            width="180">
          </el-table-column>
          <el-table-column
            prop="Bclass"
            :label="classB"
            >
          </el-table-column>
          <el-table-column
            prop="differences"
            label="差异">
          </el-table-column>
        </el-table>
      </div>
      <div class="contrastRight">
        <div id="contrastAll1" :style="{float:'left',width: '400px', height: '500px'}"></div>
        <div id="scoringAverage1" :style="{float:'left',width: '400px', height: '500px'}"></div>
        <div id="contrastChange1" :style="{float:'left',width: '400px', height: '500px'}"></div>
        <div id="contrastStars1" :style="{float:'left',width: '400px', height: '500px'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {studentContrast,getStuAndGroupInClass,classContrast,unitStudyInfo,unitWordNum,scoringAverage, getList,getAllClass,createClass,getAllClassByTeacherId,getClassGradePerDay, getClassExamCorrectRate } from '@/api/table'
import {successShow,errorShow} from '@/utils/notice.js'



export default {
  name: 'contrast',
  components: {  },

  data() {
    return {
      classContrastData:[],
      classContrastData1:[],
      classList:[],//班级列表
      classListSub:[null,null],
      classA:null,
      classB:null,
      classA1:null,
      classB1:null,
      type:'classcompare',
      tableData:[{
        className:"A班",
        date:"2010-10-21",
        num:"23"
      },{
        className:"B班",
        date:"2010-10-21",
        num:"24"
      }],
      differencesData:[],
      stuDifferencesData:[],
      scoringAverageNum:[{
                value : [4300, 10000, 28000, 35000, 50000, 19000],
                name : '预算分配（Allocated Budget）'
            },
             {
                value : [5000, 14000, 28000, 31000, 42000, 21000],
                name : '实际开销（Actual Spending）'
            }],
      studentListSub1:null,
      studentListSub2:null,
      studentList1:[],
      studentList2:[],
      studentSub:[null,null],
      studentData1:[],
      studentData2:[],
      studentSub1:null,
      studentSub2:null,
      stuDifferencesData:[],
    }
  },
  mounted() {
  // created(){
    // this.newCharts()
    this.selectClassList()
  },
  watch:{
    type: {
      handler: function (newVal, oldVal) {
        if(newVal=="classcompare"){
          this.newCharts()
        }
      },
      deep: true
    },
    classListSub:{
      handler:function(newVal,oldVal){
        this.classContrast()
        
      }
    },
    studentListSub1:{
      handler:function(newVal,oldVal){
        this.selectStudentList1()
        
      }
    },
    studentListSub2:{
      handler:function(newVal,oldVal){
        this.selectStudentList2()
        
      }
    },
    studentSub1:{
      handler:function(newVal,oldVal){
        this.studentContrast()
      }
    },

    studentSub2:{
      handler:function(newVal,oldVal){
        this.studentContrast()
      }
    },
  },
  methods: {
    //查询班级列表
    selectClassList(){
      getAllClass({isAll:1}).then(res => {
        this.classList = res.data.classList;
        this.classListSub[0] = res.data.classList[0].id
        this.classListSub[1] = res.data.classList[1].id
        this.classListSub[0] = 50
        this.classListSub[1] = 51
        this.classContrast()
      })
    },
    //查询学生列表
    selectStudentList1(){
      this.studentSub1 = null;
      getStuAndGroupInClass(this.studentListSub1,{
        page:1,
        limit:1000,
        classId:this.studentListSub1
      }).then(res=>{
        this.studentData1 = res.data.stuList.records
      })
    },
    //查询第二个学生列表
    selectStudentList2(){
      this.studentSub2 = null;
      getStuAndGroupInClass(this.studentListSub2,{
        page:1,
        limit:1000,
        classId:this.studentListSub2
      }).then(res=>{
        this.studentData2 = res.data.stuList.records

      })
    },
    //选择个人对比数据
    studentContrast(){
      studentContrast(this.studentSub1,this.studentSub2).then(res => {
        // this.classContrastData1 = res.data.result.classStudyRecordList;
        this.classA1 = res.data.result.studentStudyRecordList[0].studentName;
        this.classB1 = res.data.result.studentStudyRecordList[1].studentName;
        this.classContrastData1 = res.data.result.studentStudyRecordList;
        this.newCharts1()
        this.stuDifferencesData=[{
          name:"看英选义",
          Aclass:this.classContrastData1[0].studyRateInfo.englishToChineseRate,
          Bclass:this.classContrastData1[1].studyRateInfo.englishToChineseRate,
          differences:(this.classContrastData1[1].studyRateInfo.englishToChineseRate-this.classContrastData1[0].studyRateInfo.englishToChineseRate).toFixed(2)+'%'
      },{
          name:"听音辨音",
          Aclass:this.classContrastData1[0].studyRateInfo.listenToEnglishRate,
          Bclass:this.classContrastData1[1].studyRateInfo.listenToEnglishRate,
          differences:(this.classContrastData1[1].studyRateInfo.listenToEnglishRate-this.classContrastData1[0].studyRateInfo.listenToEnglishRate).toFixed(2)+'%'
      },{
          name:"看义拼词",
          Aclass:this.classContrastData1[0].studyRateInfo.chineseToChoiceRate,
          Bclass:this.classContrastData1[1].studyRateInfo.chineseToChoiceRate,
          differences:(this.classContrastData1[1].studyRateInfo.chineseToChoiceRate-this.classContrastData1[0].studyRateInfo.chineseToChoiceRate).toFixed(2)+'%'
      },{
          name:"看义选英",
          Aclass:this.classContrastData1[0].studyRateInfo.chineseToEnglishRate,
          Bclass:this.classContrastData1[1].studyRateInfo.chineseToEnglishRate,
          differences:(this.classContrastData1[1].studyRateInfo.chineseToEnglishRate-this.classContrastData1[0].studyRateInfo.chineseToEnglishRate).toFixed(2)+'%'
      },{
          name:"综合得分",
          Aclass:this.classContrastData1[0].studyRateInfo.synthesizeScoreRate,
          Bclass:this.classContrastData1[1].studyRateInfo.synthesizeScoreRate,
          differences:(this.classContrastData1[1].studyRateInfo.synthesizeScoreRate-this.classContrastData1[0].studyRateInfo.synthesizeScoreRate).toFixed(2)+'%'
      },{
          name:"熟词率",
          Aclass:this.classContrastData1[0].studyRateInfo.englishToChineseRate,
          Bclass:this.classContrastData1[1].studyRateInfo.englishToChineseRate,
          differences:(this.classContrastData1[1].studyRateInfo.englishToChineseRate-this.classContrastData1[0].studyRateInfo.englishToChineseRate).toFixed(2)+'%'
      },{
          name:"生词率",
          Aclass:this.classContrastData1[0].studyRateInfo.unfamiliarWordRate,
          Bclass:this.classContrastData1[1].studyRateInfo.unfamiliarWordRate,
          differences:(this.classContrastData1[1].studyRateInfo.unfamiliarWordRate-this.classContrastData1[0].studyRateInfo.unfamiliarWordRate).toFixed(2)+'%'
      },{
          name:"夹生词率",
          Aclass:this.classContrastData1[0].studyRateInfo.halfFamiliarWordRate,
          Bclass:this.classContrastData1[1].studyRateInfo.halfFamiliarWordRate,
          differences:(this.classContrastData1[1].studyRateInfo.halfFamiliarWordRate-this.classContrastData1[0].studyRateInfo.halfFamiliarWordRate).toFixed(2)+'%'
      },{
          name:"三星通过率",
          Aclass:this.classContrastData1[0].studyRateInfo.threeStarsRate,
          Bclass:this.classContrastData1[1].studyRateInfo.threeStarsRate,
          differences:(this.classContrastData1[1].studyRateInfo.threeStarsRate-this.classContrastData1[0].studyRateInfo.threeStarsRate).toFixed(2)+'%'
      },{
          name:"已掌握的词汇量 (平均)",
          Aclass:this.classContrastData1[0].studyQuantificationInfo.graspWordNum,
          Bclass:this.classContrastData1[1].studyQuantificationInfo.graspWordNum,
          differences:(this.classContrastData1[1].studyQuantificationInfo.graspWordNum-this.classContrastData1[0].studyQuantificationInfo.graspWordNum)
      },{
          name:"已学到的词汇量 (平均)",
          Aclass:this.classContrastData1[0].studyQuantificationInfo.studyWordNum,
          Bclass:this.classContrastData1[1].studyQuantificationInfo.studyWordNum,
          differences:(this.classContrastData1[1].studyQuantificationInfo.studyWordNum-this.classContrastData1[0].studyQuantificationInfo.studyWordNum)
      }
      // ,{
      //     name:"单元平均通关时长",
      //     Aclass:this.classContrastData[0].studyQuantificationInfo.graspWordNum,
      //     Bclass:this.classContrastData[1].studyQuantificationInfo.graspWordNum,
      //     differences:(this.classContrastData[1].studyQuantificationInfo.graspWordNum-this.classContrastData[0].studyQuantificationInfo.graspWordNum)
      // },{
      //     name:"单词学习时长",
      //     Aclass:this.classContrastData[0].studyQuantificationInfo.studyWordNum,
      //     Bclass:this.classContrastData[1].studyQuantificationInfo.studyWordNum,
      //     differences:(this.classContrastData[1].studyQuantificationInfo.studyWordNum-this.classContrastData[0].studyQuantificationInfo.studyWordNum)
      // }
        ]
      })
    },
    //查询班级对比数据
    classContrast(){
      classContrast(this.classListSub).then(res => {
        this.classA = res.data.result.classStudyRecordList[0].className;
        this.classB = res.data.result.classStudyRecordList[1].className;
        this.classContrastData = res.data.result.classStudyRecordList;
        this.newCharts()
        this.differencesData= [{
          name:"已掌握的词汇量 (平均)",
          Aclass:this.classContrastData[0].studyQuantificationInfo.graspWordNum,
          Bclass:this.classContrastData[1].studyQuantificationInfo.graspWordNum,
          differences:(this.classContrastData[1].studyQuantificationInfo.graspWordNum-this.classContrastData[0].studyQuantificationInfo.graspWordNum)
      },{
          name:"已学到的词汇量 (平均)",
          Aclass:this.classContrastData[0].studyQuantificationInfo.studyWordNum,
          Bclass:this.classContrastData[1].studyQuantificationInfo.studyWordNum,
          differences:(this.classContrastData[1].studyQuantificationInfo.studyWordNum-this.classContrastData[0].studyQuantificationInfo.studyWordNum)
      },{
          name:"看英选义",
          Aclass:this.classContrastData[0].studyRateInfo.englishToChineseRate,
          Bclass:this.classContrastData[1].studyRateInfo.englishToChineseRate,
          differences:(this.classContrastData[1].studyRateInfo.englishToChineseRate-this.classContrastData[0].studyRateInfo.englishToChineseRate).toFixed(2)+'%'
      },{
          name:"听音辨音",
          Aclass:this.classContrastData[0].studyRateInfo.listenToEnglishRate,
          Bclass:this.classContrastData[1].studyRateInfo.listenToEnglishRate,
          differences:(this.classContrastData[1].studyRateInfo.listenToEnglishRate-this.classContrastData[0].studyRateInfo.listenToEnglishRate).toFixed(2)+'%'
      },{
          name:"看义拼词",
          Aclass:this.classContrastData[0].studyRateInfo.chineseToChoiceRate,
          Bclass:this.classContrastData[1].studyRateInfo.chineseToChoiceRate,
          differences:(this.classContrastData[1].studyRateInfo.chineseToChoiceRate-this.classContrastData[0].studyRateInfo.chineseToChoiceRate).toFixed(2)+'%'
      },{
          name:"看义选英",
          Aclass:this.classContrastData[0].studyRateInfo.chineseToEnglishRate,
          Bclass:this.classContrastData[1].studyRateInfo.chineseToEnglishRate,
          differences:(this.classContrastData[1].studyRateInfo.chineseToEnglishRate-this.classContrastData[0].studyRateInfo.chineseToEnglishRate).toFixed(2)+'%'
      },{
          name:"综合得分",
          Aclass:this.classContrastData[0].studyRateInfo.synthesizeScoreRate,
          Bclass:this.classContrastData[1].studyRateInfo.synthesizeScoreRate,
          differences:(this.classContrastData[1].studyRateInfo.synthesizeScoreRate-this.classContrastData[0].studyRateInfo.synthesizeScoreRate).toFixed(2)+'%'
      },{
          name:"熟词率",
          Aclass:this.classContrastData[0].studyRateInfo.englishToChineseRate,
          Bclass:this.classContrastData[1].studyRateInfo.englishToChineseRate,
          differences:(this.classContrastData[1].studyRateInfo.englishToChineseRate-this.classContrastData[0].studyRateInfo.englishToChineseRate).toFixed(2)+'%'
      },{
          name:"生词率",
          Aclass:this.classContrastData[0].studyRateInfo.unfamiliarWordRate,
          Bclass:this.classContrastData[1].studyRateInfo.unfamiliarWordRate,
          differences:(this.classContrastData[1].studyRateInfo.unfamiliarWordRate-this.classContrastData[0].studyRateInfo.unfamiliarWordRate).toFixed(2)+'%'
      },{
          name:"夹生词率",
          Aclass:this.classContrastData[0].studyRateInfo.halfFamiliarWordRate,
          Bclass:this.classContrastData[1].studyRateInfo.halfFamiliarWordRate,
          differences:(this.classContrastData[1].studyRateInfo.halfFamiliarWordRate-this.classContrastData[0].studyRateInfo.halfFamiliarWordRate).toFixed(2)+'%'
      },{
          name:"三星通过率",
          Aclass:this.classContrastData[0].studyRateInfo.threeStarsRate,
          Bclass:this.classContrastData[1].studyRateInfo.threeStarsRate,
          differences:(this.classContrastData[1].studyRateInfo.threeStarsRate-this.classContrastData[0].studyRateInfo.threeStarsRate).toFixed(2)+'%'
      },{
          name:"未通过率",
          Aclass:this.classContrastData[0].studyRateInfo.noPassRate,
          Bclass:this.classContrastData[1].studyRateInfo.noPassRate,
          differences:(this.classContrastData[1].studyRateInfo.noPassRate-this.classContrastData[0].studyRateInfo.noPassRate).toFixed(2)+'%'
      }
      ]
      })
    },
    //班级对比图表
    newCharts(){
      // 总词汇量对比
      console.log(1111)
      let contrastAll  = this.$echarts.init(document.getElementById('contrastAll'))
      contrastAll.setOption({
        legend: {},
          tooltip: {},
          dataset: {
              source: [
                  ['product', this.classA, this.classB],
                  ['已掌握的词汇量', this.classContrastData[0].studyQuantificationInfo.graspWordNum, this.classContrastData[1].studyQuantificationInfo.graspWordNum],
                  ['已学到的词汇量', this.classContrastData[0].studyQuantificationInfo.studyWordNum,this.classContrastData[1].studyQuantificationInfo.studyWordNum],
              ]
          },
          xAxis: {type: 'category'},
          yAxis: {},
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
              {type: 'bar'},
              {type: 'bar'}
          ]
      },true);
      // 题型得分率变化
      let scoringAverage  = this.$echarts.init(document.getElementById('scoringAverage'))
      // 绘制图表
      // let datas = ['qwertyu', '实际开销（Actual Spending）'];
      scoringAverage.setOption({
          title: {
                  text: '各题型得分率变化',
                  left: 'center',
              },
              tooltip: {},
              
              legend: {
                  data: [this.classA, this.classB],
                  top:25
              },
              radar: {
                  // shape: 'circle',
                  name: {
                      textStyle: {
                          color: '#fff',
                          backgroundColor: '#999',
                          borderRadius: 3,
                          padding: [3, 5]
                     }
                  },
                  indicator: [
                     { name: '看英选义', max: 100},
                     { name: '听音辨音', max: 100},
                     { name: '看义拼词', max: 100},
                     { name: '看义选英', max: 100},
                     { name: '综合得分', max: 100}
                  ]
              },
              
              series: [{
                  name: '',
                  type: 'radar',
                  // areaStyle: {normal: {}},
                  data : [
                      {
                          value : [this.classContrastData[0].studyRateInfo.englishToChineseRate, this.classContrastData[0].studyRateInfo.listenToEnglishRate, this.classContrastData[0].studyRateInfo.chineseToChoiceRate, this.classContrastData[0].studyRateInfo.chineseToChoiceRate, this.classContrastData[0].studyRateInfo.chineseToEnglishRate, this.classContrastData[0].studyRateInfo.synthesizeScoreRate],
                          name : this.classA
                      },
                       {
                          value : [this.classContrastData[1].studyRateInfo.englishToChineseRate, this.classContrastData[1].studyRateInfo.listenToEnglishRate, this.classContrastData[1].studyRateInfo.chineseToChoiceRate, this.classContrastData[1].studyRateInfo.chineseToChoiceRate, this.classContrastData[1].studyRateInfo.chineseToEnglishRate, this.classContrastData[1].studyRateInfo.synthesizeScoreRate],
                          name : this.classB
                      }
                  ]
              }]
      },true);
      // 总词汇量对比
      let contrastChange  = this.$echarts.init(document.getElementById('contrastChange'))
      contrastChange.setOption({
        legend: {},
          tooltip: {},
          dataset: {
              source: [
                  ['product', this.classA, this.classB],
                  ['熟词', this.classContrastData[0].studyRateInfo.englishToChineseRate, this.classContrastData[1].studyRateInfo.englishToChineseRate],
                  ['生词', this.classContrastData[0].studyRateInfo.unfamiliarWordRate, this.classContrastData[1].studyRateInfo.unfamiliarWordRate],
                  ['夹生词', this.classContrastData[0].studyRateInfo.halfFamiliarWordRate, this.classContrastData[1].studyRateInfo.halfFamiliarWordRate]
              ]
          },
          xAxis: {type: 'category'},
          yAxis: {
            axisLabel: {
                formatter: '{value} %'
            }
          },
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
              {type: 'bar'},
              {type: 'bar'}
          ]
      },true);
      // 总词汇量对比
      let contrastStars  = this.$echarts.init(document.getElementById('contrastStars'))
      contrastStars.setOption({
        legend: {},
          tooltip: {},
          dataset: {
              source: [
                  ['product', this.classA, this.classB],
                  ['三星通过率 ', this.classContrastData[0].studyRateInfo.threeStarsRate, this.classContrastData[1].studyRateInfo.threeStarsRate],
                  ['未通过率', this.classContrastData[0].studyRateInfo.noPassRate,this.classContrastData[1].studyRateInfo.noPassRate]
              ]
          },
          xAxis: {type: 'category'},
          yAxis: {},
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
              {type: 'bar'},
              {type: 'bar'}
          ]
      },true);
    },
    //个人对比图表
    newCharts1(){
      // 总词汇量对比
      let contrastAll1  = this.$echarts.init(document.getElementById('contrastAll1'))
      contrastAll1.setOption({
        legend: {},
          tooltip: {},
          dataset: {
              source: [
                  ['product', this.classA1, this.classB1],
                  ['已掌握的词汇量', this.classContrastData1[0].studyQuantificationInfo.graspWordNum, this.classContrastData1[1].studyQuantificationInfo.graspWordNum],
                  ['已学到的词汇量', this.classContrastData1[0].studyQuantificationInfo.studyWordNum,this.classContrastData1[1].studyQuantificationInfo.studyWordNum],
              ]
          },
          xAxis: {type: 'category'},
          yAxis: {},
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
              {type: 'bar'},
              {type: 'bar'}
          ]
      },true);
      // 题型得分率变化
      let scoringAverage1  = this.$echarts.init(document.getElementById('scoringAverage1'))
      // 绘制图表
      // let datas = ['qwertyu', '实际开销（Actual Spending）'];
      scoringAverage1.setOption({
          title: {
                  text: '各题型得分率变化',
                  left: 'center',
              },
              tooltip: {},
              
              legend: {
                  data: [this.classA1, this.classB1],
                  top:25
              },
              radar: {
                  // shape: 'circle',
                  name: {
                      textStyle: {
                          color: '#fff',
                          backgroundColor: '#999',
                          borderRadius: 3,
                          padding: [3, 5]
                     }
                  },
                  indicator: [
                     { name: '看英选义', max: 100},
                     { name: '听音辨音', max: 100},
                     { name: '看义拼词', max: 100},
                     { name: '看义选英', max: 100},
                     { name: '综合得分', max: 100}
                  ]
              },
              
              series: [{
                  name: '',
                  type: 'radar',
                  // areaStyle: {normal: {}},
                  data : [
                      {
                          value : [this.classContrastData1[0].studyRateInfo.englishToChineseRate, this.classContrastData1[0].studyRateInfo.listenToEnglishRate, this.classContrastData1[0].studyRateInfo.chineseToChoiceRate, this.classContrastData[0].studyRateInfo.chineseToChoiceRate, this.classContrastData[0].studyRateInfo.chineseToEnglishRate, this.classContrastData[0].studyRateInfo.synthesizeScoreRate],
                          name : this.classA1
                      },
                       {
                          value : [this.classContrastData1[1].studyRateInfo.englishToChineseRate, this.classContrastData1[1].studyRateInfo.listenToEnglishRate, this.classContrastData1[1].studyRateInfo.chineseToChoiceRate, this.classContrastData[1].studyRateInfo.chineseToChoiceRate, this.classContrastData[1].studyRateInfo.chineseToEnglishRate, this.classContrastData[1].studyRateInfo.synthesizeScoreRate],
                          name : this.classB1
                      }
                  ]
              }]
      },true);
      // 总词汇量对比
      let contrastChange1  = this.$echarts.init(document.getElementById('contrastChange1'))
      contrastChange1.setOption({
        legend: {},
          tooltip: {},
          dataset: {
              source: [
                  ['product', this.classA1, this.classB1],
                  ['熟词', this.classContrastData1[0].studyRateInfo.englishToChineseRate, this.classContrastData1[1].studyRateInfo.englishToChineseRate],
                  ['生词', this.classContrastData1[0].studyRateInfo.unfamiliarWordRate, this.classContrastData1[1].studyRateInfo.unfamiliarWordRate],
                  ['夹生词', this.classContrastData1[0].studyRateInfo.halfFamiliarWordRate, this.classContrastData1[1].studyRateInfo.halfFamiliarWordRate]
              ]
          },
          xAxis: {type: 'category'},
          yAxis: {
            axisLabel: {
                formatter: '{value} %'
            }
          },
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
              {type: 'bar'},
              {type: 'bar'}
          ]
      },true);
      // 总词汇量对比
      let contrastStars1  = this.$echarts.init(document.getElementById('contrastStars1'))
      contrastStars1.setOption({
        legend: {},
          tooltip: {},
          dataset: {
              source: [
                  ['product', this.classA1, this.classB1],
                  ['三星通过率 ', this.classContrastData1[0].studyRateInfo.threeStarsRate, this.classContrastData1[1].studyRateInfo.threeStarsRate],
                  ['未通过率', this.classContrastData1[0].studyRateInfo.noPassRate,this.classContrastData1[1].studyRateInfo.noPassRate]
              ]
          },
          xAxis: {type: 'category'},
          yAxis: {},
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
              {type: 'bar'},
              {type: 'bar'}
          ]
      },true);
    },
  }

}
</script>
<style lang="less" scope>
.contrast{
  .topTab{
      padding:0;
      overflow:hidden;
      width:600px;
      margin:30px auto 0;
      line-height:80px;
      text-align: center;
      height: 80px;
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
  .contrastLeft{
    width:40%;
    float:left;
    padding-left: 5%;
    .el-form{
      overflow:hidden;
      .el-form-item{
        float:left;
        display: inline-block;
        width: 50%;
        .el-select,.el-date-editor{
          width:80%;
        }
      }
    }
    .el-table{
      margin-top:30px;
    }
  }
  .contrastRight{
    float:left;
    width:55%;

  }
  
}
</style>
