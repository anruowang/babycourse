<script src="../common/video/video.js"></script>
<template>
  <div style="width: 100%;height: 100%">
    <div v-show="prevptips" style="position: fixed; top:0; width: 100%; text-align: center; z-index: 2000">
      <span style="font-size: 0.14rem; color: #eee">这是第一页了</span>
    </div>
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide v-if="list.length>0" v-for="(item,index) of list" :key="index" style="background-color: #000 ; position: relative;">
          <video class="video"
                 autoplay="false"
                 :src="item.video_url"
                 :id="setid(index)"
                 playsinline
                 webkit-playsinline="true"
                 x5-video-player-type="h5"
                 x5-video-player-fullscreen="true"
                 controls="controls"
                 airplay="allow"
                 style="width: 100%;max-height: 100%; display: block; object-fit: fill;">

          </video>
          <ul class="tools-bar">
            <li @click="dianzan(item)">
              <span class="v-coll-icon" :class="{islike:item.is_like==1}"></span>
              <span>{{$commonModel.wan_w(item.like_amount)}}</span>
            </li>
            <li @click="getcomment(item)">
              <span class="v-comment-icon"></span>
              <span>{{$commonModel.wan_w(item.comment_amount)}}</span>
            </li>
            <li @click="shareMaskShow()">
              <span class="v-share-icon"></span>
              <span>分享</span>
            </li>
            <li v-if="item.is_my==1" @click="del_video(item,index)">
              <span class="v-del-icon" co></span>
              <span>删除</span>
            </li>
          </ul>

      </swiper-slide>
    </swiper>
    <dialogBar ref="dialogBar"></dialogBar>


    <!---->
    <div v-show="nexttips" style="position: fixed; bottom:0; width: 100%; text-align: center; z-index: 2000">
      <span style="font-size: 0.14rem; color: #eee">已经到底了</span>
    </div>
    <!--评论-->
    <div ref="commentBar" class="comment-bar" :class="{show:comment_show}">
      <div ref="commentTitle" class="comment-title">
        <span class="close" @click="close_comment()"></span>
        <span>{{comment_amount}}条评论</span>
      </div>
      <div v-show="comment_list.length<1" class="nodata">暂无评论内容</div>
      <div ref="commentListBox" v-show="comment_list.length>0" class="comment-list">
        <div class="comment-item" v-for="(cmitem,index) of comment_list" :key="index">
          <div class="comment-left">
            <div class="user-pic"><img :src="cmitem.user_pic[0]"/></div>
          </div>
          <div class="comment-right">
            <div class="nick-name"><strong>{{cmitem.nickname}}</strong> <span class="send-tiem">{{$commonModel.format(cmitem.create_time)}}</span>
            </div>
            <div class="comment-content">
              <p>{{cmitem.content}}</p>
              <div class="source-list" v-if="cmitem.source_url!=0">
                <span class="picitem" v-for="picitem of cmitem.source_url"><img :src="picitem"></span>
              </div>
              <div class="comment-bottom">
                <!--<span class="dianzan" :class="{islike:cmitem.is_like==1}" @click="dianzan(cmitem)">{{cmitem.like_amount}}</span>-->
                <!--<span class="pinglun">{{item.comment_amount}}</span>-->
              </div>
            </div>
          </div>
        </div>
        <div v-if="comment_list_has" class="pinglun-add" @click="getcomment()">查看更多评论</div>
        <div v-if="comment_list_has==false" class="pinglun-add">没有更多评论了</div>
      </div>
      <div ref="commentBtn" class="to-comment" @click="to_comment()">说点什么吧...</div>
    </div>

    <div v-if="share_mask_show" class="sharemask" @click="mask_hide()">
      <div class="shareImg"><img src="../../assets/share_tips.png"></div>
    </div>

  </div>
</template>

