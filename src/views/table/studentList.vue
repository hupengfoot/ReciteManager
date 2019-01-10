<template>
  <div class="app-container studentContent">
    <el-input placeholder="请输入学生名称或关键字进行查询" v-model="pattern" style="width: 400px;" class="filter-item" @keyup.enter.native="getStuAndGroupInClass"/>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getStuAndGroupInClass">{{ '查找' }}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addStudent">{{ '新增学生' }}</el-button>
    <h3>学生列表（{{pageInfo.totalNum}}人）
      <small class="fr">
        <el-button class="batchDownload">批量导入学生<input type="file" @change="sudentImport($event)"  /></el-button>
        
        <a :href="downloadUrl"><el-button>下载导入模板</el-button></a>
        <a :href="downloadStuUrl" target="_blank"><el-button>导出学生列表</el-button></a>
        <el-button @click="isClasssDialog=true">班级设置</el-button>
      </small>
    </h3>
    <el-table
      v-loading="listLoading"
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
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
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
      <el-table-column label="分组" align="center" prop="group"></el-table-column>
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
      <el-table-column align="center" prop="created_at" label="进度">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="开始时间" >
        <template slot-scope="scope">
         {{ roleMock[scope.row.roleId - 1] }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="学习进程">
        <template slot-scope="scope">
         {{ roleMock[scope.row.roleId - 1] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editStu(scope.row.stuId,scope.row.userId)">{{ '编辑' }}</el-button>
          <el-button type="primary" size="mini" @click="resetPassword(scope.row.stuId)">{{ '重置密码' }}</el-button>
          <el-button size="mini" type="danger" @click="deleteStu(scope.row.stuId)">{{ '删除' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pageInfo.totalNum>0" :total="pageInfo.totalNum" :page.sync="pageInfo.page" :limit.sync="pageInfo.limit" @pagination="getStuAndGroupInClass" />
    <stu-dialog :isUpdate = "isUpdate" :userId="userId" :editId="editId" v-if="isDialog" @close="isDialog=false" @create="createStu" @update="updateStu"></stu-dialog>
    <class-dialog :isUpdate = "true" v-if="isClasssDialog" @close="isDialog=false" @updateClass="updateClass"></class-dialog>
  </div>
</template>

<script>
import { getStuAndGroupInClass,createStu,deleteStu,updateStu,updateClass,resetPassword,exportExcel,templet,sudentImport } from '@/api/table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import {successShow,errorShow,deleteShow} from '@/utils/notice.js'
import stuDialog from '@/components/dialog/stuDialog'
import classDialog from '@/components/dialog/classDialog'
import {download} from '@/utils/download.js'
import { getToken } from '@/utils/auth' // 验权

//教师编辑模态框下拉选项
const sexTypeOptions = [
  { key: 'male', display_name: '男' },
  { key: 'female', display_name: '女' },
]

const roleTypeOptions = [
  {key: 'teacher', display_name: '教师'},
  {key: 'manager', display_name: '管理员'},
]

const sexMock = [
  "男",
  "女"
]

const roleMock = [
  "教师",
  "管理员"
]

export default {
  name: 'ComplexTable',
  components: { Pagination,stuDialog,classDialog },
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
			downloadUrl:null,
			downloadStuUrl:null,
      stuList: [],
      listLoading: true,
      pageInfo: {
        page: 1,
        limit: 20,
        totalNum:0,
      },
      dialogStatus: '',
      dialogFormVisible: false,
      
      temp: {
        username: '',
        realName:'',
        gender: null,
        birthday: '',
        mobile: '',
        email: '',
        school: '',
        roleId: 0,
      },
      //性别转换[1, 2] -> [男，女]
      sexChange: {
        "1": "男",
        "2": "女"
      },
      sexTypeOptions,
      roleTypeOptions,
      sexMock,
      roleMock, 
      pattern:null,
      isUpdate:false,
      isDialog:false,
      isClasssDialog:false,
      editId:null,
      userId:null,
      bathFileName:null,
    }
  },
  created() {
    this.getStuAndGroupInClass()
		this.downloadUrl = process.env.BASE_API+'/import-template/stu_import_template.xlsx?token='+getToken()
		this.downloadStuUrl = process.env.BASE_API+'/pkStudent/exportExcel/'+this.$route.query.classId+'?token='+getToken()
	},
  watch:{
    bathFileName(new_,old){console.log(222)
      this.sudentImport()
    }
  },
  methods: {
    getStuAndGroupInClass() {//查询学生列表
      this.listLoading= true,
      getStuAndGroupInClass(this.$route.query.classId,{
        page:this.pageInfo.page,
        limit:this.pageInfo.limit,
        classId:this.$route.query.classId,
        pattern:this.pattern
      }).then(res=>{
        this.listLoading=false;
        this.stuList = res.data.stuList.records
        this.pageInfo.totalNum = res.data.stuList.total;
      })
    },
    addStudent(){
      this.isUpdate=false;
      this.isDialog = true;
    },
    updateStudentDialog(){
      this.isUpdate=true;
      this.isDialog = true;
    },
    editStu(id,userId){console.log(userId,111)
      this.isUpdate=true;
      this.isDialog = true;
      this.editId = id;
      this.userId = userId;
    },
    
    deleteStu(id){
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res=>{
        deleteStu({classId:this.$route.query.classId},id).then(res => {
              successShow('删除成功')
              this.getStuAndGroupInClass();
            
          })
      }).catch(()=>{

      })
    },
    createStu(data){
      createStu(data).then(res => {
          successShow('创建成功')
          this.getStuAndGroupInClass();
          this.isDialog = false;
      }) 
    },
    updateStu(data){
      updateStu(data).then(res => {
          successShow('修改成功')
          this.getStuAndGroupInClass();
          this.isDialog = false;
      })
    },
    updateClass(data){
      updateClass(data).then(res => {
          successShow('修改成功')
          this.isClasssDialog = false;
      })
    },
    resetPassword(id){//重置密码
      
      this.$confirm('是否确定重置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res=>{
        resetPassword(id).then(res => {
          successShow('重置成功')
        })
      }).catch(()=>{

      })
    },
    exportExcel(){//导出学生信息excel
      exportExcel(this.$route.query.classId).then(res => {
        
				download(res.data,res['headers']['content-disposition'].split('filename=')[1])
      })
    },
    downloadtemplet(){//导出模板
      templet().then(res => {
        download(res.data,"stu_import_template.xlsx")
      })
    },
    sudentImport($event){//批量上传
    console.log($event.target.files[0]);
      let formData = new FormData();
      formData.append('file',$event.target.files[0]);
      sudentImport(this.$route.query.classId,formData).then(res => {
        if(res.data.code === 0) {
          successShow(res.data.msg)
        }
        this.getStuAndGroupInClass()
      })
    }
  }
}
</script>

<style lang="less" scope>
.studentContent{
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
  .batchDownload{
    position:relative;
    z-index: 1;
      input{
        position:absolute;
        width:100%;
        height:100%;
        left:0;
        top:0;
        z-index: 2;
        opacity:0;
      }
    
   
  }
}
</style>
