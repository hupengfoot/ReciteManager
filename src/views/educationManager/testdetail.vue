<template>
  <div class="testdetail">
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="createTest">{{ '导入试题' }}</el-button>
    <router-link :to="{name:'wordlist',query:{classId:classId, paperId:paperId}}" :classId="classId" :paperId="paperId"><el-button class="filter-item" type="primary" icon="el-icon-search">词库</el-button></router-link>
    
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
    
    <el-dialog title="创建问卷" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="单词数">
          <el-input v-model="wordNum"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="randomPaper">{{ '确定' }}</el-button>
      </div>
    </el-dialog>

    <pagination v-show="pageInfo.totalNum>0" :total="pageInfo.totalNum" :page.sync="pageInfo.page" :limit.sync="pageInfo.limit" @pagination="getPaperProgressRate" />
  </div>
</template>

<script>
import {getPaperProgressRate, randomPaper } from '@/api/table'
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
      dialogFormVisible: false,
      wordNum: 0,
      pageInfo:{
          totalNum: 0,
          page: 1,
          limit: 20,
      }
    }
  },
  created() { 
    this.classId = Number(this.$route.query.classId);
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
    },
    randomPaper(){
      randomPaper(this.paperId, {
        paperId: this.paperId,
        classId: this.classId,
        wordNum: Number(this.wordNum),
      }).then(res => {
        if(res.data.code === 0){
          this.$notify({
            title: '成功',
            message: '导入试题成功',
            type: 'success',
            duration: 2000
          });
          this.dialogFormVisible = false;
        }else{
          this.$notify({
            title: '导入试题失败',
            message: res.data.msg,
            type: 'failed',
            duration: 2000
          })
          this.dialogFormVisible = false;
        }
      })
    },
    createTest(){
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate 
      });
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
