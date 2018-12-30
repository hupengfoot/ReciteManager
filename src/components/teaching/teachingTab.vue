<template>  
    <div class="teachingTab">
        <h3>教学管理</h3>
        <ul>
          <li @click="tab('classmateList', 'classmatelist')" :class="{'default':teachingTab==''||teachingTab=='classmateList'}">班级列表</li>
          <li @click="tab('groupmanager', 'groupmanager')" :class="{'default':teachingTab==''||teachingTab=='groupmanager'}">分组管理</li>
          <li>测试管理</li>
          <li @click="tab('resultsCenter','educationManager')" :class="{'default':teachingTab=='resultsCenter'}">成绩列表</li>
          <li>错题本</li>
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
          classId:this.classId
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
