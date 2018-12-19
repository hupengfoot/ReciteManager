<template>
  <div class="app-container">
    <el-input placeholder="请输入班级名称或关键字进行查询" style="width: 400px;" class="filter-item" @keyup.enter.native="searchTeacher"/>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchTeacher">{{ 'search' }}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addClass">{{ '创建班级' }}</el-button>
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
        
				<el-form-item label="选择学段" prop="phase">
					<el-select v-model="temp.phase" class="filter-item" placeholder="Please select">
						<el-option v-for="item in roleTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
					</el-select>
				</el-form-item>
				<el-form-item label="班级" prop="class">
					<el-input v-model="temp.class"/>
				</el-form-item>
				<el-form-item label="选择课程" prop="course">
					<el-cascader :options="options"  v-model="temp.course"></el-cascader>
				</el-form-item>
        <el-form-item label="选择教师" prop="teacher">
        	<el-select v-model="temp.teacher" class="filter-item" placeholder="Please select">
        		<el-option v-for="item in roleTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        	</el-select>
        </el-form-item>
				<el-form-item label="词汇量测试" prop="measurement">
					<el-radio v-model="temp.measurement" label="1">入学测评</el-radio>
					<el-radio v-model="temp.measurement" label="2">结业测评</el-radio>
				</el-form-item>
				
				
				
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="createClass">{{ '创建' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import {successShow,errorShow} from '@/utils/notice.js'


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
        class: [{ required: true, message: '请输入班级', trigger: 'change' }],
      },
      temp: {
        teacher: '',
        course: '',
        phase: '',
        class: '',
        measurement:'1',//词汇量测评
      },
      sexTypeOptions,
      roleTypeOptions,
      sexMock,
      phoneMock,
      roleMock,
			options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }],
    
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
		addClass(){
			this.resetTemp(),
			this.dialogStatus = 'create';
			this.dialogFormVisible = true;
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate        
			})
		},
    createClass(){
			
			createClass(this.temp).then(response => {
				successShow('成功咯')
// 				this.list = response.data.items
// 				this.listLoading = false
			}).catch(res=>{
				errorShow('失败了呢')
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
