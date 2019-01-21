<template>
  <div class="classmatelist">
    <teaching-tab :classId="classId" ></teaching-tab>
    <div class="classmateMain">
     <el-table
      :data="stuList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      >
      <el-table-column align="center" label="" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="在线状态" align="center">
        <template slot-scope="scope">
            <img src="@/assets/online.jpeg" height="20" width="20" > 
        </template> 
      </el-table-column>
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.stuId }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.gender | gender}}</span>
        </template>
      </el-table-column>
      <el-table-column label="生日" align="center">
        <template slot-scope="scope">
          {{ scope.row.birthday }}
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" prop="mobile"></el-table-column>
      <el-table-column label="email" align="center" prop="email"></el-table-column>
      <el-table-column label="学校" align="center" prop="school"></el-table-column>
      <el-table-column label="分组" align="center" prop="group">
        <template slot-scope="scope">
           {{ scope.row.groupName }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="金币支出" align="center">
        <template slot-scope="scope">
           {{ scope.row.expenses }}
        </template>
      </el-table-column>
      <el-table-column align="center"  label="金币余额" >
        <template slot-scope="scope">
          {{ scope.row.goldCoin }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="开始时间" >
        <template slot-scope="scope">
         {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="学习进程">
        <template slot-scope="scope">
         {{ }}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pageInfo.totalNum>0" :total="pageInfo.totalNum" :page.sync="pageInfo.page" :limit.sync="pageInfo.limit" @pagination="getStuAndGroupInClass" />
    </div>
  </div>
</template>

<script>
import {getStuAndGroupInClass } from '@/api/table'
import Pagination from '@/components/Pagination'
import teachingTab from '@/components/teaching/teachingTab'
export default {
  name: 'classmatelist',
  components: { teachingTab,Pagination },
  data(){
    return{
      stuList: [],
      pageInfo: {
        page: 1,
        limit: 20,
        totalNum:0,
      },
      classId: 0,
    }
  },
  created() { 
    this.classId = Number(this.$route.query.classId);
    this.getStuAndGroupInClass()
  },
  methods:{
    getStuAndGroupInClass(){//查询学生列表
      getStuAndGroupInClass(this.classId,{
        page:this.pageInfo.page,
        limit:this.pageInfo.limit,
        classId:this.classId,
        pattern:""
      }).then(res=>{
        this.stuList = res.data.stuList.records
        this.pageInfo.totalNum = res.data.stuList.total;
      })
    }
  }
}
</script>

<style lang="less" scoped>
.classmatelist {
  padding:20px;
  .searchForm{
    height:50px;
    line-height:50px;
    .el-input{
      width:220px;
      margin-left:20px;

    }
  }
  .classmateMain{
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
