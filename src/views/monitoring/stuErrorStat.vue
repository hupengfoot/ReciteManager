<template>
  <div class="stuErrorStat">
    <p class="small">*数据每十秒更新一次</p>
    <p class="title"><span>屏4：班级错题本</span></p>
    <el-table :data="stuErrorData" stripe>
      <el-table-column
        width="80"
        label="序号">
        <template slot-scope="scope">
          {{(stuInfoPage.page-1)*stuInfoPage.limit+scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        property="content"
        label="单词">
      </el-table-column>
      <el-table-column
        property="errNum"
        label="出错次数">
      </el-table-column>
      <el-table-column
        property="errStuNum"
        label="出错人数">
      </el-table-column>
      <el-table-column
        property="questionType"
        label="出错题型">
        <template slot-scope="scope">
          <span v-if="scope.row.questionType == '看义选英'" class="green"> {{scope.row.questionType}} </span>
          <span v-if="scope.row.questionType == '听音辨英'" class="blue"> {{scope.row.questionType}} </span>
          <span v-if="scope.row.questionType == '看义拼词'" class="orange"> {{scope.row.questionType}} </span>
          <span v-if="scope.row.questionType == '看英选义'" class="purple"> {{scope.row.questionType}} </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="stuInfoPage.total>0" :total="stuInfoPage.total" :page.sync="stuInfoPage.page" :limit.sync="stuInfoPage.limit" @pagination="stuErrorStat" />
  </div>
  
</template>

<script>
import { stuErrorStat } from '@/api/table'
import Pagination from '@/components/Pagination'


export default {
  name: 'stuErrorStat',
  components: { Pagination },
  data() {
    return {
      stuErrorData:[],
      stuInfoPage:{
        page:1,
        limit:10,
        total:0
      }
    }
  },
  created() {
    this.stuErrorStat()
  },
  mounted(){
      clearInterval(this.setTimer())
  },
  distroyed: function () {
　　clearInterval(this.setTimer())
  },
  
  methods: {
    setTimer: function () {
　　　　this.timer = setInterval(() => {
　　　　　　this.stuErrorStat()　
          
　　　　}, 10000)
　},
    stuErrorStat(){
      stuErrorStat({classId:this.$route.query.classId,page:this.stuInfoPage.page,limit:this.stuInfoPage.limit}).then(res=>{
          this.stuErrorData=res.data.result.records;
          this.stuInfoPage.total=res.data.result.total
      })
    }
  }
}
</script>
<style lang="less" scope>
.stuErrorStat{
  padding:0 20px;
  .small{
        text-align: right;
        font-size: 12px;
        margin-right: 20px;
        color: red;
    }
  .title{
    margin:10px auto;
    span{
      background:#309BFF;
      padding:5px 20px;
      color:#fff;
      border-radius:18px;
    }
  }
  padding-top:20px;
  /deep/ .el-table{
    margin:0px auto; 
    // width:561px;
    .el-table__header{
      .has-gutter{
        th{
          background-color:#eee;
        }
      }
      
    }
    span{
      color:#fff;
      padding:5px 8px;
      border-radius: 18px;
    }
    .green{
      background:#3BDE79;
    }
    .purple{
      background:#C654FF;
    }
    .orange{
      background:#FFC941;
    }
    .blue{
      background:#3B71DE;
    }
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td{
    background:#E1F4FF;
  }
  
  
}
</style>