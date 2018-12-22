<template>
  <div class="app-container">
    <el-input placeholder="请输入教师名称或关键字进行查询" v-model="listQuery.username" style="width: 400px;" class="filter-item" @keyup.enter.native="fetchData"/>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">{{ 'search' }}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addTeacher">{{ '新增教师' }}</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
       <el-table-column label="用户名">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ sexChange[scope.row.gender] === undefined ? "男" :  sexChange[scope.row.gender]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="生日" align="center">
        <template slot-scope="scope">
          {{ scope.row.birthday }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="手机" width="110" align="center">
        <template slot-scope="scope">
           {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="邮箱" width="200">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="角色" width="200">
        <template slot-scope="scope">
         {{ roleMock[scope.row.roleId - 1] }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateTeacher(scope.row)">{{ '编辑' }}</el-button>
          <el-button size="mini" type="danger" @click="deletedTeacher(scope.row)">{{ '删除' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
         <el-form-item label="用户名">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="temp.realName"/>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="temp.gender" class="filter-item" placeholder="Please select">
            <el-option v-for="item in sexTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="temp.birthday" type="datetime" placeholder="Please pick a date"/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="temp.mobile"/>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="temp.email"/>
        </el-form-item>
         <el-form-item label="角色">
          <el-select v-model="temp.roleId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ 'cancel' }}</el-button>
        <el-button type="primary" @click="createUserInterface">{{ 'confirm' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, createUser, updateUserForAdmin, deleteUserFromAdmin } from '@/api/table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive

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
  components: { Pagination },
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
      total:0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        username: undefined,
        type: undefined,
      },
      textMap: {
        update: '编辑教师',
        create: '新增教师'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      temp: {
        username: '',
        realName: '',
        gender: undefined,
        birthday: '',
        mobile: '',
        email: '',
        roleId: '',
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
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
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
    fetchData() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        alert(JSON.stringify(response.data.page))
        this.total = response.data.page.total;
        this.listQuery.page = response.data.page.current;
        this.listQuery.limit = response.data.page.size;
        this.list = response.data.page.records
        this.listLoading = false
      })
    },
    resetTemp(){
      this.temp = {
        username: '',
        realName: '',
        gender: undefined,
        birthday: '',
        mobile: '',
        email: '',
        roleId: ''
      }
    },
    addTeacher(){
      this.resetTemp(),
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate        
      })
    },
    updateTeacher(row){
      this.resetTemp(),
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate        
      })
    },

    deletedTeacher(row){
      let obj = {
        userId : row.userId
      }
      deleteUserFromAdmin(obj).then((response) => {
        if(response.data.code === 0){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          //删除后重新加载页面
          location.reload()
        }else{
          this.$notify({
            title: '删除失败',
            message: response.data.msg,
            type: 'failed',
            duration: 2000
          })
        }
      })
    },
    createUserInterface() {
      if(this.dialogStatus === 'create'){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.temp.gender === 'male'){
              this.temp.gender = 1
            }
            if(this.temp.gender === 'female'){
              this.temp.gender = 2
            }
            if(this.temp.roleId === "teacher"){
              this.temp.roleId = 1;
            }
            if(this.temp.roleId === "manager"){
              this.temp.roleId = 2;
            }
            this.temp.password = "000000"
            var tempDate = new Date(this.temp.birthday)
            this.temp.birthday = tempDate.getFullYear()+ '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate() + " 00:00:00"
            createUser(this.temp).then((response) => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              if(response.data.code === 0){
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              }else{
                this.$notify({
                  title: '创建失败',
                  message: response.data.msg,
                  type: 'failed',
                  duration: 2000
                })
              }
            })
          }
        })
      }

      if(this.dialogStatus === 'update'){
        this.temp.birthday = this.temp.birthday + " 00:00:00"
        updateUserForAdmin(this.temp).then((response) => {
          this.list.unshift(this.temp)
          this.dialogFormVisible = false
          if(response.data.code === 0){
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }else{
            this.$notify({
              title: '更新失败',
              message: response.data.msg,
              type: 'failed',
              duration: 2000
            })
          }
        })
      }
     
    },
  }
}
</script>
