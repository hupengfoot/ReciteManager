<template>
  <div class="wrongTopicRecord">
    <!-- <form class="searchForm">
      <el-input v-model="search.pattern" placeholder="请输入学生姓名或关键字进行查询"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="wrongSet"> </el-button>
    </form> -->
    <teaching-tab :classId="classId" ></teaching-tab>
    <div class="wordMain">
      <form class="searchForm">
        <el-select v-model="search.questionType" @change="wrongSet">
          <el-option value='' label="">全部</el-option>
          <el-option v-for="list in questionType" :key="list.id" :value="list.id" :label="list.typeName"></el-option>
        </el-select>
        <el-date-picker v-model="startDate" @change="wrongSet" value-format="timestamp" placeholder="请选择开始时间"></el-date-picker>
        <el-date-picker v-model="endDate" @change="wrongSet" value-format="timestamp" placeholder="请选择结束时间"></el-date-picker>
      </form>
      <el-radio-group class="wordList" v-model="details"  @change="selectDetails($event)">
        <el-radio-button v-for="(list,index) in wordList" :key="index" :label="list">{{list.content}}</el-radio-button>
      </el-radio-group>
      <div class="wordDetalis">
        <div class="detalisMain" v-if="wordDetails.content">
          <p>{{wordDetails.content}} </p>
          <p><img @click="playAudio" src="@/assets/voice.png"></p>
          <audio id="audio" :src="audioUrl+wordDetails.audio">你的浏览器不支持</audio>
          <p>{{wordDetails.mean}}</p>
        </div>
      </div>
    </div>
    <pagination v-show="page.totalNum>0" :total="page.totalNum" :page.sync="page.page" :limit.sync="page.limit" @pagination="wrongSet" />
  </div>
</template>

<script>
import { wrongSet,getList } from '@/api/table'
import Pagination from '@/components/Pagination'
import teachingTab from '@/components/teaching/teachingTab'
export default {
  name: 'wrongTopicRecord',
  components: { teachingTab,Pagination },
  data(){
    return{
      startDate:'',
      endDate:'',
      search:{
        pattern:null,
        startDate:'',
        endDate:'',
        questionType:''
      },
      page:{
        page:1,
        limit:10,
        totalNum:0,
      },
      details:'',
      classId:0,
      wordList:[],
      wordDetails:{},
      audioUrl:'',
      questionType:[],
    }
  },
  mounted(){
    this.wrongSet();
    this.getList();
    this.classId = this.$route.query.classId*1;
    
  },
  methods:{
   wrongSet(){
     if(this.startDate){
        let start = this.startDate.toString();
        this.search.startDate = start.substr(0,10);
     }
     if(this.endDate){
        this.search.endDate = this.endDate.toString().substr(0,10);
     }
      wrongSet(this.$route.query.classId,this.search).then(res=>{
        this.wordList = res.data.wordList.records;
        this.page.totalNum = res.data.wordList.total;
        this.audioUrl = process.env.BASE_API;
      })
   },
   getList(){
      getList().then(res=>{
        this.questionType = res.data.questionTypeList;
      })
   },
   selectDetails(event){
     this.wordDetails = event;
   },
   playAudio(){
     var a=document.getElementById("audio");
      a.play();
   }
  }
}
</script>

<style lang="less" scoped>
.wrongTopicRecord{
  padding:20px;
  .searchForm{
    height:50px;
    line-height:50px;
    .el-input{
      width:220px;
      margin-left:20px;
    }
  }
  .wordMain{
    overflow:hidden;
    .wordList{
      width:60%;
      margin-top:20px;
      float:left;
      border:1px solid #e0e0e1;
      padding:20px;
      min-height:400px;
    }
    .wordDetalis{
      font-size:18px;
      margin-top:20px;
      width:38%;
      float:right;
      border:1px solid #e0e0e1;
      min-height:400px;
      .detalisMain{
        margin-top:100px;
        margin-left:40px;
        img{
          height:20px;
          width:25px;
          cursor:pointer;
        }
      }
    }
  }
}
</style>
