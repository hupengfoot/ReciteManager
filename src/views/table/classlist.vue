<template>
  <div class="classContent">
    <el-input placeholder="请输入班级名称或关键字进行查询" v-model="pattern" style="width: 400px;" class="filter-item" @keyup.enter.native="getAllClassByTeacherId"/>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getAllClassByTeacherId">{{ 'search' }}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addClass">{{ '创建班级' }}</el-button>
    <h3>班级列表<small></small><el-checkbox type="checkbox" v-model="isAllClass" class="fr">显示全部班级</el-checkbox></h3>
    <div class="classList">
      <div class="classDeatils" v-for="(item,index) in classList" :key="index">
          <p class="serialNumber">编号：{{item.id}}</p>
          <h5 class="grade">{{item.className}}</h5>
          <p class="peopleNum">{{item.stuNum}}人</p>
          <router-link :to="{path:'/student',query:{classId:item.id}}"><el-button class="joinClass">进入班级</el-button></router-link>
          <div class="createTime">创建时间：{{item.startDate}}</div>
      </div>
    </div>
    <class-dialog v-if="isDialog" @close="isDialog=false" @create="createClass"></class-dialog>

  </div>
</template>

<script>
import { getList,getAllClass,createClass,getAllClassByTeacherId } from '@/api/table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import {successShow,errorShow} from '@/utils/notice.js'
import classDialog from '@/components/dialog/classDialog'
import store from '@/store'


// const roleTypeOptions = [
//   {key: '1', display_name: '小学'},
//   {key: '2', display_name: '初中'},
//   {key: '3', display_name: '高中'},
// ]
export default {
  name: 'ComplexTable',
  components: { Pagination,classDialog },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      total:100,
      list: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
				isAll:'1',
				pattern:'',
      },
      textMap: {
        update: '编辑班级',
        create: '创建班级'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        className: [{ required: true, message: '请输入班级', trigger: 'change' }],
        courseIdList: [{ required: true, message: '请选择课程', trigger: 'change' }],
        teacherInfo: [{ required: true, message: '请选择老师', trigger: 'change' }],
        startDate: [{ required: true, message: '请选择开课时间', trigger: 'change' }],
      },
      
      temp: {
        className: '',
        courseIdList: [],
        teacherInfo:'',
        // phase: '',
        startDate:'',
        userTeacherId: 0,
        admissionTest:false,//入学测试
        completionTest:false,//结业测试
        isAdmissionTest:false,
        isComletionTest:false,
        teacherName:'',//老师姓名
      },
      allClass:[],
      classList:[],
      isAllClass:false,
      pattern:null,

      // roleTypeOptions,
			isDialog:false,
    }
  },
  created() {
    this.getAllClassByTeacherId()
  },
  watch:{
    isAllClass(new_,old){
      this.getAllClassByTeacherId()
    }
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
    randomNum(minNum,maxNum){ 
      switch(arguments.length){ 
        case 1: 
          return parseInt(Math.random()*minNum+1,10); 
          break; 
        case 2: 
          return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
          break; 
        default: 
          return 0; 
          break; 
      } 
    },
    
    searchTeacher(){
      alert('xxx');
    },
    
		addClass(){
			this.isDialog = true;
		},
    createClass(data){
      createClass(data).then(res => {
          successShow('创建成功')
          this.getAllClassByTeacherId();
          this.isDialog = false;
      })
		},
  }
}
</script>
<style lang="less" scope>
.classContent{
  padding:20px 20px 0;
  font-size:14px;
  h3{
    font-size:18px;
    .el-checkbox{
      font-size:15px;
    }
    border-bottom:2px solid #f1eaea;
    padding-bottom:10px;
    line-height:40px;
  }
  .classList{
    .classDeatils{
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
  }
}
</style>