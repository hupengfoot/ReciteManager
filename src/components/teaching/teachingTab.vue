<template>  
    <div class="teachingTab">
        <h3>教学管理</h3>
        <ul>
          <li @click="tab('classmatelist', 'classmatelist')" :class="{'default':teachingTab==''||teachingTab=='classmatelist'}">班级列表</li>
          <li @click="tab('groupmanager', 'groupmanager')" :class="{'default':teachingTab==''||teachingTab=='groupmanager'}">分组管理</li>
          <li @click="tab('testmanager', 'testmanager')" :class="{'default':teachingTab==''||teachingTab=='testmanager'}">测试管理</li>
          <li @click="tab('educationManager','educationManager')" :class="{'default':teachingTab==''||teachingTab=='educationManager'}">成绩列表</li>
          <li @click="tab('wrongTopicRecord','wrongTopicRecord')" :class="{'default':teachingTab==''||teachingTab=='wrongTopicRecord'}">错题本</li>
          <li @click="tab('historygroupmanager', 'historygroupmanager')" :class="{'default':teachingTab==''||teachingTab=='historygroupmanager'}">历史分组管理</li>
        </ul>
    </div>
</template>

<script>
import { getStuInfoByStuId } from '@/api/table'
import { mapGetters } from 'vuex'
export default {
  name:'stuDialog',
  props:{
    classId: {  //需要传入classId
      required: true,
      type: Number
    },
  },
  
  computed:{
    teachingTab() {
      return this.$store.state.teaching.teachingTab
    },
  },

  created(){
    //页面载入时获取当前tab标识
    let currentTab = this.$route.path.split('/')[2];
    this.$store.state.teaching.teachingTab = currentTab;
  },

  data(){
    return{
      
    }
  },
  methods:{
    tab(tab,path){
      this.$store.state.teaching.teachingTab = tab;
      this.$router.push({
        name:path,
        query:{
          classId:this.classId,
          startDate:this.$route.query.startDate
        }
      });
    }
  },
  
}
</script>
<style lang="less" scope>
.teachingTab{
  h3{
    font-size:14px;
    margin:10px 0;
    color:#666;
    
  }
  ul{
    width:100%;
    height:43px;
    line-height:43px;
    border-bottom:1px solid #e0e0e1;
    padding-bottom:2px;
    margin-top:0;
    padding-left:0;
    li{
      float:left;
      margin:0 40px 0 0;
      list-style: none;
      line-height:40px;
      cursor:pointer;
      &.default{
        border-bottom:3px solid #000;
      }
    }
  }
}
</style>
">

</style>
