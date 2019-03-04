<template>
   <div class="musicPlayer clearfix" :hidePlayer="hidePlayer">
        <div class="fl" style="width: 2.5rem; height:0.4rem;font-size:0" @click="toMusicPlayer()">
            <div class="musicPic">
                <img id="activeSongPic" class="musicAnimation" :src="activeSong.pic">
                <span class="smallyuan"></span>
            </div>
            <div class="musicName">{{activeSong.title}}
              <audio id="audioPlayer" preload="auto" :src="vod_url"  @ended="next_song"></audio>
            </div>
        </div>
        <div class="fr" style="width:0.95rem;">
          <!--播放-->
            <div class="musicPlay" :class="{playStop:is_play}" @click="play_song()"></div>
          <!--关闭-->
            <div class="musicClose" v-show="!is_play" @click="play_hide()"></div>
        </div>

    </div>
</template>

<script>
import wx from 'weixin-js-sdk'
export default {
    name: 'player',
    props: {
      list: Array,
      hidePlayer:{
        type:Function,
        default :''
      }
    },
    data () {
      return {
        is_play:false,
        activeIndex:0,
        activeSong:'',
        vod_url:null,
      }
    },
    created(){
      this.curSong();
    },
    methods:{
      curSong(){
          this.activeSong=this.list[this.activeIndex];
          this.vod_url=this.list[this.activeIndex].vod_url;
      },
      autoPlayAudio() {
        let that=this;
        wx.config({});
        wx.ready(function() {
          that.is_play=true;
          document.getElementById("audioPlayer").play();
          document.getElementById("activeSongPic").style.animationPlayState="running";
        });
      },
      toMusicPlayer(){
        this.$router.push({path:'/m/audioplay'})
      },
      play_hide(){
        this.hidePlayer()
      },
      next_song:function () {
        // 播放下一首歌曲
        this.activeIndex++;
        if(this.activeIndex==this.list.length){
          this.is_play=false;
          document.getElementById("audioPlayer").pause();
          document.getElementById("activeSongPic").style.animationPlayState="paused";
        } else {
          this.is_play=true;
          this.curSong();
          document.getElementById("audioPlayer").play();
          document.getElementById("activeSongPic").style.animationPlayState="running";
        }

      },
      play_song(){
          console.log(this.is_play)
        if(this.is_play){
          document.getElementById("audioPlayer").pause();
          document.getElementById("activeSongPic").style.animationPlayState="paused";
        } else {
          document.getElementById("audioPlayer").play();
          document.getElementById("activeSongPic").style.animationPlayState="running";
        }
        this.is_play=!this.is_play;
      },
    },
    computed: {
//        // 时刻监听 play_songs 和 current_index的属性变化，时刻更新 current_song 变量
//        current_song:function () {
//            // console.log(this.current_index)
//            return this.list[this.currentindex].src
//        }
    },
    mounted(){
      this.autoPlayAudio();
    },

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

  .musicAnimation{
    animation:changDeg 10s linear 1s infinite;
  }

</style>
