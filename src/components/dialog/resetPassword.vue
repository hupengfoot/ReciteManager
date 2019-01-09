<template>  
  <el-dialog title="密码重置" :visible.sync="dialogFormVisible">
    <el-form ref="temp" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
      <el-form-item label="旧密码" prop="password">
        
        <el-input v-model="temp.password"  />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="temp.newPassword"/>
      </el-form-item>
      <el-form-item label="重复密码" prop="repeatPassword">
        <el-input v-model="temp.repeatPassword"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible=false">{{ '取消' }}</el-button>
      <el-button type="primary" @click="resetPassword">{{ '确定' }}</el-button>

    </div>
  </el-dialog>
</template>

<script>
import { updatePassword } from '@/api/table'
import {successShow,errorShow} from '@/utils/notice.js'
export default {
  name:'resetPassword',
  props:{
    
  },
  data(){
    return{
      dialogFormVisible:true,
      rules: {
        password: [{ required: true, message: '原密码不能为空', trigger: 'blur' }],
        newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
        repeatPassword: [{required: true, message: '重复密码不能为空', trigger: 'blur' }],
      },
      temp: {
        password:'',
        newPassword:'',
        repeatPassword:'',
      },
    }
  },
  mounted(){
    if(this.isUpdate&&this.editId){
      this.getStuInfoByStuId()
    }
  },
  methods:{
    resetPassword(){
      this.$refs['temp'].validate((valid) => {
        if (valid) {
            getGroupItemList({
                password:this.temp.password,
                newPassword:this.temp.newPassword
            }).then(res=>{
                successShow('重置成功，请重新登录');
                this.dialogFormVisible=false;
            })
        }else{
          errorShow('表单提交失败')
          return false
        }
      })
    },
  },
  watch:{
    dialogFormVisible(new_,old){
      this.$emit('close')
    }
  }
}
</script>
