<template>
  <div class="diagnosisInfo">
    <div class="diagnosisTab">
      <ul>
        <li @click="type='classcompare'"  :class="{'default':type=='classcompare'}">词汇量比较</li>
        <li @click="type='classquesrate'"  :class="{'default':type=='classquesrate'}">班级得分率比较</li>
      </ul>
    </div>
    <div>
      <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img src="" class="user-avatar">
        <span class="name">{{$store.getters.name}}</span>
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <el-dropdown-item divided>
          <el-checkbox/>
          <span style="display:block;" @click="">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <el-checkbox/>
          <span style="display:block;" @click="">退出登录</span>
        </el-dropdown-item>
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
import { } from '@/api/table'
import LineChart from '@/components/echarts/LineChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
    hahaData: [180, 160, 151, 106, 145, 150, 130]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'diagnosisInfo',
  components: { LineChart },
  data(){
    return{
        type:'classcompare',
        lineChartData: lineChartData.newVisitis
    }
  },
  mounted(){
    
  },
  methods:{
    
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
