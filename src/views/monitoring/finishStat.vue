<template>
  <div class="finishStat">
    <p>屏1：全员排名</p>
    <div class="topChart">
        <div class="fl">
          <div class="rankBackground">
            <span v-text="stuRankData[1].real_name"></span>
            <span v-text="stuRankData[0].real_name"></span>
            <span v-text="stuRankData[2].real_name"></span>
          </div>
        </div>
        <div class="fl">
          <p style="text-align:center;font-size:18px;">班级历史平均词汇量</p>
          <div id="finishStat" :style="{width: '400px', height: '300px'}"></div>
        </div>
    </div>
    <div class="bottomChart">
        <el-table boder :data="stuRankData">
            <el-table-column
              property="rank"
              width="80"
              label="排名">
            </el-table-column>
            <el-table-column
              property="real_name"
              label="姓名"
              width="120">
            </el-table-column>
            <el-table-column
              property="gender"
              label="性别"
              width="120">
            </el-table-column>
            <el-table-column
              property="allFinishNum"
              label="总词汇量"
              width="120">
            </el-table-column>
            <el-table-column
              property="curAllNum"
              label="当前课次词汇量"
              width="150">
            </el-table-column>
            <el-table-column
              property="curFinishNum"
              label="当前词汇量进度">
              <template slot-scope="scope">
                <p class="progress groupProgress"><span :style="{width:(scope.row.curFinishNum/scope.row.allFinishNum)*300+'px'}"></span></p>
              </template>
            </el-table-column>
        </el-table>
        <pagination v-show="stuInfoPage.total>0" :total="stuInfoPage.total" :page.sync="stuInfoPage.page" :limit.sync="stuInfoPage.limit" @pagination="stuRank" />
    </div>
  </div>
</template>

<script>
import { finishStat,stuRank} from '@/api/table'
import Pagination from '@/components/Pagination' 


export default {
  name: 'finishStat',
  components: { Pagination },
  data() {
    return {
      finishData:[],
      stuRankData:[],
      stuInfoPage:{
        page:1,
        limit:10,
        total:0
      }
    }
  },
  created() {
    // this.finishStat()
    this.stuRank()
  },
  methods: {
    finishStat(){
      finishStat({classId:this.$route.query.classId,page:this.stuInfoPage.page,limit:this.stuInfoPage.limit}).then(res=>{
          this.finishData=res.data.result.records;
          this.ClassExamCorrectRate();
      })
    },
    stuRank(){
      stuRank({classId:this.$route.query.classId,page:this.stuInfoPage.page,limit:this.stuInfoPage.limit}).then(res=>{
          this.stuRankData=res.data.result.records;
          this.stuInfoPage.total=res.data.result.total
          this.finishStat()
      })
    },
    ClassExamCorrectRate(){
      // console.log(this.ClassExamCorrectRateData.percentage)
      let wordNum = this.$echarts.init(document.getElementById('finishStat'))
        // 绘制图表
        wordNum.setOption({ 
            title : {
                // text: '某地区蒸发量和降水量',
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['AM','PM','日平均']
            },

            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'AM',
                    type:'bar',
                    data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],


                },
                {
                    name:'PM',
                    type:'bar',
                    data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],

                },
                {
                    name:'日平均',
                    type:'bar',
                    data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],

                }
            ]
        });
    }
  }
}
</script>
<style lang="less" scope>
.finishStat{
  >p{
    padding-left:20px;
    margin:10px auto;
  }
  .topChart{
    padding:0 20px;
    overflow:hidden;
    .rankBackground{ 
      margin-right:50px;
      height:300px;
      width:400px;
      background:url(../../assets/timg.jpg);
      background-size:100%;
      span{
        font-size:38px;
        display:inline-block;
        width:33%;
        text-align:center;
        float:left;
        color:#666;
        padding-top:95px;
        &:nth-child(2){
          padding-top:35px;
        }
        &:nth-child(3){
          padding-top:115px;
        }
      }
    }
  }
  
  padding-top:20px;
  /deep/ .el-table{
    margin:20px auto 0; 
    padding:0 20px;
    .progress{
      height:10px;
      width:300px;
      background:rgba(233, 233, 233, 1);
      border-radius:20px;
      position:relative;
      span{
        position:absolute;
        left:0;
        top:0;
        display:inline-block;
        background:#409eff;
        height:10px;
      }
    }
    
  }
  
}
</style>