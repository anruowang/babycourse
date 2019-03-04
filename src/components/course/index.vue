<template>
  <div>
    <div class="banner-pic">
      <div v-if="is_video_audio==false" class="isbuy" @click="getCourse_url()">
        <img class="ban-img" :src="course_info.cover">
        <span class="play-icon"></span>
      </div>

      <div v-if="is_video_audio" class="is_video_audio" >
        <img v-if="course_info.course_type==2"  class="ban-img" :src="course_info.cover">
        <audio v-if="course_info.course_type==2" class="audio" id="audio" :src="course_url"  controls="controls"></audio>
        <video v-if="course_info.course_type==3" class="video" id="video" :src="course_url" :poster="course_info.cover"
               preload="auto"
               playsinline
               webkit-playsinline="true"
               x5-video-player-type="h5"
               x5-video-player-fullscreen="true"
               controls="controls"
               airplay="allow"

        ></video>

      </div>


    </div>
    <div class="child-mian nobuy">
      <div class="column-top white-bg">
        <div style="padding: 0.15rem">
          <div class="title-box clearfix">
            <span class="mark">课程</span>
            <strong class="title">{{course_info.title}}</strong>
          </div>
          <div class="price free" v-if="course_info.money_type==1">免费</div>
          <div class="price" v-if="course_info.money_type==2 && course_info.limit_time_open==2">¥{{$commonModel.returnFloat(course_info.money)}}</div>
          <div class="learning-info clearfix">
            <div class="fl">
              <span>{{course_info.start_time}}</span>
              <span> | </span>
              <span>{{course_info.study_count}}人在学习</span>
            </div>
            <div class="fr">
              <!--money_type==2收费程课，购买送人-->
              <span v-if="course_info.money_type==2" class="btn54x22" @click="songren()">送人</span>
              <!--money_type==1免费程课，分享地址-->
              <span v-if="course_info.money_type==1" class="btn54x22" @click="course_share()">送人</span>
              <!--<span class="btn54x22" @click="course_share()">分享</span>-->
            </div>
          </div>
        </div>
        <!--限时特价-->
        <div class="limit-money-box" v-if="course_info.money_type==2 && course_info.limit_time_open==1 && limitday">
          <div class="price-box">
            <dl>
              <!--<dt><span class="fs18">¥</span><span>{{$commonModel.returnFloat(course_info.limit_time_money)}}</span></dt>-->
              <dt v-if='zhengshu'>
                <span class="fs18">¥</span><span>{{limitPrice}}</span>
              </dt>
              <dt v-if='xiaoshu'>
                <span class="fs18">¥</span><span>{{limitPrice1}}</span><span class="fs18">.{{limitPrice2}}</span>
              </dt>
              <dd>
                <div class="old-money">原价 ¥{{$commonModel.returnFloat(course_info.money)}}</div>
                <div class="tips">限时活动价格</div>
              </dd>
            </dl>
          </div>
          <!--倒计时-->
          <div v-if="course_info.limit_time_open==1">
            <limitCuntDown :endTime="endTime" :shuaxin="shuaxin"/>
          </div>


        </div>

      </div>
      <div class="column-content white-bg">
        <ul class="child-tab">
          <li :class="{active:tab_cur==1}" @click="swich_tab(1)"><span>详情</span></li>
          <li :class="{active:tab_cur==2}" @click="swich_tab(2)"><span>评价</span></li>
        </ul>
        <!--详情-->
        <div v-show="tab_cur==1">
          <div v-show="isDetailsHtml==''" class="nodata">暂无数据</div>
          <div v-show="isDetailsHtml!=''"class="detailsHtml" id="detailsHtml"></div>
        </div>
        <!--详情END-->
        <!--评价-->
        <div v-show="tab_cur==2">
          <div v-if="comment_list.length<1" class="nodata">暂无评论内容</div>
          <div v-if="comment_list.length>0" class="comment-list">
            <div class="comment-item" v-for="(item,index) of comment_list" :key="index">
              <div class="comment-left">
                <div class="user-pic"><img :src="item.user_pic[0]" /></div>
              </div>
              <div class="comment-right">
                <div class="nick-name"><strong>{{item.nickname}}</strong> <span class="send-tiem">{{$commonModel.format(item.create_time)}}</span></div>
                <div class="comment-content">
                  <p>{{item.content}}</p>
                  <div class="source-list" v-if="item.source_url!=0">
                    <span class="picitem" v-for="picitem of item.source_url" @click="comment_pic_show(picitem)">
                      <img :src="picitem">
                    </span>
                  </div>
                  <div class="comment-bottom">
                    <span class="dianzan" :class="{islike:item.is_like==1}" @click="dianzan(item)">{{item.like_amount}}</span>
                    <!--<span class="pinglun">{{item.comment_amount}}</span>-->
                  </div>
                </div>
              </div>
            </div>
            <div v-if="comment_list_has" class="pinglun-add" @click="getcomment()">查看更多评论</div>
            <div v-if="comment_list_has==false" class="pinglun-add">没有更多评论了</div>
          </div>
        </div>
        <!--评价END-->
      </div>
      <!--用户信息-->
      <div class="column-user-info white-bg">
        <ul>
          <li class="user-img fl">
            <img :src="user_info.small_user_pic">
          </li>
          <li class="fl user-txt">
            <div class="nick-name">{{user_info?user_info.nickname:''}}</div>
            <div>{{user_info.be_concern_count}}人关注</div>
          </li>
          <li class="fr">
            <span class="btn54x22" :class="{gray:is_concern==1}" @click="isConcernFun()">{{concern_text}}</span>
          </li>
        </ul>
      </div>

    </div>
    <div class="buy-bar" v-if="isBuy==0">
      <span class="coll-icon" :class="{iscoll:is_collect==1}" @click="isCollFun()">
        收藏
      </span>
      <button class="submit-btn" @click="baoming">立即报名</button>
    </div>
    <div class="buy-bar" v-if="isBuy==1" style=" text-align: center">
      <button class="submit-btn" style="float:none;" @click="to_comment()">评价</button>
    </div>

    <div v-if="share_mask_show" class="sharemask" @click="mask_hide()">
      <div class="shareImg"><img src="../../assets/share_tips.png"></div>
    </div>

    <transition name = "fade">
      <div class="show_big_pic" v-show = "show_big_pic" @click="comment_pic_hide()">
        <div class="tableshow"><div class="cell"><img :src="show_pic_url"></div></div>
      </div>
    </transition>

    <dialogBar ref="dialogBar"></dialogBar>
  </div>
