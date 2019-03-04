

<template>
    <div class="index">
        <div class="title">
            贝宝儿
            <div class="babyinfo" v-if="!baby_info.id"><img src="../assets/avatar.png"></div>
            <div class="babyinfo" v-if="baby_info.length==1">
              <img :src="baby_info[0].logo">
              <div class="babyname" >{{baby_info[0].nickname}}</div>
            </div>
            <div class="babyinfo" v-if="baby_info.length==2"  @click="babyselect()">
                <div class="babyone" :class="{curbaby:curbaby==baby_info[0].id}" >
                    <img :src="imgurl1">
                </div>
                <div class="babytwo" :class="{curbaby:curbaby==baby_info[1].id}">
                    <img :src="imgurl2">
                </div>
                <div  class="babyname" v-if="curbaby==baby_info[0].id">{{baby_info[0].nickname}}</div>
                <div  class="babyname" v-if="curbaby==baby_info[1].id">{{baby_info[1].nickname}}</div>
                <!-- <div class="babyname" >{{babyname}}</div> -->
            </div>

            <router-link :to="{path:'/m/search'}" class="search"><img src="../assets/sousuo@2x.png"></router-link>
        </div>
        <div class="radio-group" v-model="tabView"> 
          <span v-for="(tab ,index) in tabs" :class="{cur:iscur==index,icon:index==1}" @click="iscur=index,tabChange('select' + (index + 1))"><span>{{tab.name}}</span></span>
        </div>
        <keep-alive>
          <component v-bind:is="tabView"></component>
        </keep-alive>

    <dialogBar ref="dialogBar"></dialogBar>
    <Footer :idx="0"></Footer>

  </div>

  <!-- 音频播放器 -->

</template>

