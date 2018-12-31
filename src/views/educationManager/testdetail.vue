<template>
  <div class="testdetail">
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="">{{ '导入试题' }}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="">{{ '词库' }}</el-button>
    
    <el-table border :data="stuList">
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="realName"></el-table-column>
        <el-table-column label="分数">
          <template slot-scope="scope">
            {{ scope.row.score }}
          </template>
        </el-table-column>
        <el-table-column label="用时">
          <template slot-scope="scope">
            {{ scope.row.time }}
          </template>
        </el-table-column>
    </el-table>
    <pagination v-show="pageInfo.totalNum>0" :total="pageInfo.totalNum" :page.sync="pageInfo.page" :limit.sync="pageInfo.limit" @pagination="getPaperProgressRate" />
  </div>
</template>

<script>
import {getPaperProgressRate } from '@/api/table'
import teachingTab from '@/components/teaching/teachingTab'
import Pagination from '@/components/Pagination'
export default {
  name: 'testdetail',
  components: { teachingTab, Pagination },
  data(){
    return{
      classId: 0,
      paperId: 0,
      stuList: [],
      pageInfo:{
          totalNum: 0,
          page: 1,
          limit: 20,
      }
    }
  },
  created() { 
    this.paperId = Number(this.$route.query.paperId);
    this.getPaperProgressRate();
  },
  methods:{
    getPaperProgressRate(){
        getPaperProgressRate(this.paperId, {
            paperId: this.paperId,
            page: this.pageInfo.page,
            limit: this.pageInfo.limit,
            pattern: ""
        }).then(res => {
            this.stuList = res.data.detailList.records;
            this.pageInfo.totalNum = res.data.detailList.total;
        })
    }
  }
}
</script>

<style lang="less" scoped>
.testdetail {
  padding:20px;
  .searchForm{
    height:50px;
    line-height:50px;
    .el-input{
      width:220px;
      margin-left:20px;

    }
  }
  .testdetailMain{
    .mainTop{
      margin:20px 0;
      text-align:center;
      .mainTopButton{
        display:inline-block;
      
        .el-button{
          height:35px;
          padding:0;
          width:325px;
          border-radius:0;
          
          &:first-child{
            border-top-left-radius:20px;
            border-bottom-left-radius:20px;
          }
          &:nth-child(2){
            border-top-right-radius:20px;
            border-bottom-right-radius:20px;
            position:relative;
            left:-15px;
            border-left:none;
          }
          &.dafult{
            background:#409EFF;
            color:#fff;
          }
        }
        
      }
      .sort{
        margin-right:20px;
        font-size:14px;
        line-height:35px; 
        cursor:pointer;
      }
    }
  }

  .el-table{
    .progress{
      height:5px;
      width:300px;
      background:rgba(233, 233, 233, 1);
      border-radius:20px;
      position:relative;
      span{
        position:absolute;
        left:0;
        top:0;
        display:inline-block;
        background:rgb(255,210,21,1);
        height:5px;
      }
    }
    
      &:nth-child(1){
        .groupProgress{
          span{
            background:#409eff;
          }
        }
      }
      &:nth-child(2){
        .groupProgress{
          span{
            background:#67c23a;
          }
        }
      }
      // &:nth-child(3){
      //   span{
      //     background:#e6a23c;
      //   }
      // }
      // &:nth-child(4){
      //   span{
      //     background:#f56c6c;
      //   }
      // }
    

  }
}
</style>
