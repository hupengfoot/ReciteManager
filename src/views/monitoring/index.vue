<template>
  <div class="monitoring">
    <el-select v-model="classId">
      <el-option  v-for="(item,index) in classList" :key="index" :label="item.className" :value="item.id"></el-option>
    </el-select>
    <h3>班级列表</h3>
    <div class="classList">
      
    </div>
    

  </div>
</template>

<script>
import { getList,getAllClass,createClass,getAllClassByTeacherId } from '@/api/table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import {successShow,errorShow} from '@/utils/notice.js'
import classDialog from '@/components/dialog/classDialog'
import store from '@/store'


export default {
  name: 'monitoring',
  components: { Pagination,classDialog },
  
  data() {
    return {
      classList:[],
      classId:''
    }
  },
  created() {
    this.getAllClassByTeacherId();
  },
  watch:{
    
  },
  methods: {
    getAllClassByTeacherId() {//查询班级列表
      this.listLoading = true
      let isAll = this.isAllClass?1:0;
      if(store.getters.roles==1){
        getAllClassByTeacherId({isAll:isAll,pattern:this.pattern}).then(res => {
          this.classList = res.data.classList
        })
      }else{
        getAllClass({isAll:isAll,pattern:this.pattern}).then(res => {
          this.classList = res.data.classList
        })
      }
    },
  }
}
</script>
<style lang="less" scope>
.monitoring{
  padding:20px 20px 0;
  font-size:14px;
}
</style>