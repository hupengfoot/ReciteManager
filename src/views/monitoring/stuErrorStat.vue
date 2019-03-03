<template>
  <div class="stuErrorStat">
    <p>屏4：班级错题本</p>
    <el-table :data="stuErrorData" border>
      <el-table-column
        width="80"
        label="序号">
        <template slot-scope="scope">
          {{(stuInfoPage.page-1)*stuInfoPage.limit+scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        property="content"
        label="单词"
        width="120">
      </el-table-column>
      <el-table-column
        property="errNum"
        label="出错次数"
        width="120">
      </el-table-column>
      <el-table-column
        property="errStuNum"
        label="出错人数"
        width="120">
      </el-table-column>
      <el-table-column
        property="questionType"
        label="出错题型"
        width="120">
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
  methods: {
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
  >p{
    width:560px;
    margin:10px auto;
  }
  padding-top:20px;
  /deep/ .el-table{
    margin:0px auto; 
    width:561px;
    // .el-table__body{
    //   tr:nth-child(1){
    //     .cell{
    //       color:red;
    //       font-size:18px;
    //     }
    //   }
    //   tr:nth-child(2){
    //     .cell{
    //       color:#e22121;
    //       font-size:18px;
    //     }
    //   }
    //   tr:nth-child(3){
    //     .cell{
    //       color:#c33c3c;
    //       font-size:18px;
    //     }
    //   }
    // }
    
  }
  
}
</style>