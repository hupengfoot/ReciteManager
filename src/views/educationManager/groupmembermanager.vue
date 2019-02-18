<template>
  <div class="groupmembermanager">
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addStudent">{{ '新增组员' }}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="batchAddGold">{{ '批量奖励金币' }}</el-button>
    <el-checkbox label="全选" name="type" @change="handleSelectAllChange()"/>
    <teaching-tab :classId="classId" ></teaching-tab>
    <div class="groupmembermanagerMain">
      <el-table border :data="stuList">
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="勾选">
          <template slot-scope="scope">
            <el-checkbox label="" name="type" @change="handleCheckAllChange(scope.$index)"/>
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="stuId"></el-table-column>
        <el-table-column label="姓名" prop="realName"></el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            {{scope.row.gender | gender}}
          </template>
        </el-table-column>
         <el-table-column label="金币">
          <template slot-scope="scope">
            {{scope.row.goldCoin}}
          </template>
        </el-table-column>
        <el-table-column label="进度" width="400">
          <template slot-scope="scope">
            <p class="progress"><span :style="{width:(scope.row.wordNum/maxWordNum)*300+'px'}"></span></p>
          </template>
        </el-table-column>
        <el-table-column label="Actions" align="center" width="240" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="addGold(scope.row.stuId)">{{ '奖励金币' }}</el-button>
            <el-button type="danger" size="mini" @click="detailsGold(scope.row.stuId)">{{ '记录' }}</el-button>
            <el-button type="primary" size="mini" @click="reductionGold(scope.row.stuId)">{{ '扣除金币' }}</el-button>
            <el-button size="mini" type="danger" @click="deleteLink(scope.row.stuId)">{{ '删除' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="新增组员" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="ID">
          <el-input v-model="stuId"/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="realName"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="addStu2Group">{{ '确定' }}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="奖励金币" :visible.sync="goldFormVisible">
      <el-form ref="goldForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="金币">
          <el-input v-model="goldNum" @keyup.native="testNumber($event)" placeholder="请输入添加数量" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="remark" placeholder="请输入备注"  type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goldFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="rewardGold(1)">{{ '确定' }}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="扣除金币" :visible.sync="reductionGoldFormVisible">
      <el-form ref="goldForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="金币">
          <el-input v-model="goldNum" @keyup.native="testNumber($event)" placeholder="请输入扣除数量" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="remark" placeholder="请输入备注"  type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reductionGoldFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="rewardGold(2)">{{ '确定' }}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量奖励金币" :visible.sync="batchGoldFormVisible">
      <el-form ref="goldForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="金币">
          <el-input v-model="goldNum"  @keyup.native="testNumber($event)" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="remark" placeholder="请输入备注"  type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchGoldFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="batchRewardGold()">{{ '确定' }}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="金币记录" :visible.sync="detailsGoldVisible">
      <el-table :data="listGoldData" border max-height="500">
        <el-table-column align="center" label="序" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额" prop="gold">
      </el-table-column>
      <el-table-column align="center" label="备注" prop="remark">
      </el-table-column>
      <el-table-column align="center" label="时间" prop="createTime">
      </el-table-column>
      </el-table>
      <pagination v-show="goldPageInfo.pageTotal>0" :total="goldPageInfo.pageTotal" :page.sync="goldPageInfo.page" :limit.sync="goldPageInfo.limit" @pagination="goldList" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailsGoldVisible = false">{{ '关闭' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getStuInfoInGroup, rewardGold, addStu2Group, deleteLink,goldList } from '@/api/table'
import teachingTab from '@/components/teaching/teachingTab'
import Pagination from '@/components/Pagination'
import {successShow,errorShow} from '@/utils/notice.js'
export default {
  name: 'groupmembermanager',
  components: { teachingTab,Pagination },
  data(){
    return{
      classId: 0,
      groupItemId: 0,
      stuList: [],
      selectAll : 0,
      selectArr: [],
      selectStuID: [],
      dialogFormVisible: false,
      goldFormVisible: false,
      batchGoldFormVisible: false,
      reductionGoldFormVisible:false,
      detailsGoldVisible:false,
      goldNum: '',
      stuId: "",
      realName: "",
      maxWordNum:0,
      boxcheck: false,
      remark:'',
      listGoldData:[],
      goldPageInfo:{
        page:1,
        limit:10,
        pageTotal:0
      }
    }
  },
  created() { 
    this.classId = Number(this.$route.query.classId);
    this.groupItemId = Number(this.$route.query.groupItemId);
    this.pattern = "";
    this.dialogFormVisible = false;
    this.getStuInfoInGroup();
  },
  methods:{
     getStuInfoInGroup(){
         getStuInfoInGroup({
             groupItemId: this.groupItemId,
             classId: this.classId
         }).then(res=>{
            this.stuList = res.data.stuList;
            //设置勾选数组
            for(var i in this.stuList){
              this.selectArr.push(0);
              this.selectStuID.push(this.stuList[i].stuId);
              this.maxWordNum = (this.maxWordNum < this.stuList[i].wordNum ? this.stuList[i].wordNum : this.maxWordNum);
              this.stuList[i].checkModel = false
            }
         })
     },
     addStudent(){
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate        
        })
     },
     batchAddGold(){
         this.batchGoldFormVisible = true;
         this.$nextTick(() => {
             this.$refs['goldForm'].clearValidate 
         })
     },
     addGold(stuId){
         this.stuId = stuId;
         this.goldFormVisible = true;
         this.$nextTick(() => {
             this.$refs['goldForm'].clearValidate 
         })
     },
     detailsGold(id){
       this.stuId = id;
       this.detailsGoldVisible = true;
       this.goldList();
     },
     goldList(){
        // this.goldPageInfo.push({'stuId':this.stuid})
        Object.assign(this.goldPageInfo, {'stuId':this.stuId});
        goldList(this.goldPageInfo).then(res=>{
          this.listGoldData = res.data.goldList.records
          this.goldPageInfo.pageTotal = res.data.goldList.total
        })
        
     },
     reductionGold(stuId){
         this.stuId = stuId;
         this.reductionGoldFormVisible = true;
         this.$nextTick(() => {
             this.$refs['goldForm'].clearValidate 
         })
     },
     batchRewardGold(){
       this.batchGoldFormVisible = false;
        let promiseArray = [];
        for(let i in this.selectArr){
          if(this.selectArr[i] === 1){
            promiseArray.push(rewardGold({stuId: this.selectStuID[i], gold: this.goldNum}));
          }
        }
        Promise.all(promiseArray).then(resultList => {
          this.getStuInfoInGroup();
          //TODO
        });
     },
     rewardGold(type){
         if(!this.goldNum){
           errorShow('金币不能为空');
           return;
         }
         if(this.goldNum == 0){
           errorShow('金币不能为0');
           return;
         }
         this.goldFormVisible = false;
         let num;
         let message;
         if(type===1){
           num = this.goldNum
           message = '添加'
         }else{
           num = this.goldNum*-1
           message = '扣除'
         }
         rewardGold({
             stuId: this.stuId,
             gold: num,
             remark:this.remark
         }).then(res=>{
            if(res.data.code === 0){
              this.$notify({
                title: '成功',
                message: message +'金币成功',
                type: 'success',
                duration: 2000
              })
              this.getStuInfoInGroup();
              this.goldFormVisible = false;
              this.reductionGoldFormVisible = false;
              this.goldNum = "";
              this.remark ="";
            }else{
              this.$notify({
                title:  message +'金币失败',
                message: res.data.msg,
                type: 'failed',
                duration: 2000
              })
            }
         })
     },
     addStu2Group(){
        this.dialogFormVisible = false;
        addStu2Group({
            groupItemId: this.groupItemId,
            stuIdList: this.stuId
        }).then(res => {
            if(res.data.code === 0){
              this.$notify({
                title: '成功',
                message: '添加小组成员成功',
                type: 'success',
                duration: 2000
              })
              this.getStuInfoInGroup();
            }else{
              this.$notify({
                title: '添加小组成员失败',
                message: res.data.msg,
                type: 'failed',
                duration: 2000
              })
            }
        })
     },
     deleteLink(stuId){
         deleteLink({
             groupItemId: this.groupItemId,
             stuId: stuId
         }).then(res => {
            if(res.data.code === 0){
              this.$notify({
                title: '成功',
                message: '删除小组成员成功',
                type: 'success',
                duration: 2000
              })
              this.getStuInfoInGroup();
            }else{
              this.$notify({
                title: '删除小组成员失败',
                message: res.data.msg,
                type: 'failed',
                duration: 2000
              })
            }
         })
     },
     handleCheckAllChange(seq){
       this.selectArr[seq] = (this.selectArr[seq] + 1) % 2;
     },
     handleSelectAllChange(){
       this.selectAll = (this.selectAll + 1) % 2
       for(var i in this.selectArr){
         this.selectArr[i] = this.selectAll
       }
       for(var i in this.stuList){
         if(this.selectAll === 0){
           this.stuList[i].checkModel = false
         }else{
           this.stuList[i].checkModel = true
         }
       }
     },
     testNumber(e){
        e.target.value=e.target.value.replace(/[^\d]/g,'');
     }
  }
}
</script>

