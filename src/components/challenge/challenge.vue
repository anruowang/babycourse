<template>
  <div style="height: 100%; background-color: #fff">
    <div class="challenge-main">
      <div class="ban-pic">
        <img :src="game_info.pic" alt="">
      </div>
      <div class="introduce">{{game_info.introduce}}</div>
      <div class="challenge-list">
        <div class="list-title">作品展示</div>
        <div class="list-body">
          <div class="video-item" v-for="(item,index) of game_video" :key="index" @click="toVideo(item.id)">
            <img :src="item.pic" />
            <span class="subtxt" v-if="item.vod_user_type==1">官方</span>
            <span class="subtxt" v-if="item.vod_user_type==2">我的</span>
          </div>
        </div>
      </div>
    </div>
    <div class="buy-bar">
      <span class="coll-icon" :class="{iscoll:is_collect==1}" @click="isCollFun()">
        收藏
      </span>
      <button class="submit-btn" @click="toChallenge()">我要挑战</button>
    </div>


    <dialogBar ref="dialogBar"></dialogBar>

  </div>
</template>
<script>
  import Footer from '@/components/common/Footer'
  import DialogMob from '@/components/common/layer'
  export default {
    name: 'challenge',
    components:{
      'dialogBar': DialogMob,
      Footer,
    },
    data () {
      return {
        is_collect:null,
        game_info:{},//游戏详情
        game_video:[],//作品展示：视频信息
        baby_list:[],
      }
    },
    created(){
      this.getGameInfo();
      this.getBabyInfo();
    },
    mounted(){
//      this.getGameInfo();
    },

    methods: {

      getGameInfo:function () {
        let that=this;
        let ajaxURL ='/h5/game_info';
        this.$axios.post(ajaxURL, {
          game_id:this.$route.query.game_id,
        }).then(res => {
          let data = res.data.data;
          if (res.data.code == 0) {
            that.game_info=data.game_info;
            that.game_video=data.game_video;
            this.is_collect=data.role.is_collect;
            document.title=data.game_info.name;
          }
          else {
            that.toggleModal(res.data.msg);
            return false;
          }
        })
      },
      getBabyInfo:function () {
        let that=this;
        let ajaxURL ='/h5/baby_list';
        this.$axios.post(ajaxURL, {
          game_id:this.$route.query.game_id,
        }).then(res => {
          let data = res.data.data;
          if (res.data.code == 0) {
            that.baby_list=data.list;
          }
          else {
            that.toggleModal(res.data.msg);
            return false;
          }
        })
      },

      toVideo(id){
        this.$router.push({path:'/m/challenge_video',query:{is_game:1,p_id:id,game_id:this.$route.query.game_id}})
      },

      isCollFun(){// 是否收藏
        let goods_id=this.$route.query.game_id;
        if (this.is_collect == 0) {
          let that = this;
          let ajaxURL = '/h5/user_collect'
          this.$axios.post(ajaxURL, {
            collect_type: 2,//  收藏顶级分类：1课程 2游戏 3小知识
            category_id:1,//二级分类id：课程、专栏时、小知识：0,游戏时：1正在挑战 2每日推荐
            goods_type: 0,//类型 0课程 1专栏
            goods_id:goods_id,//标识id
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
            collect_type:2,//   收藏顶级分类：1课程 2游戏 3小知识
            category_id:1,//二级分类id：课程、专栏时、小知识：0,游戏时：1正在挑战 2每日推荐
            goods_type: 0,//类型 0课程 1专栏
            goods_id:goods_id,//标识id
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

      toChallenge(){
        if(this.baby_list.length>0){
          this.$router.push({path: '/m/evaluate', query: {type: 1,cloumn:"challenge", game_id: this.now_video_id}})
        } else {
          let that=this;
          this.$refs.dialogBar.open({
            type: 2,
            content:"请先添加宝宝信息",  // 内容
            shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
            button: ['取消','确定'], // 按钮内容 默认 知道了
            no () {          // 点击确认回调
              that.$refs.dialogBar.close();
            },
            yes () {          // 点击确认回调
              that.$refs.dialogBar.close();
              that.$router.push({path:'/m/addbaby'})
            }

          })
        }
      }


    },

  };
</script>
<style lang="scss" scoped>
  @import "challenge_style.scss";

</style>
