<template>
  <div id="audioplayer">
    <div class="playerbox" ref="playerbox">
      <div class="audio-pic-box" >
        <div class="text">{{music.title}}</div>
        <div id="audio-img" class="audio-img" :class="{animation:currentTime>0}"><img id="pic" :src="music_pic"></div>
        <div id="audio-fm" class="audio-fm" :class="{animation:currentTime>0}"><img src="@/assets/yinpin1dayuan@2x.png"></div>
        <!--<div class="yuanquan"></div>-->
      </div>

      <div class="playerbar">
        <div id="dragbox" class="dragnum dragbox" @mousemove="timeMove($event)" @mouseleave="timeEnd($event)" ref="dragbox">
          <div class="progress" @click="timeClick($event)" ref="progressL">
            <div class="progressbar" :style="{width:distance,transition:'width '+transTime+'s'}"></div>
          </div>
          <div class="bardrag" @mousedown="timeDown($event)" @mouseup="timeEnd($event)" :style="{left:distance}">
          </div>
        </div>
        <div class="dragnum clearfix" style="width: 3.1rem">
          <span style="float: left">00:00</span> <span style="float: right" v-if="duration>0">-{{timestyle(duration-currentTime)}}</span>
        </div>

      </div>
      <div class="audio-player">
        <div class="ico wh20">
          <img v-show="MList.length<2" src="@/assets/player/backward_gray.png">
          <img v-show="MList.length>1" src="@/assets/player/backward.png" id="pre" @click="isPre">
        </div>
        <div class="ico wh68">
          <img src="@/assets/player/bofang@2x.png" id="play" @click="isPlay('play')">
          <img src="@/assets/player/zanting@2x.png" id="stop" @click="isStop">
        </div>
        <div class="ico wh20">
          <img v-show="MList.length<2" src="@/assets/player/forward_gray.png" >
          <img  v-show="MList.length>1" src="@/assets/player/forward.png" id="next" @click="isNext">
        </div>
      </div>
      <audio id="audio" :src="vod_url" preload="auto" @ended="isNext" ref="my_audio"></audio>

    </div>
    <div class="audio-loadtxt" v-if="currentTime==0&&playing">请稍等，音频正在加载中...</div>
    <transition name="fade">
      <div>
        <div class="songListMask" v-show="showList"></div>
        <div class="songList" :class="{showList:showList}">
          <div class="items" ref="songListItems">
            <div class="title" ref="songListTitle">音频列表<span class="close" @click="isClose"><img src="@/assets/player/close.png"></span></div>
            <div class="songListbox" ref="songListbox">
              <div class="item" v-for="(item, index) in MList" :id="['item-'+index]" @click="clickSong(index)">
                {{MList[index].title}}
              </div>
            </div>
            <div class="songListBtn" ref="songListBtn" @click="toSknowledge(),isClose">查看专栏</div>
          </div>
        </div>
      </div>
    </transition>
    <div class="player-nav" ref="bottomNav">
      <div class="coldiv">
        <span class="baricon slist" @click="isShow(),isBg()"></span>
        <span class="baritxt" @click="isShow(),isBg()">小知识</span>
      </div>
      <div class="coldiv">
        <span class="baricon shoucang" :class="{active:is_collect==1}" @click="isCollFun()"></span>
        <span class="baritxt" @click="isCollFun()">收藏</span>
      </div>
    </div>

    <dialogBar ref="dialogBar"></dialogBar>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import DialogMob from '@/components/common/layer';
  export default {
    name: 'audioplayer',
    components: {
      'dialogBar': DialogMob,
    },
    data(){
      return{
        id: 0,
        bg:'',
        music: '',
        MList:'',
        showList: false,
        getEnd:false,
        duration:0,//音频长度
        playing:false,//是否播放中
        pos: {},
        startX: null,
        locked: false,
        distance: 0, //当前位置
        endDistance: 0, //上次操作结束位置
        transTime: .3, //点击拖动动画
        dragWidth: 0, //进度条宽度

        startNum: 0,
        currentTime: 0,

        is_collect:null,//是否收藏 0无 1是

        vod_url:null,
        music_pic:'',

      }
    },
    created(){
      this.getMusic(this.id)
    },
    mounted(){
      this.isBg();
      let playerH=document.documentElement.clientHeight;
      document.getElementById("audioplayer").style.height=playerH+'px';

      let dragbox=document.getElementById('dragbox').clientWidth;
      this.dragWidth =dragbox;


      let songListItems = this.$refs.songListItems.offsetHeight;
      let songListTitle = this.$refs.songListTitle.offsetHeight;
      let songListBtn = this.$refs.songListBtn.offsetHeight;
      let bottomNav = this.$refs.bottomNav.offsetHeight;

      this.$refs.playerbox.style.height = (playerH - bottomNav) + 'px';
      this.$refs.songListbox.style.height = (songListItems - songListTitle - songListBtn) + 'px';

      this.autoPlayAudio();
    },
    watch:{
      'bg':'isBg',
    },
    computed: {

    },
    methods:{
      autoPlayAudio() {
        let that=this;
        wx.config({
          debug: false,
          appId: '',
          timestamp: 1,
          nonceStr: '',
          signature: '',
          jsApiList: []
        });
        wx.ready(function() {
            that.isplay2();
        });
      },
      toggleModal(msg){
        let that = this;
        this.$refs.dialogBar.open({
          type: 2,
          content: msg,  // 内容
          shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
          button: ['确定'], // 按钮内容 默认 知道了
          no () {          // 点击确认回调
            that.$refs.dialogBar.close()
          }

        })
      },
      getxzs(type){

        let pid=this.MList[this.id].id;

        let ajaxURL ='/h5/general_knowledge_url/'+pid;
        let that=this;
        this.$axios.get(ajaxURL,{}).then(res => {
          res = res.data;
          let datalist=res.data;
          if (res.code == 0) {
            that.MList[that.id]=datalist.general_knowledge_info;
            that.is_collect= datalist.role.is_collect;
            that.vod_url= datalist.general_knowledge_info.vod_url;
            that.music_pic= datalist.general_knowledge_info.pic;
            if(type!="created"){
              that.isplay2();
            }
          }
          else {
            that.toggleModal(res.msg);
          }
        })
      },

      getMusic(p){
          let musicList= localStorage.getItem('music_list');
          musicList=JSON.parse(musicList)
          this.MList = musicList;
          this.getxzs("created");
      },
      /*查看当前audio是否正在播放，如果停止，那么播放下一曲*/
      audio_length(){
        let that=this;

        if(document.getElementById("audio")&&this.duration==0){
          setTimeout(function () {
            that.audio_length();
            let audioL= document.getElementById("audio");
            that.duration = Math.ceil(audioL.duration);
          },1000);

        }

      },
      audio_currentTime(){
        let that=this;
        if(document.getElementById("audio")){
          let audioL=document.getElementById("audio");
          this.currentTime = Math.ceil(audioL.currentTime);
          if(that.distance!="100%"){
            setTimeout(function () {
              that.audio_currentTime();
              that.distance=(that.currentTime/that.duration)*100+'%';
            },1000);
          }
        }

      },

      timestyle(time){
        let hours = this.formate(Math.floor(time/(60*60)));
        let minute = this.formate(Math.floor(time/60));
        let second = this.formate(Math.floor(time%60));
        let timetxt;
        if(hours>0){
           timetxt=hours+':'+minute+':'+second;
        } else {
           timetxt= minute+':'+second;
        }

        return timetxt;
      },
      formate (time) {
        if(time>=10){
          return time
        }else{
          return '0'+time
        }
      },

      isPlay(type){
        if(type!="play"){
          this.getxzs();
        } else {
          this.isplay2();
        }

      },
      isplay2(){
        this.audio_length();
        this.audio_currentTime();
        this.playing=true;

        document.getElementById("audio").play();
        document.getElementById("play").style.display="none";
        document.getElementById("stop").style.display="inline";
        document.getElementById("audio-img").style.animationPlayState="running";
        document.getElementById("audio-fm").style.animationPlayState="running";

      },
      isStop(){
        document.getElementById("audio").pause();
        document.getElementById("stop").style.display="none";
        document.getElementById("play").style.display="inline";
        document.getElementById("audio-img").style.animationPlayState="paused";
        document.getElementById("audio-fm").style.animationPlayState="paused";
        this.playing=false;
      },
      isNext(){
        let len=this.MList.length-1;
        if(this.MList.length==1){
          return false
        }
        if(this.id==len){
          this.id=0;
        } else {
          this.id++;
        }
        /*为了防止停止状态下，点击下一曲的时候，停止图标不出现，并且专辑图片不转动*/
        document.getElementById("play").style.display="none";
        document.getElementById("stop").style.display="inline";
        document.getElementById("item-"+ this.bg).style.background='none';
        document.getElementById("audio-img").style.animationPlayState="running";
        document.getElementById("audio-fm").style.animationPlayState="running";
        let that=this;
        this.currentTime=0;
        this.distance=0;
          that.isPlay();

      },
      isPre(){
        let len=this.MList.length-1;
        if(this.MList.length==1){
            return false
        }
        if(this.id==0){
          this.id=len;
        } else {
          this.id--;
        }
        document.getElementById("play").style.display="none";
        document.getElementById("stop").style.display="inline";
        document.getElementById("audio-img").style.animationPlayState="running";
        document.getElementById("audio-fm").style.animationPlayState="running";
        let that=this;
        this.currentTime=0;
        this.distance=0;

        that.isPlay();

      },
      isShow(){
        this.showList = true;
      },
      isClose(){
        this.showList = false
      },
      isBg(){
        this.bg = this.id;
        document.getElementById("item-"+this.bg).style.background='#F2F2F2';
      },
      /*点击列表中的歌曲，并播放*/
      clickSong(i){
        this.id = i;
        document.getElementById("item-"+this.bg).style.background='none';
        document.getElementById("play").style.display="none";
        document.getElementById("audio-img").style.animationPlayState="running";
        document.getElementById("audio-fm").style.animationPlayState="running";
        this.isBg();
        this.showList = false;
        let that=this;
        this.currentTime=0;
        this.distance=0;

        that.isPlay();

      },

      mousePos: function(e) {
        var pos = {};
        pos.x = e.pageX;
        this.pos = pos;
        return pos;
      },
      timeDown: function(e) { // 当鼠标指针移动到元素上方，并按下鼠标左键时
        this.transTime = 0;
        this.mousePos(e);
        this.startX = this.pos.x;
        this.locked = true;
        this.endDistance = this.distance;
      },
      timeMove: function(e) { // 当鼠标指针移动到元素上方移动时
        if (!this.locked) return;
        let pos = this.mousePos(e);
        let progressL=this.$refs.progressL.offsetWidth;
        let moveX = (pos.x/progressL)*this.duration;

        this.distance = (x/progressL)*100 + '%';

        if (this.distance >= 1) {
          this.distance ="100%";
        } else {
          if ((this.distance <= 0 && moveX < 0) || (this.distance >= 1)) return;
          this.distance = (x/progressL)*100 + '%';
          this.endDistance=this.distance;

        }
        let myVid=document.getElementById("audio");
        myVid.currentTime= moveX;
        myVid.play();
      },
      timeEnd: function(e) {
        this.transTime = .3;
        this.locked = false;
      },
      timeClick: function(e) { //点击拖动到指定位置
        let progressL=this.$refs.progressL.offsetWidth;
        var x = e.offsetX,
        moveX = (x/progressL)*this.duration;

        this.distance = (x/progressL)*100 + '%';
        let myVid=document.getElementById("audio");
        myVid.currentTime= moveX;
        myVid.play();

      },

      isCollFun(){// 是否收藏
        if (this.is_collect == 0) {
          let that = this;
          let ajaxURL = '/h5/user_collect'
          this.$axios.post(ajaxURL, {
            collect_type: 3,//   收藏顶级分类：1课程 2游戏 3小知识
            category_id: 0,//二级分类id：课程、专栏时、小知识：0,游戏时：1正在挑战 2每日推荐
            goods_type: 0,//类型 0课程 1专栏
            goods_id: that.MList[that.id].id,//标识id
          }).then(res => {
            res = res.data;
            if (res.code == 0) {
              that.MList[that.id].is_collect= 1;
              that.is_collect=1;
            }
            else {
              that.toggleModal(res.msg);
            }
          })
        } else {
          let that = this;
          let ajaxURL = '/h5/user_collect_cancle'
          this.$axios.post(ajaxURL, {
            collect_type: 3,//   收藏顶级分类：1课程 2游戏 3小知识
            category_id: 0,//二级分类id：课程、专栏时、小知识：0,游戏时：1正在挑战 2每日推荐
            goods_type: 0,//类型 0课程 1专栏
            goods_id: that.MList[that.id].id,//标识id
          }).then(res => {
            res = res.data;
            if (res.code == 0) {
              that.MList[that.id].is_collect= 0;
              that.is_collect = 0
            }
            else {
              that.toggleModal(res.msg);
            }
          })
        }
      },


    }
  }
</script>

<style lang="scss">
  @keyframes changDeg{
    0%{
      transform: rotate(0deg);
    }
    100%{
      transform: rotate(360deg);
    }
  }
  .audio-img,.audio-fm{
    &.animation{
       animation:changDeg 10s linear 1s infinite;
     }
  }

</style>