<style lang="less" scoped>
.groupmembermanager {
  padding:20px;
  .searchForm{
    height:50px;
    line-height:50px;
    .el-input{
      width:220px;
      margin-left:20px;

    }
  }
  .groupmembermanagerMain{
    .mainTop{
      margin:20px 0;
      text-align:center;
      .mainTopButton{
        display:inline-block;
      
        .el-button{
          height:35px;
          padding:0;
          width:325px;
          border-radius:0;
          
          &:first-child{
            border-top-left-radius:20px;
            border-bottom-left-radius:20px;
          }
          &:nth-child(2){
            border-top-right-radius:20px;
            border-bottom-right-radius:20px;
            position:relative;
            left:-15px;
            border-left:none;
          }
          &.dafult{
            background:#409EFF;
            color:#fff;
          }
        }
        
      }
      .sort{
        margin-right:20px;
        font-size:14px;
        line-height:35px; 
        cursor:pointer;
      }
    }
  }
  .el-table{
    td{
      .el-button{
        margin:3px;
      }
      .el-button+.el-button{
        margin-left:0;
      }
    }
    .progress{
      height:10px;
      width:300px;
      background:rgba(233, 233, 233, 1);
      border-radius:20px;
      position:relative;
      span{
        position:absolute;
        left:0;
        top:0;
        display:inline-block;
        background:#409eff;
        height:10px;
      }
    }
    
      &:nth-child(1){
        .groupProgress{
          span{
            background:#409eff;
          }
        }
      }
      &:nth-child(2){
        .groupProgress{
          span{
            background:#67c23a;
          }
        }
      }
      // &:nth-child(3){
      //   span{
      //     background:#e6a23c;
      //   }
      // }
      // &:nth-child(4){
      //   span{
      //     background:#f56c6c;
      //   }
      // }
    

  }
}
</style>
