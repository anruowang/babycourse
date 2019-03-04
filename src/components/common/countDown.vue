<template>
  <div class="countdown-component" :endTime="endTime" :shuaxin="shuaxin">
    <div class="title">{{endText}}</div>
    <div class="timesbox">
      <span class="days" v-if="days>0">{{days}}天</span>
      <span class="tbox hour">{{hours}}</span>
      <span>:</span>
      <span class="tbox minute">{{minute}}</span>
      <span>:</span>
      <span class="tbox second">{{second}}</span>
    </div>
  </div>

</template>
<script>
  export default{
    data () {
      return {
        flag : false,
        days:0,
        hours:0,
        minute:0,
        second:0,
        endText:'距离活动倒计时仅剩'
      }
    },
    mounted () {
      let time = setInterval(()=>{
        if(this.flag == true){
          clearInterval(time)
        }
        this.timeDown()
      },500)
    },
    props : {
      endTime : {
        type : String
      },
      shuaxin:{
          type:Function,
          default :''
      }
    },
    methods : {
      timeDown () {
        const endTime = new Date(this.endTime)
        const nowTime = new Date();
        const leftTime = Math.floor((endTime.getTime()-nowTime.getTime())/1000)
        this.days = Math.floor(leftTime/(24*60*60))
        this.hours = this.formate(Math.floor(leftTime/(60*60)%24))
        this.minute = this.formate(Math.floor(leftTime/60%60))
        this.second = this.formate(Math.floor(leftTime%60))
        if(leftTime>=0){
          setTimeout(this.timeDown,1000)
        } else {
            if(this.shuaxin){
              this.shuaxin("over");
            }
        }

      },
      formate (time) {
        if(time>=10){
          return time
        }else{
          return '0'+time
        }
      }
    }
  }

</script>

<style lang='scss'>
  @import "../../css/variables.scss";
  .countdown-component{
    width: 1.6rem;
    height: 0.5rem;
    background-color: #FED13A;
    text-align: center;
    padding: 0.05rem 0.15rem;
    line-height:0.2rem;
  .title{
    color:#E93559;
  }
  .timesbox{
    color: $brown;
    font-size: 0.14rem;

    .tbox{
      width: 0.2rem;
      height: 0.2rem;
      background-color: $brown;
      border-radius: 0.03rem;
      color: #fff;
      display: inline-block;
      text-align: center;
    }
  }

  }
</style>
