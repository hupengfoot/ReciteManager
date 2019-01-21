<template>
  <div class="wordlist">
    
    <el-radio-group class="wordList">
      <el-radio-button v-for="(list,index) in wordList" :key="index" :label="list">{{list.questionContent}}</el-radio-button>
    </el-radio-group>   
    
  </div>
</template>

<script>
import {getQuestionList} from '@/api/table'
export default {
  name: 'wordlist',
  components: { },
  data(){
    return{
      classId: 0,
      paperId: 0,
      wordList: [],
    }
  },
  created() { 
    this.classId = Number(this.$route.query.classId);
    this.paperId = Number(this.$route.query.paperId);
    getQuestionList(this.paperId, {
        paperId: this.paperId,
        page: 1,
        limit: 10000        
    }).then(res => {
        if(res.data.code === 0){
            this.wordList = res.data.questionList.records;
        }
    });
  },
  methods:{

  }
}
</script>

<style lang="less" scoped>
.wordlist {
  padding:20px;
  .searchForm{
    height:50px;
    line-height:50px;
    .el-input{
      width:220px;
      margin-left:20px;

    }
  }
  .wordlistMain{
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
