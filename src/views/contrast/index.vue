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
            <el-select>
              <el-option>请选择班级</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="className">
              <el-date-picker type="datetime" placeholder="请选择开课时间" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="className">
            <el-select>
              <el-option>请选择班级</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="className">
              <el-date-picker type="datetime" placeholder="请选择开课时间" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
          </el-form-item>
        </el-form>
        <el-table :data="tableData">
          <el-table-column
            prop="className"
            label=""
            width="180">
          </el-table-column>
          <el-table-column
            prop="date"
            label="学习时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="num"
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
            label="A班"
            width="180">
          </el-table-column>
          <el-table-column
            prop="Bclass"
            label="B班">
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
    <div v-if="type=='classquesrate'">

    </div>
  </div>
</template>

<script>
import {unitStudyInfo,unitWordNum,scoringAverage, getList,getAllClass,createClass,getAllClassByTeacherId,getClassGradePerDay, getClassExamCorrectRate } from '@/api/table'
import {successShow,errorShow} from '@/utils/notice.js'



export default {
  name: 'contrast',
  components: {  },

  data() {
    return {
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
      differencesData:[{
          name:"已掌握的词汇量 (平均)",
          Aclass:"3261",
          Bclass:"3861",
          differences:"50%"
      },{
          name:"已学到的词汇量 (平均)",
          Aclass:"3261",
          Bclass:"3861",
          differences:"50%"
      },{
          name:"看英选义",
          Aclass:"3261",
          Bclass:"3861",
          differences:"50%"
      }],
      scoringAverageNum:[{
                value : [4300, 10000, 28000, 35000, 50000, 19000],
                name : '预算分配（Allocated Budget）'
            },
             {
                value : [5000, 14000, 28000, 31000, 42000, 21000],
                name : '实际开销（Actual Spending）'
            }]
    }
  },
  mounted() {
  // created(){
    this.newCharts()
  },
  watch:{
    type: {
      handler: function (newVal, oldVal) {
        if(type=="classcompare"){
          this.newCharts()
        }
      },
      deep: true
    }
  },
  methods: {
    //图表
    newCharts(){
      // 总词汇量对比
      let contrastAll  = this.$echarts.init(document.getElementById('contrastAll'))
      contrastAll.setOption({
        legend: {},
          tooltip: {},
          dataset: {
              source: [
                  ['product', '2015', '2016'],
                  ['Matcha Latte', 43.3, 85.8],
                  ['Milk Tea', 83.1, 73.4],
                  ['Cheese Cocoa', 86.4, 65.2],
                  ['Walnut Brownie', 72.4, 53.9]
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
      });
      // 题型得分率变化
      let scoringAverage  = this.$echarts.init(document.getElementById('scoringAverage'))
      // 绘制图表
      scoringAverage.setOption({
          title: {
                  text: '基础雷达图'
              },
              tooltip: {},
              legend: {
                  data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
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
                     { name: '销售（sales）', max: 6500},
                     { name: '管理（Administration）', max: 16000},
                     { name: '信息技术（Information Techology）', max: 30000},
                     { name: '客服（Customer Support）', max: 38000},
                     { name: '研发（Development）', max: 52000},
                     { name: '市场（Marketing）', max: 25000}
                  ]
              },
              series: [{
                  name: '预算 vs 开销（Budget vs spending）',
                  type: 'radar',
                  // areaStyle: {normal: {}},
                  data : [
                      {
                          value : [4300, 10000, 28000, 35000, 50000, 19000],
                          name : '预算分配（Allocated Budget）'
                      },
                       {
                          value : [5000, 14000, 28000, 31000, 42000, 21000],
                          name : '实际开销（Actual Spending）'
                      }
                  ]
              }]
      });
      // 总词汇量对比
      let contrastChange  = this.$echarts.init(document.getElementById('contrastChange'))
      contrastChange.setOption({
        legend: {},
          tooltip: {},
          dataset: {
              source: [
                  ['product', '2015', '2016'],
                  ['Matcha Latte', 43.3, 85.8],
                  ['Milk Tea', 83.1, 73.4],
                  ['Cheese Cocoa', 86.4, 65.2],
                  ['Walnut Brownie', 72.4, 53.9]
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
      });
      // 总词汇量对比
      let contrastStars  = this.$echarts.init(document.getElementById('contrastStars'))
      contrastStars.setOption({
        legend: {},
          tooltip: {},
          dataset: {
              source: [
                  ['product', '2015', '2016'],
                  ['Matcha Latte', 43.3, 85.8],
                  ['Milk Tea', 83.1, 73.4],
                  ['Cheese Cocoa', 86.4, 65.2],
                  ['Walnut Brownie', 72.4, 53.9]
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
      });
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
