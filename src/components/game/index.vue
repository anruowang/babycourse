<template>
   <div class="gameEvaluate">
        <div class="gameDetails" v-html="game_details">{{game_details}}</div>
        <div class="evaluteList">
            <div class="title">看看大家怎么说<span>{{comment_amount}}</span></div>
        </div>
        <!--评价-->
        <div>
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
        <div class="buy-bar">
            <span class="coll-icon" :class="{iscoll:is_collect==1}" @click="isCollFun()">收藏</span>
            <button @click="game_share()" class="submit-btn">打卡</button>
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
  import dialogBar from '@/components/common/layer'
export default {
    name: 'game',
    components:{
        dialogBar
    },
    data () {
        return {
            game_info:[],
            game_details:null,

            listdata: [],  // 上拉加载更多的数据存放数组
            list_has:true,//是否还有更多
            is_collect:null,//是否收藏 0无 1是
            is_concern:null,//是否关注 0无 1是
            // concern_text:'',

            //评论参数
            comment_limit_id:0,//评论请求下一页数据，传上一页的最后一条ID
            comment_list:[],
            comment_list_num:10,//每一次获取的评价数，后台设定10条
            comment_list_has:true,
            comment_i:-1,
            //放大评论图片
            show_big_pic:false,
            show_pic_url:'',
            comment_amount:''

        }
    },
    methods:{
        game_recommend_info(){
            let gr_id=this.$route.query.queryid;
            this.$axios.post('/h5/game_recommend_info', {gr_id:gr_id}).then(res => {
                res = res.data;
                if (res.code == 0) {
                    const data = res.data;
                    this.game_info=data.game_recommend_info;
                    this.game_details=data.game_recommend_info.details;
                    this.comment_amount=data.game_recommend_info.comment_amount;
                    this.is_collect = data.role.is_collect;//是否收藏 0无 1是
                }
                else {
                    this.toggleModal(res.msg);
                }
            })

        },
        // 请求评论接口
        getcomment(){
            let that = this;
            if(!this.comment_list_has){
                return false
            }
            let ajaxURL = '/h5/post_list';
            this.$axios.post(ajaxURL, {
                bar_id: this.$route.query.queryid,//专栏id
                limit_id: that.comment_limit_id,//列表最小id
                h_type:2,//1、游戏挑战 2、游戏每日推荐 3、成长日记 4、课程、专栏
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
            console.log(act);
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
        isCollFun(){// 是否收藏
            if (this.is_collect == 0) {
                let that = this;
                let ajaxURL = '/h5/user_collect'
                this.$axios.post(ajaxURL, {
                    collect_type: 2,//   收藏顶级分类：1课程 2游戏 3小知识
                    category_id: 2,//二级分类id：课程、专栏时：0 游戏时：1正在挑战 2每日推荐
                    // goods_type: 1,//类型 0课程 1专栏
                    goods_id: this.$route.query.queryid,//标识id
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
                    collect_type: 2,//   收藏顶级分类：1课程 2游戏 3小知识
                    category_id: 2,//二级分类id：课程、专栏时：0 游戏时：1正在挑战 2每日推荐
                    // goods_type: 1,//类型 0课程 1专栏
                    goods_id: this.$route.query.queryid,//标识id
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
        game_share(){//游戏打卡分享
            let babyid=localStorage.getItem("babyid");
            let game_id=this.$route.query.queryid;
            if(babyid){
                this.$router.push({path:'/m/evaluate',query:{type:2,game_id:game_id,title:this.game_info.title}});
            }else{
                let that=this;
                this.$refs.dialogBar.open({
                    type: 2,
                    content:'请先添加宝宝！',  // 内容
                    shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
                    button: ['取消','确定'], // 按钮内容 默认 知道了
                    yes () {          // 点击确认回调
                        that.$router.push({path:'/m/addbaby'});
                    },
                    no(){
                        that.$refs.dialogBar.close();
                    }

                })
            }
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

    },
    mounted(){
        this.game_recommend_info();
        this.getcomment()
    },

    computed: {

    }

}
</script>

<style lang="scss" scoped>
    .gameEvaluate{
        background-color: #fff;
        .gameDetails{
            padding:0.15rem;
            p{
                // font-size: 0.18rem;
            }

        }
        .title{
            font-size: 0.16rem;
            padding:0 0.15rem;
            height: 0.3rem;
            line-height: 0.3rem;
            span{
                color: #999;
                margin-left: 0.06rem;
            }
        }
    }

</style>
