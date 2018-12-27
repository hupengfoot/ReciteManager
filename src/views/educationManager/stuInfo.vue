<template>
  <div class="stuInfo">
    <div class="dashboard" v-show="type=='dashboard'">
      <h3>{{stuInfo.realName}}单词学习仪表盘</h3>
      <!-- <pie-chart id="test" height="400px" width="400px" :option="unitPassNum"></pie-chart> -->
      <div class="dashboardMain">
        <div id="unitPassNum" :style="{width: '300px', height: '300px'}"></div> 
        <div id="wordNum" :style="{width: '300px', height: '300px'}"></div>
      </div>
      
    </div>
    <div class="stuTypeTab">
      <ul>
        <li @click="type='dashboard'"  :class="{'default':type=='dashboard'}">分析仪表盘</li>
        <li @click="type='growth'"  :class="{'default':type=='growth'}">成长记录</li>
        <li @click="type='score'"  :class="{'default':type=='score'}">得分率分析</li>
        <li @click="type='details'"  :class="{'default':type=='details'}">学习详情</li>
        <li @click="type='wordNum'"  :class="{'default':type=='wordNum'}">词汇量测试</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {getClassUnitNum,getStuInfoByStuId,getStuUnitPassNum } from '@/api/table'
import Pagination from '@/components/Pagination'
import pieChart from "@/components/echarts/dashboard";
export default {
  name: 'stuInfo',
  components: { Pagination,pieChart },
  data(){
    return{
      stuInfo:{},
      type:'dashboard',
      unitPassNum:[],
    }
  },
  mounted(){
    this.getStuInfoByStuId()
    this.getClassUnitNum()
    
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
         this.unitPassNum.push({value:50,name:'已掌握'});
         this.unitPassNum.push({value:countNum-50,name:'未掌握'});
         this.drawLine()  
      })
    },
    getStuInfoByStuId(){//学生信息
      getStuInfoByStuId(this.$route.query.stuId).then(res=>{
        this.stuInfo = res.data.stuInfo;
      })
    },
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('unitPassNum'))
        // 绘制图表
        myChart.setOption({
             series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['50%', '70%'],
                    
                    data:this.unitPassNum
                }
            ]
        });
        let wordNum = this.$echarts.init(document.getElementById('wordNum'))
        // 绘制图表
        wordNum.setOption({
             series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['50%', '70%'],
                    
                    data:this.unitPassNum
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
  h3{
    text-align:center;
    line-height:50px;
    font-size:24px;
  }
  .dashboardMain{
    width:800px;
    margin:0 auto;
    > div{
      float:left;
    }
  }
  .stuTypeTab{
    position:fixed;
    bottom:0;
    width:calc( 100%  - 180px);
    height:80px;
    line-height:80px;
    text-align:center;
    ul{
      padding:0;
      overflow:hidden;
      width:600px;
      margin:0 auto;
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
