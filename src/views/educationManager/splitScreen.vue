<template>
  <div class="splitScreen">
    <p class="small">*数据每十秒更新一次</p>
    <div class="first">
        <div>
            <label><span>{{$route.query.groupName}}</span></label>
            <h5>
                <span>排名 {{$route.query.firstRank}} </span>
                <span> 平均 {{firstAverage}} 单词量</span>
            </h5>
        </div>
        <ul>
            <li v-for="(list,index) in firstData.stuList" :key="index">
                <p>{{list.realName}} {{list.wordNum}}</p>
                <p class="progress groupProgress"><span :style="{width:(list.wordNum/maxGroupWordNum)*300+'px'}"></span></p>
            </li>
        </ul>
    </div>

    <div class="second" v-if="$route.query.second">
        <div>
            <label><span>{{$route.query.groupSecondName}}</span></label>
            <h5>
                <span>排名 {{$route.query.secondRank}} </span>
                <span> 平均 {{secondAverage}} 单词量</span>
            </h5>
        </div>
        <ul>
            <li v-for="(list,index) in secondData.stuList" :key="index">
                <p>{{list.realName}} {{list.wordNum}}</p>
                <p class="progress groupProgress"><span :style="{width:(list.wordNum/secondMaxGroupWordNum)*300+'px'}"></span></p>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>

import {getStuInfoInGroup } from '@/api/table'
export default {
  name: 'splitScreen',

  data() {
    return {
      first:null,
      second:null,
      firstData:[],
      secondData:[],
      firstAverage:0,
      secondAverage:0,
      maxGroupWordNum:0,
      secondMaxGroupWordNum:0,
      timer: null
    }
  },
  
  mounted(){
      clearInterval(this.setTimer())
  },
  created() {
    this.firstSelect()
    if(this.$route.query.second){
        this.secondSelect();
    }
    
  },
  distroyed: function () {
　　clearInterval(this.setTimer())
  },
  watch:{
    
  },
  methods: {
      setTimer: function () {
    　　　　this.timer = setInterval(() => {
    　　　　　　this.firstSelect()　
              if(this.$route.query.second){
                this.secondSelect();
              }　
    　　　　}, 10000)
    　},
      firstSelect(){
        this.first = JSON.parse(this.$route.query.first);
        let firstSub = 0;
        
        getStuInfoInGroup({
            classId:this.$route.query.classId,
            groupItemId:this.first
        }).then(res=>{
            this.firstData = res.data;
            for(let i=0;i< res.data.stuList.length;i++){
                firstSub += res.data.stuList[i].wordNum;
            }
            this.firstAverage = (Math.round((firstSub/res.data.stuList.length))).toString();
            
            for(let n=0;n<res.data.stuList.length;n++){
                this.maxGroupWordNum = this.maxGroupWordNum>res.data.stuList[n].wordNum?this.maxGroupWordNum:res.data.stuList[n].wordNum;
            }
        })
      },
      secondSelect(){
          let secondSub = 0;
        this.second = JSON.parse(this.$route.query.second);
        getStuInfoInGroup({
            classId:this.$route.query.classId,
            groupItemId:this.second
        }).then(res=>{
            this.secondData = res.data;
            for(let i=0;i<res.data.stuList.length;i++){
                secondSub += res.data.stuList[i].wordNum;
            }
            for(let n=0;n<res.data.stuList.length;n++){
                this.secondMaxGroupWordNum = this.secondMaxGroupWordNum>res.data.stuList[n].wordNum?this.secondMaxGroupWordNum:res.data.stuList[n].wordNum;
            }
            this.secondAverage = (Math.round((secondSub/res.data.stuList.length))).toString();
        })
      }
  }
}
</script>
<style lang="less" scope>
.splitScreen{
    .small{
        text-align: right;
        font-size: 12px;
        margin-right: 20px;
        color: red;
    }
    .first,.second{
        float:left;
        padding:20px;
        width:50%;

    }
    label{
        float:left;
        display:inline-block;
        height:60px;
        width:60px;
        border:1px solid rgba(176,216,255,.8);
        background:rgba(176,216,255,1);
        border-radius:20px;
        
        span{
            display:inline-block;
            height:50px;
            width:50px;
            border:1px solid rgba(176,216,255,.8);
            border-radius:20px;
            margin-top:4px;
            margin-left:4px;
            background:rgba(48, 155, 255, 1);
            line-height:50px;
            text-align:center;
            font-size:12px;
        }
    }
    h5{
        border-top-left-radius:10px;
        border-bottom-left-radius:10px;
        border-top-right-radius:20px;
        border-bottom-right-radius:20px;
        height:40px;
        line-height:40px;
        position:relative;
        top:10px;
        text-indent:10px;
        margin-left:60px;
        background:rgba(236,241,247);
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
    ul{
    padding-left:30px;
    padding-top:10px;
    li{
      margin:0;
      font-size:14px;
      list-style: none;
      padding:5px 10px;
      p{
          padding:0;
          margin:0;
          height:25px;
          line-height:25px;
      }
      &:nth-child(2n){
          background:rgba(246,250,255,1);
      }
    }
  }
}
</style>