</template>
<script>
  import axios from '@/components/apis/index'
  import Footer from '@/components/common/Footer'
  import DialogMob from '@/components/common/layer'
  import {commonShare, shareTitle, shareUrl, shareImg, shareDesc} from "@/components/common/wxshare";
  import limitCuntDown from "@/components/common/countDown";

  import  WXPay from "@/components/pay/wxpay";

  export default {
    name: 'column',
    components:{
      'dialogBar': DialogMob,
      limitCuntDown,
    },
    data () {
      return {
        nodata:false,
        user_info:{},
        this_column:null,//本课程专栏信息
        course_info:{},//课程详情
        column_money_type:null,//专栏付费类型 1免费 2 付费

        listdata: [],  // 上拉加载更多的数据存放数组
        list_has:true,//是否还有更多
        is_collect:null,//是否收藏 0无 1是
        is_concern:null,//是否关注 0无 1是
        concern_text:'',

        share_mask_show:false,//就否显示分享提示

        readable:null,//是否可读
        isDetailsHtml:'',
//        endTimes:'1545146603000',
        endTimes:'',
        islimitres:true,
        limitday:false,//限时大于100天不显示

        zhengshu:false,
        xiaoshu:false,
        limitPrice:null,
        limitPrice1:null,
        limitPrice2:null,

        isBuy:null,//是否已购买，0未购买，1已购买

        //评论参数
        comment_limit_id:0,//评论请求下一页数据，传上一页的最后一条ID
        comment_list:[],
        comment_list_num:10,//每一次获取的评价数，后台设定10条
        comment_list_has:true,
        comment_i:-1,
        //放大评论图片
        show_big_pic:false,
        show_pic_url:'',

      //获取视频音频信息
        video_audio_info:{},
        course_url:'',
        is_video_audio:false,


      }
    },
    watch:{
      isDetailsHtml(curVal,oldVal){
        this.detailsHtmlFun()
      }
    },
    mounted(){
      this.init();
      this.course_share("init");//分享默认获取图片
      this.getcomment();

    },
    computed:{
      tab_cur(){
        return this.$store.state.courseMod.tab_cur;
      },
      endTime(){
        return this.endTimes
      }

    },
    methods: {
      init: function () {
        let that = this;
        let ajaxURL = '/h5/course_info/' + this.$route.query.queryid;
        this.$axios.post(ajaxURL, {
          lzid: this.$route.query.lzid,//分享人id lzid=12345678&uf=1&st=1(选填)
          uf: this.$route.query.uf,//用户来源 0平台 1助手 2机器人(选填)
          st: this.$route.query.st,//分享的渠道0链接 1sharefriend/2sharefriendcircle/3sharecard/4app(选填)
        }).then(res => {
          res = res.data;
          const data = res.data;
          if (res.code == 0) {

            that.this_column = data.column_info;
            console.log(data.column_info);
            if(JSON.stringify(that.this_column) != "{}"&&that.this_column.length>0){
              if(data.course_info.money_type==2&&data.course_info.is_buy==0){
                that.$refs.dialogBar.open({
                  type: 2,
                  content: "该课程必须先购买专栏！",  // 内容
                  shadeClose: false, // 点击空白区域是否隐藏此弹出框  默认是false
                  button: ['确定'], // 按钮内容 默认 知道了
                  no () {          // 点击确认回调
                    that.$refs.dialogBar.close();
                    that.$router.replace({path:'/m/column',query:{queryid:that.this_column.id}})
                  }

                })
                return false;
              }
            }
            that.user_info = data.user_info;
            that.course_info = data.course_info;
//            that.course_info=data.course_info

            that.listdata = data.course_list;
            that.isBuy = data.course_info.is_buy;
            that.column_money_type = data.course_info.money_type;
            if (data.course_info.course_detail) {
              that.isDetailsHtml = data.course_info.course_detail;
              console.log(that.isDetailsHtml )
            } else {
              that.isDetailsHtml = '';
            }

            var value = Math.round(parseFloat(data.course_info.limit_time_money)) / 100;
            if (value % 1 !== 0) {
              that.zhengshu = false;
              that.xiaoshu = true;
              value = value.toFixed(2);
              that.limitPrice1 = value.split(".")[0];
              that.limitPrice2 = value.split(".")[1];
            } else {
              that.zhengshu = true;
              that.xiaoshu = false;
              that.limitPrice = value;
            }


            that.endTimes = data.course_info.limit_time_end;
            let endTime = new Date(data.course_info.limit_time_end)
            let nowTime = new Date();
            let leftTime = Math.floor((endTime.getTime() - nowTime.getTime()) / 1000);
            let maxday = Math.floor(leftTime / (24 * 60 * 60));
            if (maxday > 100) {//限时优惠多天100天不限制
              this.limitday = false;
            } else {
              this.limitday = true;
            }

            let role = data.role;
            that.is_collect = role.is_collect;//是否收藏 0无 1是
            that.is_concern = role.is_concern;//是否关注 0无 1是
            if(role.is_concern==1){
              that.concern_text="已关注"
            }else {
              that.concern_text="关注"
            }


            if (data.course_list.length > 0 || that.listdata.length > 0) {
              that.showList = true;
              that.nodata = false;
            } else {
              that.showList = false;
              that.nodata = true;
            }

          }
          else {
            that.toggleModal(res.msg);
          }
        })
      },
      swich_tab(num){
        this.$store.dispatch('changeCourseTab', num);
      },
      getCourse_url(){

          if(this.isBuy==1){
            let that = this;
            let ajaxURL = '/h5/course_url/'+this.$route.query.queryid
            this.$axios.post(ajaxURL, {
            }).then(res => {
              res = res.data;
              let data=res.data
              if (res.code == 0) {
                that.course_info=data.course_info;
                that.course_url=data.course_info.course_url;
                let course_type=data.course_info.course_type;
                if(course_type==4){
                  console.log(data.course_info.course_url)
                  that.is_video_audio=false;
                  window.location.href=data.course_info.course_url;
                }else if(course_type==2||course_type==3){
                  that.is_video_audio=true;
                  setTimeout(function () {
                      if(course_type==2){
                        let audio = document.querySelector('audio');
                        audio.play()
                      } else {
                        let video = document.querySelector('video');
                        video.play()
                      }

                  },1000)


                } else {
                  that.is_video_audio=false;
                }
              }
              else {
                that.toggleModal(res.msg);
              }
            })
          }
          else {
             this.toggleModal("您还未报名本课程！")
          }


      },

      showOtherVideo(){
        let _this = this;
        setTimeout(function(){
          var dom = document.getElementById('video');
          var flag = dom.paused;
          if(!flag){
            _this.showOtherVideo();
          }else{
            // _this.showOtherVideo();
            if(dom.currentTime == dom.duration && dom.currentTime!=0){
              //这里的判断是如果视频的总时间等于视频已经播放的时间，并且视频的播放时间不为零时
              //这个地方的就是写视频结束的时候的代码的地方
            }else{
              _this.showOtherVideo();
            }
          }
        },1000)
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
      detailsHtmlFun(id) {
        document.getElementById('detailsHtml').innerHTML = this.isDetailsHtml;
      },

      course_share(init){
        if(init!="init"){
            this.share_mask_show=true;
        } else{
          this.share_mask_show=false;
        }
        let title = this.course_info.title;
        let icon = this.course_info.cover;
        let url = window.location.href;
        commonShare(this, title, url, icon, '');
      },

      mask_hide(){
        this.share_mask_show=false;
      },
      isCollFun(){// 是否收藏
        if (this.is_collect == 0) {
          let that = this;
          let ajaxURL = '/h5/user_collect'
          this.$axios.post(ajaxURL, {
            collect_type: 1,//   收藏顶级分类：1课程 2游戏 3小知识
            category_id: 0,//二级分类id：课程、专栏时：0 游戏时：1正在挑战 2每日推荐
            goods_type: 0,//类型 0课程 1专栏
            goods_id: that.course_info.id,//标识id
          }).then(res => {
            res = res.data;
            if (res.code == 0) {
              this.is_collect = 1
            }
            else {
              that.toggleModal(res.msg);
            }
          })
        } else {
          let that = this;
          let ajaxURL = '/h5/user_collect_cancle'
          this.$axios.post(ajaxURL, {
            collect_type: 1,//   收藏顶级分类：1课程 2游戏 3小知识
            category_id: 0,//二级分类id：课程、专栏时：0 游戏时：1正在挑战 2每日推荐
            goods_type: 0,//类型 0课程 1专栏
            goods_id: that.course_info.id,//标识id
          }).then(res => {
            res = res.data;
            if (res.code == 0) {
              this.is_collect = 0
            }
            else {
              that.toggleModal(res.msg);
            }
          })
        }
      },
      isConcernFun(){//是否关注
        let that = this;
        let guanzhuid = '';
        if (this.is_concern == 0) {
          guanzhuid = 1;
        } else {
          guanzhuid = 0;
        }
        let ajaxURL = '/h5/fans_like'
        this.$axios.post(ajaxURL, {
          type: guanzhuid,//1关注 2取消关注
          like_id: this.user_info.id,//被关注人ID
        }).then(res => {
          res = res.data;
          if (res.code == 0) {
            that.is_concern = guanzhuid
            if(that.is_concern==1){
              that.concern_text="已关注"
            }else {
              that.concern_text="关注"
            }
          }
          else {
            that.toggleModal(res.msg);
          }
        })
      },

      shuaxin(over){//倒计时结束后刷新请求
        if (over && this.islimitres) {
          this.init();
          this.islimitres = false;
          this.course_share("init");//分享默认获取图片

        }
      },
      baoming(){//立即报名

        if(this.is_buy==1){ //是否购买 0 无 1已购买
          this.$refs.dialogBar.open({
            type: 2,
            content: "您已经报名了！",  // 内容
            shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
            button: ['确定'], // 按钮内容 默认 知道了
            no () {          // 点击确认回调
              that.$refs.dialogBar.close()
              that.init();
            }
          })
          return false
        } else {
          this.to_pay(0)
        }

      },
      songren(){//送人
        this.to_pay(1)
      },
      to_pay(num){

        let orderData = {
          goods_id: this.$route.query.queryid,//课程或专栏id
//          goods_type:1, //类型 默认0 0课程 1专栏
          is_present: num,//不赠送 1赠送
          lzid: this.$route.query.lzid,// 邀请人id
          uf: this.$route.query.uf ? this.$route.query.uf : 0,//用户来源 0平台 1助手 2机器人(选填)
          st: this.$route.query.st,//分享的渠道0链接 1sharefriend/2sharefriendcircle/3sharecard/4app(选填)
        }
        this.$router.push({path: '/m/course_pay', query: orderData})
      },
      payCallback(payed,msg){
        let that=this;
        if(payed==1){
          this.$refs.dialogBar.open({
            type: 2,
            content: msg,  // 内容
            shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
            button: ['确定'], // 按钮内容 默认 知道了
            no () {          // 点击确认回调
              that.$refs.dialogBar.close();
              that.init();//确定后初始化
            }
          })
        } else {
          that.toggleModal(msg)
        }

      },
      //请求评论接口
      getcomment(){
        let that = this;
        let ajaxURL = '/h5/post_list';
        this.$axios.post(ajaxURL, {
          bar_id: this.$route.query.queryid,//专栏id
          limit_id: that.comment_limit_id,//列表最小id
          h_type: 4,//1、游戏挑战 2、游戏每日推荐 3、成长日记 4、课程、专栏
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
            console.log(that.comment_list)
          }
          else {
            that.toggleModal(res.msg);
          }
        })
      },
      comment_pic_show(url){//查看评论大图
        this.show_pic_url=url;
        this.show_big_pic=true;
      },
      comment_pic_hide(){//关闭评论大图
        this.show_pic_url='';
        this.show_big_pic=false;
      },
      //点赞取消点赞
      dianzan(item){
        let act='';
        if(item.is_like==1){//是否点赞 0：否 1：是
          act="del"
        } else {
          act="add"
        }
        let that = this;
        let ajaxURL = '/h5/post_like';
        this.$axios.post(ajaxURL, {
          post_id: item.id,//评论id
          act: act,//del:取消点赞，add：点赞
        }).then(res => {
          res = res.data;
          if (res.code == 0) {
            if(item.is_like==1){
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

      //评价
      to_comment(){
          this.$router.push({path:'/m/evaluate',query:{type:4,game_id:this.$route.query.queryid,column_id:this.this_column.id}});
      },

    }
  };
</script>
<style lang="scss" scoped>
  @import "../../css/head_tab.scss";
  @import "../../css/column_style.scss";
</style>