<script>
  import {swiper, swiperSlide} from 'vue-awesome-swiper';
  import DialogMob from '@/components/common/layer';
  import {commonShare, shareTitle, shareUrl, shareImg, shareDesc} from "@/components/common/wxshare";
  export default {
    name: 'challengevideo',
    components: {
      'dialogBar': DialogMob,
    },
    data () {
      return {
        p_id:null,//视频id
        is_game:this.$route.query.is_game||1,
        list:[],
        idlist:[],
        prev_video:'',
        now_video:'',
        next_video:'',
        prev_video_id:'',
        now_video_id:'',
        next_video_id:'',
        activeSwiper:0,
        prevptips:false,
        nexttips:false,
        is_like:null,
        video_title:'',

        shareimg:'',//分享图片
        share_mask_show:false,

        //评论
        comment_show:'',
        comment_id:'',
        comment_limit_id:0,//评论请求下一页数据，传上一页的最后一条ID
        comment_list:[],
        comment_list_num:10,//每一次获取的评价数，后台设定10条
        comment_list_has:true,
        comment_amount:0,

        post_id:null,

        swiperOption: {
          loop:false,
          notNextTick: true,//notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          direction: 'vertical',//水平方向移动
          grabCursor: true,//鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状
          setWrapperSize: true,//Swiper使用flexbox布局(display: flex)，开启这个设定会在Wrapper上添加等于slides相加的宽或高，在对flexbox布局的支持不是很好的浏览器中可能需要用到。
          autoHeight: true,//自动高度。设置为true时，wrapper和container会随着当前slide的高度而发生变化
          slidesPerView: 1,//设置slider容器能够同时显示的slides数量(carousel模式)。可以设置为数字（可为小数，小数不可loop），或者 'auto'则自动根据slides的宽度来设定数量。loop模式下如果设置为'auto'还需要设置另外一个参数loopedSlides。
          mousewheel: false,//开启鼠标滚轮控制Swiper切换。可设置鼠标选项，默认值false
          mousewheelControl: false,//同上
//          height: window.innerHeight, // 高度设置，占满设备高度
          height:document.documentElement.clientHeight,
          resistanceRatio: 0,//抵抗率。边缘抵抗力的大小比例。值越小抵抗越大越难将slide拖离边缘，0时完全无法拖离。本业务需要
          observeParents: true,//将observe应用于Swiper的父元素。当Swiper的父元素变化时，例如window.resize，Swiper更新
          observer:true,//修改swiper自己或子元素时，自动初始化swiper
          //滑动之后回调函数
          on: {
            slidePrevTransitionEnd: () =>{
              let swiper = this.$refs.mySwiper.swiper;
              if(swiper.activeIndex==0){
                this.prevptips=true;
                let that=this;
                setTimeout(function () {
                  that.prevptips=false;
                },1500)
              }
            },
            slideChangeTransitionEnd: () => {
              let swiper = this.$refs.mySwiper.swiper;
//              let i = swiper.activeIndex;
              console.log(swiper.activeIndex);//切换结束时，告诉我现在是第几个slide

              this.activeSwiper=swiper.activeIndex;
              this.play(swiper.activeIndex);

            },
            reachEnd: () => {
              this.nextVideo()
            }

          },

        }
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    methods: {
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
      clickplay(index){
        let playActive = document.getElementById("video_" + index);
        if (playActive.paused) {
          playActive.play()
        } else {
          playActive.pause()
        }
      },
      setid(id){
        return "video_" + id;
      },

      play(index){
        setTimeout(function () {
          //            let swiperAcitve=document.querySelector(".swiper-slide-active");
          //            let playvideo=document.querySelector('video');
          if (index > 0) {
            let pausePrev = document.getElementById("video_" + (index - 1));
            pausePrev.pause();
            pausePrev.currentTime = 0;
          }
          let playActive = document.getElementById("video_" + index);
          let pauseNext = document.getElementById("video_" + (index + 1)) || undefined;
          if (pauseNext != undefined) {
            pauseNext.pause();
            pauseNext.currentTime = 0;
          }
          playActive.play();

        }, 2000)

      },

      getVideo: function (id) {
        let that = this;
        let ajaxURL = '/h5/game_video_info/';
        this.$axios.post(ajaxURL, {
          p_id: id,//视频id
          is_game: this.$route.query.is_game,//是否跟游戏有关 0否 1是
        }).then(res => {
          res = res.data;
          const data = res.data;
          if (res.code == 0) {
            this.now_video_id = id;
            if (that.idlist.indexOf(id) > -1) {
              let idlist = that.idlist;
              this.prev_video_id = idlist[idlist.indexOf(id)]
              if (idlist.indexOf(id) + 1 > idlist.length) {
                that.next_video_id = data.next_video.id;
                that.idlist.push(data.next_video.id);
                that.list.push(data.now_video);
              } else {
                this.next_video_id = idlist[idlist.indexOf(id) + 1]
              }

            } else {
              that.now_video = data.now_video;
              that.next_video_id = data.next_video.id;
              that.idlist.push(data.now_video.id);

            }
            if (data.game_info.name != '' && data.game_info.name != undefined) {
              document.title = data.game_info.name;
              that.video_title = data.game_info.name;
            }

            that.list.push(data.now_video);

          }
          else {
            that.toggleModal(res.msg);
          }
        })
      },
      nowVideo: function (id) {
        let video_id = '';
        if (id != undefined) {
          video_id = id;
          this.getVideo(video_id);
        } else {
          video_id = this.$route.query.p_id;
          if (localStorage.getItem("challenge_video_type") == "video") {
            this.idlist == JSON.parse(localStorage.getItem("challenge_id_list"));
            this.list = JSON.parse(localStorage.getItem("challenge_list"));
            let challenge_swiperinfo = JSON.parse(localStorage.getItem("challenge_swiperinfo"));
            this.prev_video = challenge_swiperinfo.prev_video;
            this.now_video = challenge_swiperinfo.now_video;
            this.next_video = challenge_swiperinfo.next_video;
            this.prev_video_id = challenge_swiperinfo.prev_video_id;
            this.now_video_id = challenge_swiperinfo.now_video_id;
            this.next_video_id = challenge_swiperinfo.next_video_id;
            this.activeSwiper = challenge_swiperinfo.activeSwiper;
            this.video_title = challenge_swiperinfo.video_title;

            localStorage.removeItem("challenge_id_list");
            localStorage.removeItem("challenge_list");
            localStorage.removeItem("challenge_swiperinfo");
            localStorage.removeItem("challenge_video_type");
          } else {
            this.getVideo(video_id);
          }

        }

      },
      prevVideo: function () {//上一页
        let video_id = this.prev_video_id;
        this.getVideo(video_id);
      },
      nextVideo: function () {//下一页
        let video_id = this.next_video_id;

        if (video_id != 0) {
          this.getVideo(video_id);
          this.nexttips = true;
          let that = this;
          setTimeout(function () {
            that.nexttips = false;
          }, 1500)
        }
        if (parseInt(this.list.length) < 3) {
          setTimeout(function () {
            let playActive = document.getElementById("video_0");
            playActive.play()
          }, 2000)
        }
      },
      //点赞取消点赞
      dianzan(item){
        let act = '';
        if (item.is_like == 1) {//是否点赞 0：否 1：是
          act = "del"
        } else {
          act = "add"
        }
        let that = this;
        let ajaxURL = '/h5/post_like';
        this.$axios.post(ajaxURL, {
          post_id: item.id,//评论id
          act: act,//del:取消点赞，add：点赞
        }).then(res => {
          res = res.data;
          if (res.code == 0) {
            if (item.is_like == 1) {
              item.is_like = 0;
              item.like_amount--
            } else {
              item.is_like = 1;
              item.like_amount++
            }

          }
          else {
            that.toggleModal(res.msg);
          }
        })
      },

      //请求评论接口
      getcomment(item){

        if (item && item.id == this.comment_id) {
          this.comment_show = !this.comment_show;
          return false
        }
        if (item) {
          this.comment_id = item.id;
          this.comment_show = !this.comment_show;
          this.comment_list = [];
          this.comment_limit_id = 0;
          this.comment_list_has = true;
          this.comment_amount = item.comment_amount;
        }

        let that = this;
        let ajaxURL = '/h5/post_comment_list';
        this.$axios.post(ajaxURL, {
          post_id: that.comment_id,//专栏id
          limit_id: that.comment_limit_id,//列表最小id
        }).then(res => {
          res = res.data;
          if (res.code == 0) {

            let list = res.data;
            if (list.length >= that.comment_list_num) {
              that.comment_list_has = true;
            } else {
              that.comment_list_has = false;
            }
            if (list && list.length > 0) {
              list.forEach(function (value) {
                that.comment_list.push(value);
              });
              that.comment_limit_id = list[list.length - 1].id;

            }
          }
          else {
            that.toggleModal(res.msg);
          }
        })
      },

      close_comment(){
        this.comment_show = !this.comment_show;
      },

      to_comment(){
        localStorage.setItem("challenge_list", JSON.stringify(this.list));
        localStorage.setItem("challenge_id_list", JSON.stringify(this.idlist));
        let challenge_swiperinfo = {
          prev_video: this.prev_video,
          now_video: this.now_video,
          next_video: this.next_video,
          prev_video_id: this.prev_video_id,
          now_video_id: this.now_video_id,
          next_video_id: this.next_video_id,
          activeSwiper: this.activeSwiper,
          video_title: this.video_title,
        }
        localStorage.setItem("challenge_swiperinfo", JSON.stringify(challenge_swiperinfo));
        let is_game = this.$route.query.is_game;
        this.$router.push({path: '/m/evaluate', query: {type: 1, is_game: is_game, game_id: this.now_video_id}})
      },

      shareMaskShow(id){
        this.share_mask_show=true;
      },
      mask_hide(){
        this.share_mask_show=false;
      },
      del_video(item,index){//删除
        let that=this;
        this.$axios.post('/h5/post_del', {
            h_type:1, post_id : item.game_info.id,game_id:item.now_vide.id
        }).then(
          res => {
            res = res.data;
            if(res.code == 0){
              that.updataSwiper(item,index);
            }else {
              this.toggleModal(res.msg);
              return false;
            }
          })
      },

      updataSwiper(item,index){
        this.idlist=this.idlist.splice(index,1);
        this.list=this.list.splice(index,1);
        if(this.list.length>=index){
          this.swiper.slideTo(index);
        }
        else{
          if(this.list.length>0){
            this.swiper.slideTo(index-1);
          } else {
            let that = this;
            this.$refs.dialogBar.open({
              type: 2,
              content: "暂无数据，3秒后返回首页",  // 内容
              shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
              button: ['确定'], // 按钮内容 默认 知道了
              no () {          // 点击确认回调
                that.$refs.dialogBar.close();
                that.$router.replace({path:'/m'})
              }
            });
            setTimeout(function () {
              that.$router.replace({path:'/m'})
            },3000);
          }
        }
      },


    },
    mounted() {
      this.nowVideo();
      let commentH = this.$refs.commentBar.offsetHeight;
      let commentT = this.$refs.commentTitle.offsetHeight;
      let commentBtnH = this.$refs.commentBtn.offsetHeight;
      this.$refs.commentListBox.style.height = (commentH - commentT - commentBtnH) + 'px';
      this.swiper.slideTo(this.activeSwiper)
    },
  }
</script>
<style lang="scss">
  @import "challenge_style.scss";

  .swiper-container {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  /*.swiper-slide{*/
  /*width:100%*/
  /*}*/
  /*.swiper-slide img{*/
  /*width:100%;*/
  /*height: 1.68rem*/
  /*}*/
</style>
