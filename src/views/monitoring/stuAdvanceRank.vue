<template>
  <div class="stuAdvanceRank">
    <p class="title"><span>屏3：学员进步排名</span></p>
    <div class="topChart">
        <div>
          <ul v-if="stuAdvanceRankData.length>0">
            <li>
              <div class="list" v-if="stuAdvanceRankData.length>1">
                <h5>{{stuAdvanceRankData[0].real_name}}</h5>
                <div>
                  <p>最后一次检测分数</p>
                  <p>{{stuAdvanceRankData[0].curNum}}</p>
                </div>
                <div>
                  <p>上一次进步排名</p>
                  <p>{{stuAdvanceRankData[0].advance}}</p>
                </div>
              </div>
            </li>
            <li>
              <div class="list">
                <h5>{{stuAdvanceRankData[1].real_name}}</h5>
                <div>
                  <p>最后一次检测分数</p>
                  <p>{{stuAdvanceRankData[1].curNum}}</p>
                </div>
                <div>
                  <p>上一次进步排名</p>
                  <p>{{stuAdvanceRankData[1].advance}}</p>
                </div>
              </div>
            </li>
            <li>
              <div class="list">
                <h5>{{stuAdvanceRankData[2].real_name}}</h5>
                <div>
                  <p>最后一次检测分数</p>
                  <p>{{stuAdvanceRankData[2].curNum}}</p>
                </div>
                <div>
                  <p>上一次进步排名</p>
                  <p>{{stuAdvanceRankData[2].advance}}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
    </div>
    <div class="bottomChart">
        <el-table stripe :data="stuAdvanceRankData">
            <el-table-column
              property="index"
              width="80"
              label="排名">
            </el-table-column>
            <el-table-column
              property="real_name"
              label="姓名"
              width="120">
            </el-table-column>
            <el-table-column
              property="curNum"
              label="最后一次检测分数">
            </el-table-column>
            <el-table-column
              property="rank"
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
          for(let i in this.stuAdvanceRankData){
            this.stuAdvanceRankData[i].index = Number((res.data.result.current - 1) * res.data.result.size) + Number(i) + 1;
          }
          this.stuInfoPage.total=res.data.result.total
      })
    },
  }
}
</script>
<style lang="less" scope>
.stuAdvanceRank{
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
    padding:0 20px;
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