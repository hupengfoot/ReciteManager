<template>
  <div class="groupRank">
    <p class="title"><span>屏2：小组排名</span></p>
    <div class="topChart">
        <div>
          <!-- <div class="rankBackground" v-if="stuAdvanceRankData.length>0">
            <span v-if="stuAdvanceRankData.length>1" v-text="stuAdvanceRankData[1].group_item_name"></span>
            <span v-if="stuAdvanceRankData.length>0" v-text="stuAdvanceRankData[0].group_item_name"></span>
            <span v-if="stuAdvanceRankData.length>2" v-text="stuAdvanceRankData[2].group_item_name"></span>
          </div> -->
          <ul v-if="stuAdvanceRankData.length>0">
            <li>
              <div class="list" v-if="stuAdvanceRankData.length>1">
                <h5>{{stuAdvanceRankData[0].group_item_name}}</h5>
                <div>
                  <p>总词汇量</p>
                  <p>{{stuAdvanceRankData[2].allFinishNum}}</p>
                </div>
                <div>
                  <p>平均词汇量</p>
                  <p>{{stuAdvanceRankData[2].curFinishNum}}</p>
                </div>
              </div>
            </li>
            <li>
              <div class="list">
                <h5>{{stuAdvanceRankData[1].group_item_name}}</h5>
                <div>
                  <p>总词汇量</p>
                  <p>{{stuAdvanceRankData[2].allFinishNum}}</p>
                </div>
                <div>
                  <p>平均词汇量</p>
                  <p>{{stuAdvanceRankData[2].curFinishNum}}</p>
                </div>
              </div>
            </li>
            <li>
              <div class="list">
                <h5>{{stuAdvanceRankData[2].group_item_name}}</h5>
                <div>
                  <p>总词汇量</p>
                  <p>{{stuAdvanceRankData[2].allFinishNum}}</p>
                </div>
                <div>
                  <p>平均词汇量</p>
                  <p>{{stuAdvanceRankData[2].curFinishNum}}</p>
                </div>
              </div>
            </li>
          </ul>
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
              property="curFinishNum"
              label="总词汇量" width="100">
            </el-table-column>
            <el-table-column
              property="curAvgNum"
              label="平均词汇量" width="100">
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
          for(let i in this.stuAdvanceRankData){
            if(this.stuAdvanceRankData[i].students.length > 0){
              this.stuAdvanceRankData[i].curAvgNum = Math.floor(this.stuAdvanceRankData[i].curFinishNum / this.stuAdvanceRankData[i].students.length);
            }else{
              this.stuAdvanceRankData[i].curAvgNum = 0;
            }
          }
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
    ul{
      overflow:hidden;
      width:100%;
      min-width:1200px;
      li{
        float:left;
        width:33.33%;
        list-style: none;
        .list{
          
          background:url(../../assets/redBackground.png);
          width:377px;
          height:203px;
          h5{
            height:100px;
            line-height:76px;
            padding-top:24px;
            text-indent:20px;
            font-size:36px;
            margin:0;
            color:#fff;
          }
          div{
            width:50%;
            height:100px;
            float:left;
            padding-left:30px;
            p{
              font-size:14px;
              margin:0px;
              line-height:40px;
              color:#fff;
              &:nth-child(2){
                line-height:40px;
                font-size:28px;
              }
            }
          }
          
        }
        &:nth-child(2){
          .list{
            background:url(../../assets/blueBackground.png);
          }
        }
        &:nth-child(3){
          .list{
            background:url(../../assets/greenBackground.png);
          }
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
