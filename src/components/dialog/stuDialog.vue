<template>  
  <el-dialog :title="isUpdate?'编辑学生':'新增学生'" :visible.sync="dialogFormVisible">
    <el-form ref="temp" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
      <el-form-item label="用户名" prop="username">
        
        <el-input v-model="temp.username" :disabled="isUpdate&&editId!=''" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="temp.realName"/>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="temp.gender" class="filter-item" placeholder="请选择性别">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker v-model="temp.birthday" value-format="yyyy-MM-dd"  placeholder="请选择生日"/>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="temp.mobile" placeholder="请填写手机号" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="temp.email"/>
      </el-form-item>
      <el-form-item label="学校" prop="school">
        <el-input v-model="temp.school"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible=false">{{ '取消' }}</el-button>
      <el-button type="primary" @click="editStu" v-if="isUpdate&&editId!=''">{{ '修改' }}</el-button>
      <el-button type="primary" @click="createStu" v-else>{{ '创建' }}</el-button>

    </div>
  </el-dialog>
</template>

<script>
import { getStuInfoByStuId } from '@/api/table'
export default {
  name:'stuDialog',
  props:{
    isUpdate:{
      type:Boolean
    },
    editId:{
      type:Number
    },
    userId:{
      type:Number
    }
  },
  data(){
    return{
      dialogFormVisible:true,
      rules: {
        realName: [{ required: true, message: '真实姓名不能为空', trigger: 'change' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        birthday: [{required: true, message: '请选择生日', trigger: 'blur' }],
        mobile:[{ required: true, message: '请输入手机号', trigger: 'change' }],
        email:[{ required: true, message: '请输入邮箱', trigger: 'change' }],
        school:[{ required: true, message: '请输入学校', trigger: 'change' }],
      },
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
    }
  },
  mounted(){
    if(this.isUpdate&&this.editId){
      this.getStuInfoByStuId()
    }
  },
  methods:{
    createStu(){
      this.$refs['temp'].validate((valid) => {
        if (valid) {
          this.temp.gender = this.temp.gender*1;
          this.temp.classId=this.$route.query.classId;
					this.temp.birthday=this.temp.birthday+" 00:00:00";
          this.$emit('create',this.temp);
        }else{
          errorShow('表单提交失败')
          return false
        }
      })
    },
    editStu(){
      this.$refs['temp'].validate((valid) => {
        if (valid) {
          this.temp.gender = this.temp.gender*1;
          this.temp.userId=this.userId;
					this.temp.birthday=this.temp.birthday+" 00:00:00";
          this.$emit('update',this.temp);
        }else{
          errorShow('表单提交失败')
          return false
        }
      })
    },
    getStuInfoByStuId(){//查询单个学生信息
      getStuInfoByStuId(this.editId).then(res => {
          this.temp = res.data.stuInfo;
          this.temp.gender = String(this.temp.gender)
      })
    }
  },
  watch:{
    dialogFormVisible(new_,old){
      this.$emit('close')
    }
  }
}
</script>
