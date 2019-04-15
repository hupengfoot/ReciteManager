<template>
  <div class="groupRank">
    <p class="title"><span>屏2：小组排名</span></p>
    <div class="topChart">
        <div class="fl">
          <div class="rankBackground" v-if="stuAdvanceRankData.length>0">
            <span v-if="stuAdvanceRankData.length>1" v-text="stuAdvanceRankData[1].group_item_name"></span>
            <span v-if="stuAdvanceRankData.length>0" v-text="stuAdvanceRankData[0].group_item_name"></span>
            <span v-if="stuAdvanceRankData.length>2" v-text="stuAdvanceRankData[2].group_item_name"></span>
          </div>
        </div>
    </div>
    <div class="bottomChart">
        <el-table stripe :data="stuAdvanceRankData">
            <el-table-column
              property="rank"
              width="80"
              label="排名">
            </el-table-column>
            <el-table-column
              property="group_item_name"
              width="180"
              label="小组名">
            </el-table-column>
            <el-table-column
              property="createTime"
              width="180"
              label="创建时间">
            </el-table-column>
            <el-table-column
              property="allFinishNum"
              label="总词汇量"
              width="100">
            </el-table-column>
            <el-table-column
              property="curFinishNum"
              label="平均词汇量"
              width="100">
            </el-table-column>
            <!-- <el-table-column
              property="curFinishNum"
              label="当前词汇量进度">
            </el-table-column> -->
            <el-table-column
              property="students"
              label="组员">
              <template slot-scope="scope">
                <span v-for="(list,index) in scope.row.students" :key="index"><i v-if="index!==0">,</i>{{list.realName}}({{list.curNum}})</span>
              </template>
            </el-table-column>
            
        </el-table>
        <pagination v-show="stuInfoPage.total>0" :total="stuInfoPage.total" :page.sync="stuInfoPage.page" :limit.sync="stuInfoPage.limit" @pagination="groupRank" />
    </div>
  </div>
</template>

<script>
import { groupRank} from '@/api/table'
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
    this.groupRank()
  },
  methods: {
    groupRank(){
      groupRank({classId:this.$route.query.classId,page:this.stuInfoPage.page,limit:this.stuInfoPage.limit}).then(res=>{

          for(let i=0;i<res.data.result.records.length;i++){
            //  res.data.result.records[i].students = res.data.result.records[i].students.join(",");
          }
          this.stuAdvanceRankData=res.data.result.records;
          this.stuInfoPage.total=res.data.result.total
      })
    },
  }
}
</script>
<style lang="less" scope>
.groupRank{
  padding:0 20px;
  .title{
    margin:10px auto;
    span{
      background:#309BFF;
      padding:5px 20px;
      color:#fff;
      border-radius:18px;
    }
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
        font-size:28px;
        display:inline-block;
        width:33%;
        text-align:center;
        float:left;
        color:#666;
        padding-top:125px;
        text-align:right;
        &:nth-child(2){
          padding-top:85px;
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
    .el-table__header{
      .has-gutter{
        th{
          background-color:#eee;
        }
      }
    }
    .el-table__body tr.el-table__row--striped td{
      background:#E1F4FF;
    }
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