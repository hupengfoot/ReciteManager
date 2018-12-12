<template>
  <div class="app-container">
    <el-input placeholder="请输入教师名称或关键字进行查询" style="width: 400px;" class="filter-item" @keyup.enter.native="searchTeacher"/>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchTeacher">{{ 'search' }}</el-button>
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
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生日" align="center">
        <template slot-scope="scope">
          {{ scope.row.display_time }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="手机" width="110" align="center">
        <template slot-scope="scope">
           {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="邮箱" width="200">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="角色" width="200">
        <template slot-scope="scope">
         {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="密码" width="200">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="姓名" prop="title">
          <el-input v-model="temp.teachername"/>
        </el-form-item>
        <el-form-item label="性别" prop="type">
          <el-select v-model="temp.sex" class="filter-item" placeholder="Please select">
            <el-option v-for="item in sexTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="timestamp">
          <el-date-picker v-model="temp.birthday" type="datetime" placeholder="Please pick a date"/>
        </el-form-item>
        <el-form-item label="手机号" prop="title">
          <el-input v-model="temp.phone"/>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="temp.mail"/>
        </el-form-item>
         <el-form-item label="角色" prop="type">
          <el-select v-model="temp.role" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ 'cancel' }}</el-button>
        <el-button type="primary" @click="">{{ 'confirm' }}</el-button>
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
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
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
    }
  }
}
</script>
