<template>
  <el-dialog :title="isUpdate?'编辑班级':'新增班级'" :visible.sync="dialogFormVisible">

      <el-form ref="temp" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 400px; margin-left:50px;">
				<!-- <el-form-item label="选择学段" prop="phase">
					<el-select v-model="temp.phase" class="filter-item" placeholder="Please select">
						<el-option v-for="item in roleTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
					</el-select>
				</el-form-item> -->
				<el-form-item label="班级" prop="className">
					<el-input v-model="temp.className" placeholder="请填写班级名称"/>
				</el-form-item>

				<el-form-item label="选择课程" prop="courseIdList">
          <el-input @focus="treeShow = true" v-model="courseIdList"  placeholder="请选择课程"></el-input>

					<!-- <el-cascader :options="allCourse" placeholder="请选择课程" v-model="temp.courseIdList" :props="{label:'courseName',value:'id'}"></el-cascader>
          <cascaderMulti v-model="end_code" :data="allCourse" placeholder="请选择课程"></cascaderMulti> -->
        </el-form-item>
        <el-form-item label="选择教师" prop="teacherInfo">
        	<el-select v-model="temp.teacherInfo" placeholder="请选择课程" class="filter-item" >
        		<el-option v-for="item in allTeacher" :key="item.userId" :label="item.realName" :value="item.realName+','+item.userId"/>
        	</el-select>
        </el-form-item>
        <el-form-item label="开课时间" prop="startDate">
					<el-date-picker type="datetime" placeholder="请选择开课时间" value-format="yyyy-MM-dd hh:mm:ss" v-model="temp.startDate"></el-date-picker>
				</el-form-item>

				<el-form-item label="词汇量测试" prop="admissionTest">
				  <el-checkbox v-model="temp.isAdmissionTest">入学测评</el-checkbox>
				  <el-checkbox v-model="temp.isCompletionTest">结业测评</el-checkbox>
				</el-form-item>
				<el-form-item label="复习任务" prop="completionTest">
				  <!-- <el-checkbox v-model="temp.openRepeat">开启</el-checkbox>
				  <el-checkbox v-model="temp.closeRepeat">关闭</el-checkbox> -->
          <el-radio-group v-model="temp.openRepeat">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
				</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="editClass" v-if="isUpdate">{{ '修改' }}</el-button>
        <el-button type="primary" @click="createClass" v-else>{{ '创建' }}</el-button>
      </div>
      <el-dialog :visible.sync="treeShow" append-to-body>
        <el-tree
            :data="allCourse"
            show-checkbox
            node-key="id"
            accordion
            :props="defaultProps"
            @check="handleNodeClick"
             :default-checked-keys="temp.courseIdList"
            >

          </el-tree>
          <el-button @click="treeShow = false" type="primary" style="margin-right:20px;margin-top:20px;">确定</el-button>
      </el-dialog>
    </el-dialog>
</template>

<script>
import { getSubjectList,getUserList,getSingleClass } from '@/api/table'
import {updateTree} from '@/api/tree.js'
export default {
  name:'stuDialog',
  props:{
    isUpdate:{
      type:Boolean
    },
  },
  data(){
    return{
      treeShow:false,
      dialogFormVisible:true,
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
        openRepeat:0,//复习任务
        teacherName:'',//老师姓名
      },
      courseIdList:[],
      allCourse:[],
      allTeacher:[],
      defaultProps: {
        children: 'children',
        label: 'courseName',
        value:'id'
      }
    }
  },
  mounted(){
    this.getSubjectList();
    this.getUserList();

  },
  methods:{
    handleNodeClick(dd,data) {
      this.courseIdList = []
        for(let i=0;i<data.checkedNodes.length;i++){
          this.courseIdList.push(data.checkedNodes[i].courseName);
        }
        this.temp.courseIdList = data.checkedKeys;
    },
    getSubjectList(){//查询所有课程
      getSubjectList({isAll:'1',pattern:''}).then(res => {
        // this.allCourse = res.data.subjectList;
         this.allCourse = updateTree(res.data.courseList)
         if(this.isUpdate){
            this.getSingleClass()
          }
      })
    },
    getUserList(){//查询所有老师
      getUserList({isAll:'1',pattern:''}).then(res => {
        this.allTeacher = res.data.teacherList
      })
    },
    createClass(){
      this.$refs['temp'].validate((valid) => {
        if (valid) {
          this.temp.admissionTest = this.temp.isAdmissionTest?1:0;
          this.temp.completionTest = this.temp.isCompletionTest?1:0;
          this.temp.userTeacherId = this.temp.teacherInfo.split(',')[1]*1,
          this.temp.teacherName = this.temp.teacherInfo.split(',')[0],
          this.$emit('create',this.temp);
        }else{
          errorShow('表单提交失败')
          return false
        }
      })
    },
    editClass(){
      this.$refs['temp'].validate((valid) => {
        if (valid) {
          this.temp.admissionTest = this.temp.isAdmissionTest?1:0;
          this.temp.completionTest = this.temp.isCompletionTest?1:0;
          this.temp.userTeacherId = this.temp.teacherInfo.split(',')[1]*1,
          this.temp.teacherName = this.temp.teacherInfo.split(',')[0],
          this.$emit('updateClass',this.temp);
        }else{
          errorShow('表单提交失败')
          return false
        }
      })
    },
    getSingleClass(){//查询班级信息
      getSingleClass(this.$route.query.classId).then(res => {
          this.temp = res.data.class;
          // this.courseIdList = res.data.class.courseIdList;
          for(let j=0;j<res.data.class.courseIdList.length;j++){
              for(let i=0;i<this.allCourse.length;i++){
                if(res.data.class.courseIdList[j]===this.allCourse[i].id){
                  this.courseIdList.push(this.allCourse[i].courseName);
                  if(this.allCourse[i].children){
                    for(let n=0;n<this.allCourse[i].children.length;n++){
                        if(res.data.class.courseIdList[j]===this.allCourse[i].id){
                          this.courseIdList.push(this.allCourse[i].children[n].courseName);
                        }
                    }
                  }
                }
              }
          }

          this.temp.courseIdList = res.data.class.courseIdList;
          this.temp.teacherInfo = res.data.class.teacherName+','+res.data.class.userTeacherId
          this.temp.isAdmissionTest = res.data.class.admissionTest===1?true:false;
          this.temp.isCompletionTest =res.data.class.completionTest===1?true:false;
          this.temp.openRepeat = res.data.class.openRepeat;
      })
    }
  },
  watch:{
    dialogFormVisible(new_,old){
      this.$emit('close')
    },

  }
}
</script>
