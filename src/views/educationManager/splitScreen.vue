<template>
  <div class="splitScreen">
    <div class="first">
        <div>
            <label><span>战神队</span></label>
            <h5>
                <span>排名 1</span>
                <span>平均分 99 分</span>
            </h5>
        </div>
        <ul>
            <li v-for="(list,index) in firstData" :key="index">
                <p>{{list.realName}} {{list.wordNum}}</p>
                <p class="progress groupProgress"><span :style="{width:list.wordNum*3+'px'}"></span></p>
            </li>
        </ul>
    </div>

    <div class="second">
        <div>
            <label><span>战神队</span></label>
            <h5>
                <span>排名 1</span>
                <span>平均分 99 分</span>
            </h5>
        </div>
        <ul>
            <li v-for="(list,index) in secondData" :key="index">
                <p>{{list.realName}} {{list.wordNum}}</p>
                <p class="progress groupProgress"><span :style="{width:list.wordNum*3+'px'}"></span></p>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
import { getStuInfoInGroup } from '@/api/table'


export default {
  name: 'splitScreen',

  data() {
    return {
      first:null,
      second:null,
      firstData:[],
      secondData:[],
    }
  },
  created() {
    this.first = this.$route.query.first;
    this.second = this.$route.query.second;
    this.getStuInfoInGroup()
  },
  watch:{
    
  },
  methods: {
    getStuInfoInGroup(){
        getStuInfoInGroup({classId:this.$route.query.classId,groupItemId:this.$route.query.first}).then(res=>{
            this.firstData = res.data.stuList;
        })
        if(this.$route.query.second){
            getStuInfoInGroup({classId:this.$route.query.classId,groupItemId:this.$route.query.second}).then(res=>{
                this.secondData = res.data.stuList;
            })
        }
    }
  }
}
</script>
<style lang="less" scope>
.splitScreen{
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
      height:5px;
      width:300px;
      background:rgba(233, 233, 233, 1);
      border-radius:20px;
      position:relative;
      span{
        position:absolute;
        left:0;
        top:0;
        display:inline-block;
        background:rgb(255,210,21,1);
        height:5px;
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