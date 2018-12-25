<template>  
    <div class="teachingTab">
        <ul>
          <li @click="tab('classList','teachingmanager')" :class="{'default':teachingTab==''||teachingTab=='classList'}">班级列表</li>
          <li>分组管理</li>
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
      });
    }
  },
  
}
</script>
<style lang="less" scope>
.teachingTab{
  ul{
    width:100%;
    height:43px;
    line-height:43px;
    border-bottom:1px solid #e0e0e1;
    padding-bottom:2px;
    li{
      float:left;
      margin:0 20px;
      list-style: none;
      line-height:40px;
      &.default{
        border-bottom:3px solid #000;
      }
    }
  }
}
</style>
">

</style>
