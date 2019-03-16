<template>
  <div class="stuAdvanceRank">
    <p>屏3：学员进步排名</p>
    <div class="topChart">
        <div class="fl">
          <div class="rankBackground" v-if="stuAdvanceRankData.length>0">
            <span v-text="stuAdvanceRankData[1].real_name"></span>
            <span v-text="stuAdvanceRankData[0].real_name"></span>
            <span v-text="stuAdvanceRankData[2].real_name"></span>
          </div>
        </div>
    </div>
    <div class="bottomChart">
        <el-table boder :data="stuAdvanceRankData">
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
              property="lastNum"
              label="最后一次检测分数">
            </el-table-column>
            <el-table-column
              property="advance"
              label="比上一次进步排名">
            </el-table-column>
            
        </el-table>
        <pagination v-show="stuInfoPage.total>0" :total="stuInfoPage.total" :page.sync="stuInfoPage.page" :limit.sync="stuInfoPage.limit" @pagination="stuAdvanceRank" />
    </div>
  </div>
</template>

<script>
import { stuAdvanceRank} from '@/api/table'
import Pagination from '@/components/Pagination' 


export default {
  name: 'finishStat',
  components: { Pagination },
  data() {
    return {
      stuAdvanceRankData:[],
      stuInfoPage:{
        page:1,
        limit:10,
        total:0
      }
    }
  },
  created() {
    this.stuAdvanceRank()
  },
  methods: {
    stuAdvanceRank(){
      stuAdvanceRank({classId:this.$route.query.classId,page:this.stuInfoPage.page,limit:this.stuInfoPage.limit}).then(res=>{
          this.stuAdvanceRankData=res.data.result.records;
          this.stuInfoPage.total=res.data.result.total
      })
    },
  }
}
</script>
<style lang="less" scope>
.stuAdvanceRank{
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
      background:url(../../assets/timg.png);
      background-size:100%;
      span{
        font-size:32px;
        display:inline-block;
        width:33%;
        text-align:center;
        float:left;
        color:#666;
        padding-top:120px;
        text-align:right;
        &:nth-child(2){
          padding-top:80px;
          text-align:center;
        }
        &:nth-child(3){
          padding-top:135px;
          text-align:left;
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