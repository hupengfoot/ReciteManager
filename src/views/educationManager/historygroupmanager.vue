<template>
  <div class="historygroupmanager">
    <teaching-tab :classId="classId" ></teaching-tab>
    <div class="historygroupmanagerMain">
      <div class="groupDeatils" v-for="(item,index) in groupList" :key="index">
        <p class="serialNumber">编号：{{item.id}}</p>
        <h5 class="grade"><input style="text-align:center;background-color:rgba(48,155,255,1);border:none;" type='text' :value="item.groupItemName" size="10"></h5>
        <router-link :to="{name:'groupmembermanager',query:{classId:item.classId, groupItemId:item.id}}"><el-button class="joinClass">进入小组</el-button></router-link>
        <div class="createTime">创建时间：{{ new Date(item.createTime).toLocaleDateString() }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {getGroupItemList, getHistoryGroup} from '@/api/table'
import teachingTab from '@/components/teaching/teachingTab'
export default {
  name: 'historygroupmanager',
  components: { teachingTab },
  data(){
    return{
      classId: 0,
      groupList: [],
      pageInfo: {
        page: 1,
        limit: 200,
        totalNum:0,
      },
    }
  },
  created() { 
    this.classId = Number(this.$route.query.classId);
    this.getHistoryGroup();
  },
  methods:{
      getGroupItemList(){
        getGroupItemList(this.classId,{
            page:this.pageInfo.page,
            limit:this.pageInfo.limit,
            classId:this.classId,
            pattern:this.pattern
        }).then(res=>{
            this.groupList = res.data.groupItemList.records;
            this.pageInfo.totalNum = res.data.groupItemList.total;
        })
      },
      getHistoryGroup(){
          getHistoryGroup({
              classId : this.classId,
              page : 1,
              limit : 2000
          }).then(res=>{
            this.groupList = res.data.result.records;
            this.pageInfo.totalNum = res.data.result.total;
          });
      }
  }
}
</script>

<style lang="less" scoped>
.historygroupmanager {
  padding:20px;
  .searchForm{
    height:50px;
    line-height:50px;
    .el-input{
      width:220px;
      margin-left:20px;

    }
  }
  .historygroupmanagerMain{
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

    .groupDeatils{
      height:204px;
      width:190px;
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
  .el-table{
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