<script>
  // import axios from '@/components/apis/index'
  import commonModel from '@/components/common/common'
  import Footer from '@/components/common/Footer'
  import dialogBar from '@/components/common/layer'
  import select1 from '@/components/homepage/first'
  import select2 from '@/components/homepage/second'

  export default {
    name: 'Index',
    components:{
        dialogBar,
        Footer,
        select1,
        select2,

    },
    data () {
        return {
            tabView: 'select1',
            tabs: [{name: "推荐"}, {name: "游戏馆"}],
            iscur: 0,
            babyid:0,
            imgurl1:'',
            imgurl2:'',
            babyname:'',
            baby_info: [],
            curbaby2:'',
      }
    },
    computed:{
        curbaby(){
          return this.$store.state.indexMod.babyid

        },
      },
      watch:{
           curbaby(oldVal,newVal){
             this.curbaby2=oldVal;
           },
      },
    methods:{
        tabChange:function(tab){
            this.tabView = tab;
        },
        getHomeInfo(){
            this.$axios.post('/h5/index_recommend', {}).then(res => {
                res = res.data;
                if (res.code == 0) {
                    const data = res.data;
                    this.baby_info = data.baby_info;

                    // let local_babyinfo = this.$commonModel.babyInfo();
                  if(JSON.stringify(data.baby_info) != "{}" && data.baby_info.length>0){
                    //如果本地没有存宝宝信息
                    // if(!local_babyinfo){
                      localStorage.setItem("baby_info", JSON.stringify(data.baby_info));
                    // }
                    //如果没有存当前选择的宝宝则选第一个宝宝
                    if(!localStorage.getItem("babyid")){
                      localStorage.setItem("babyid",data.baby_info[0].id);

                    }
                    this.babyid = localStorage.getItem("babyid");
                    // this.curbaby= localStorage.getItem("babyid");
                    this.$store.dispatch('updateBabyId',this.babyid)
                    // this.$store.dispatch('updateBabyName',this.babyname)
                    if(data.baby_info[0].id == this.babyid){
                      this.babyname= data.baby_info[0].nickname;
                      this.imgurl1 = data.baby_info[0].logo;
                      if(data.baby_info.length==2){
                        this.imgurl2 = data.baby_info[1].logo;
                      }
                    }else{
                      this.babyname= data.baby_info[1].nickname;
                      this.imgurl1 = data.baby_info[1].logo;
                      this.imgurl2 = data.baby_info[0].logo;
                    }

                    this.babyname= data.baby_info[0].nickname;
                    if(localStorage.getItem("babyid")==0){
                        localStorage.setItem("babyid",data.baby_info[0].id);
                    }else{
                        this.babyid=localStorage.getItem("babyid");
                    }

                    window.localStorage.baby_info=JSON.stringify(data.baby_info);
                    if(data.baby_info.length==2){
                      this.imgurl1=data.baby_info[0].logo;
                      this.imgurl2=data.baby_info[1].logo;
                    }

                  }else{
                    localStorage.setItem("babyid",0);
                  }

                }else if(res.code==999){
                    this.$router.push({path:'/m/login'})
                }else {
                    this.toggleModal(res.msg);
                }
            })

        },
        babyselect(){
            let bid=localStorage.getItem('babyid');
            let babyInfo=this.baby_info;
            if(this.curbaby2==babyInfo[0].id){
                this.$store.dispatch('updateBabyId',babyInfo[1].id)
                localStorage.setItem('babyid',babyInfo[1].id);
                this.babyname=babyInfo[1].nickname;
            } else{
                this.$store.dispatch('updateBabyId',babyInfo[0].id);
                localStorage.setItem('babyid',babyInfo[0].id);
                this.babyname=babyInfo[0].nickname;
            }
        },
        toggleModal(msg){
            let that=this;
            this.$refs.dialogBar.open({
                type: 2,
                content:msg,  // 内容
                shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
                button: ['确定'], // 按钮内容 默认 知道了
                no () {          // 点击确认回调
                   that.$refs.dialogBar.close()
                }

            })
        },
    },
    mounted(){
        this.getHomeInfo();
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../css/head_tab.scss";
body{
    background-color:#f6f6f6;
}

.title {
  line-height: 0.44rem;
  height: 0.44rem;
  position: relative;
  font-size: 0.18rem;
  text-align: center;
  .search {
    position: absolute;
    right: 0;
    top: 0;
    padding:0 0.14rem;
    img {
      width: 0.18rem;
      height: 0.18rem;
      margin-top:0.13rem;
      margin-right:0.1rem;
    }
  }
  .babyinfo {
    position: absolute;
    top: 0.07rem;
    left: 0.16rem;
    img {
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 50%;
      // border: 1px solid #fed13a;
    }
    .babyone{
      position: absolute;
      left: 0;
      top: 0;
      width: 0.3rem;
      height: 0.3rem;
      z-index: 2;
    }
    .babytwo{
      position: absolute;
      left: 0.08rem;
      top: 0;
      width: 0.3rem;
      height: 0.3rem;
      z-index: 1;
    }
    .babyname{
      position: absolute;
      left: 0.46rem;
      width: 0.9rem;
      height: 0.44rem;
      top: -0.07rem;
      font-size: 0.12rem;
      overflow: hidden;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .curbaby{
      z-index: 102
    }
  }
}
.index{
    padding-top: 0.88rem;
    padding-bottom: 0.5rem;
}
.title{
    position: fixed;
    left: 0;
    top: 0;
    background-color: #fff;
    z-index: 99;
    width: 100%;
}
.radio-group{
    position: fixed;
    left: 0;
    top: 0.44rem;
    background-color: #fff;
    z-index: 99;
    width: 100%;
    .icon{
      &>span{position: relative;}
      &>span:after{
         content:'';
         width: 0.28rem;
         height:  0.13rem;
         background: url(../assets/hot@2x.png) no-repeat;
         background-size:0.28rem 0.13rem;
        position: absolute;
        display: inline-block;
        top:-0.07rem;
        right: -0.3rem;
       }

  }
}
</style>
