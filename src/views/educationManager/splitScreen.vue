<template>
  <div class="splitScreen">
    <div class="first">
        <div>
            <label><span>{{first.groupItemName}}</span></label>
            <h5>
                <span>排名 {{first.averageGrader}} </span>
                <span> 平均 {{firstAverage}} 单词量</span>
            </h5>
        </div>
        <ul>
            <li v-for="(list,index) in first.stuInfoList" :key="index">
                <p>{{list.realName}} {{list.wordNum}}</p>
                <p class="progress groupProgress"><span :style="{width:(list.wordNum/maxGroupWordNum)*300+'px'}"></span></p>
            </li>
        </ul>
    </div>

    <div class="second" v-if="$route.query.second">
        <div>
            <label><span>{{second.groupItemName}}</span></label>
            <h5>
                <span>排名 {{second.averageGrader}} </span>
                <span> 平均 {{secondAverage}} 单词量</span>
            </h5>
        </div>
        <ul>
            <li v-for="(list,index) in second.stuInfoList" :key="index">
                <p>{{list.realName}} {{list.wordNum}}</p>
                <p class="progress groupProgress"><span :style="{width:(list.wordNum/secondMaxGroupWordNum)*300+'px'}"></span></p>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
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
    }
  },
  created() {
    this.first = JSON.parse(this.$route.query.first);
    
    let firstSub = 0;
    let secondSub = 0;
    for(let i=0;i< this.first.stuInfoList.length;i++){
        firstSub += this.first.stuInfoList[i].wordNum;
    }
    this.firstAverage = firstSub/this.first.stuInfoList.length;
    
    for(let n=0;n<this.first.stuInfoList.length;n++){
        this.maxGroupWordNum = this.maxGroupWordNum>this.first.stuInfoList.wordNum?this.maxGroupWordNum:this.first.stuInfoList[n].wordNum;
    }
    if(this.$route.query.second){
        this.second = JSON.parse(this.$route.query.second);
        for(let i=0;i<this.second.stuInfoList.length;i++){
            secondSub += this.second.stuInfoList[i].wordNum;
        }
        for(let n=0;n<this.second.stuInfoList.length;n++){
            this.secondMaxGroupWordNum = this.secondMaxGroupWordNum>this.second.stuInfoList.wordNum?this.secondMaxGroupWordNum:this.second.stuInfoList[n].wordNum;
        }
        this.secondAverage = (Math.round((secondSub/this.second.stuInfoList.length) * 100) / 100).toString();
    }
    
  },
  watch:{
    
  },
  methods: {

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