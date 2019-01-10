<template>
  <div class="testmanager">
    <el-input placeholder="请输入测试名称或关键字进行查询" v-model="pattern" style="width: 400px;" class="filter-item" @keyup.enter.native="getPaperListByClassId"/>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getPaperListByClassId">{{ '查找' }}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addTest">{{ '创建测试' }}</el-button>
    <teaching-tab :classId="classId" ></teaching-tab>
    <div class="testmanagerMain">
      <div class="testDetails" v-for="(item,index) in testList" :key="index">
        <p class="serialNumber">{{item.questionNum === 0 ? "待导入试题" : "发布试卷"}}</p>
        <h5 class="grade">{{item.title}}</h5>
        <p class="peopleNum">词汇量:{{item.questionNum}}个  时长:{{item.limitTime}}秒</p>
        <router-link :to="{name:'testdetail',query:{classId:item.classId, paperId:item.id}}"><el-button class="joinClass">试卷详情</el-button></router-link>
        <div class="createTime">创建时间：{{ new Date(item.createTime).toLocaleDateString() }}</div>
      </div>
    </div>

    <el-dialog title="创建测试" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称">
          <el-input v-model="testname"/>
        </el-form-item>
        <el-form-item label="时间(s)">
          <el-input v-model="limitTime"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="createPaper">{{ '确定' }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {getPaperListByClassId, createPaper } from '@/api/table'
import teachingTab from '@/components/teaching/teachingTab'
export default {
  name: 'testmanager',
  components: { teachingTab },
  data(){
    return{
      classId: 0,
      testList: [],
      dialogFormVisible: false,
      pattern: "",
      testname: "",
      questionNum: "",
      limitTime: ""
    }
  },
  created() { 
    this.classId = Number(this.$route.query.classId);
    this.pattern = "";
    this.dialogFormVisible = false;
    this.getPaperListByClassId();
  },
  methods:{
    getPaperListByClassId(){
        getPaperListByClassId(this.classId, {
            classId: this.classId,
            page: 1,
            limit: 200,
            pattern: this.pattern
        }).then(res => {
            this.testList = res.data.paperList.records;
            for(var i = 0; i < this.testList.length; i++){
              this.testList[i].classId = this.classId;
            }
        })
    },
    createPaper(){
        createPaper({
            classId: this.classId,
            limitTime: this.limitTime,
            title: this.testname,
            totalScore: 100
        }).then(res => {
            if(res.data.code === 0){
              this.$notify({
                title: '成功',
                message: '添加试卷成功',
                type: 'success',
                duration: 2000
              });
              location.reload();
            }else{
              this.$notify({
                title: '添加试卷失败',
                message: res.data.msg,
                type: 'failed',
                duration: 2000
              })
            }
        })
    },
    addTest(){
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate 
        })
    }
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
