<template>
  <div class="testmanager">
    <el-input placeholder="请输入测试名称或关键字进行查询" v-model="pattern" style="width: 400px;" class="filter-item" @keyup.enter.native=""/>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="">{{ '查找' }}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="">{{ '创建测试' }}</el-button>
    <teaching-tab :classId="classId" ></teaching-tab>
    <div class="testmanagerMain">
      <div class="testDetails" v-for="(item,index) in testList" :key="index">
        <p class="serialNumber">编号：{{item.id}}</p>
        <h5 class="grade">{{item.groupItemName}}</h5>
        <p class="peopleNum">{{item.stuNum}}人</p>
        <router-link :to="{name:'groupmembermanager',query:{classId:item.classId, groupItemId:item.id}}"><el-button class="joinClass">试卷详情</el-button></router-link>
        <div class="createTime">创建时间：{{ new Date(item.createTime).toLocaleDateString() }}</div>
      </div>
    </div>

    <el-dialog title="新增组员" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="ID">
          <el-input/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="">{{ '确定' }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {getStuInfoInGroup, rewardGold } from '@/api/table'
import teachingTab from '@/components/teaching/teachingTab'
export default {
  name: 'testmanager',
  components: { teachingTab },
  data(){
    return{
      classId: 0,
      testList: [],
      dialogFormVisible: false,
    }
  },
  created() { 
    this.classId = Number(this.$route.query.classId);
    this.pattern = "";
    this.dialogFormVisible = false;
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
.testmanager {
  padding:20px;
  .searchForm{
    height:50px;
    line-height:50px;
    .el-input{
      width:220px;
      margin-left:20px;

    }
  }
  .testmanagerMain{
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

  .testDetails{
    height:254px;
    width:240px;
    background:rgba(48,155,255,1); 
    border-radius:10px;
    color:#fff;
    text-align:center;
    float:left;
    margin:20px 15px;
    .serialNumber{
      display:inline-block;
      width:140px;
      color:gray;
      background:#fff;
      border-bottom-left-radius:10px;
      border-bottom-right-radius:10px;
      height:30px;
      line-height:30px;
      margin-top:0px;
    }
    .grade{
      font-size:32px;
      margin:20px 0 10px;
    }
    .peopleNum{
      font-size:24px;
      line-height:30px;
      height:30px;
    }
    .joinClass{
      width:100px;
      height:40px;
      // line-height:40px;
      padding:0;
    }
    .createTime{
      margin-top:10px;
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
