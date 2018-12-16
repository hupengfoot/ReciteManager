<template>
  <div class="app-container">
    <el-input placeholder="请输入班级名称或关键字进行查询" style="width: 400px;" class="filter-item" @keyup.enter.native="searchTeacher"/>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchTeacher">{{ 'search' }}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addTeacher">{{ '创建班级' }}</el-button>
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
      <el-table-column label="班级名称">
        <template slot-scope="scope">
          {{ scope.row.title.substring(0, 8) }}
        </template>
      </el-table-column>
      <el-table-column label="班级人数" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ sexMock[randomNum(0, 1)] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.display_time.substring(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateTeacher">{{ '进入班级' }}</el-button>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 400px; margin-left:50px;">
        <el-form-item label="班级" prop="type">
          <el-input v-model="temp.teachername"/>
        </el-form-item>
        <el-form-item label="选择课程" prop="timestamp">
          <el-input v-model="temp.teachername"/>
        </el-form-item>
         <el-form-item label="选择教师" prop="type">
          <el-select v-model="temp.role" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="">{{ '创建' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive



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

const phoneMock = [
  "13917628345",
  "13875637481",
  "19113348414",
  "18713413412",
  "15613412341",
  "14514132412",
  "16713412342",
  "138123412343",
  "181132413241",
  "134512341234"
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
      total:100,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
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
        teachername: '',
        sex: undefined,
        birthday: '',
        phone: '',
        mail: '',
        role: ''
      },
      sexTypeOptions,
      roleTypeOptions,
      sexMock,
      phoneMock,
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
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    searchTeacher(){
      alert('xxx');
    },
    resetTemp(){
      this.temp = {
        teachername: '',
        sex: undefined,
        birthday: '',
        phone: '',
        mail: '',
        role: ''
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
    updateTeacher(){
      this.resetTemp(),
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate        
      })
    },
    deletedTeacher(){
      alert('delete teacher')
    }
  }
}
</script>
