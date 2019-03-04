<template>
    <div>
        <div class="my_evalulate">
            <div class="flex">
                <div>
                    <img :src="post_detail.user_pic">
                </div>
                <div class="nickname">{{post_detail.nickname}}</div>
            </div>
            <div class="content">
                {{post_detail.content}}
            </div>
            <div class="clearfix">
                <div class="great">
                    <span  :class="{islike:is_like==1}" @click="dianzan()"></span>
                    已有{{like_amount}}人点赞
                </div>
                <div class="cancel">
                    <span @click="post_del()"></span>
                </div>
            </div>
        </div>
        <div class="source listItem">
            <div class="title">来自游戏-每日推荐</div>
            <router-link :to="{path:'/m/game',query:{queryid:this.$route.query.game_id}}" class="flex gametime group" >
                <div class="flex_2 kpic">
                    <img :src="game_detail.pic">
                </div>
                 <div class="flex_6 gamedetails"> 
                    <div class="item">{{game_detail.title}}</div>
                    <div class="itembtn itembtnp0" v-for="label of game_detail.label">{{label}}</div>
                    <div class="iteminfo">
                        <div class="iteminfo_hidden">{{game_detail.introduce}}</div>
                    </div>
                </div>
            </router-link>
        </div>

        <div class="gameEvaluate">
            <div class="title">看看大家怎么说<span>{{comment_list.length}}</span></div>
        </div>
        <!--评价-->
        
          <div v-if="comment_list.length<1" class="nodata">暂无评论内容</div>
          <div v-if="comment_list.length>0" class="comment-list">
            <div class="comment-item" v-for="(item,index) of comment_list" :key="index">
              <div class="comment-left">
                <div class="user-pic"><img :src="item.user_pic[0]" /></div>
              </div>
              <div class="comment-right">
                <div class="nick-name"><strong>{{item.nickname}}</strong> <span class="send-tiem">{{$commonModel.format(item.create_time)}}</span></div>
                  <div class="comment-content" style="padding:0.12rem 0">
                    <p>{{item.content}}</p>
                    <!-- <div class="source-list" v-if="item.source_url!=0">
                      <span class="picitem" v-for="picitem of item.source_url" @click="comment_pic_show(picitem)">
                          <img :src="picitem">
                      </span>
                    </div> -->
                    <!-- <div class="comment-bottom">
                      <span class="dianzan" :class="{islike:item.is_like==1}" @click="dianzan(item)">{{item.like_amount}}</span>
                    </div> -->
                  </div>
              </div>
            </div>
          </div>
       
        <!--评价END-->
        <div class="othertalk" @click="gotalk()">说点什么吧······</div>
        <dialogBar ref="dialogBar"></dialogBar>
    </div>
</template>

<script>
import dialogBar from '@/components/common/layer'
export default {
    name:'evaluate_details',
    components:{
        dialogBar
    },
    data () {
        return {
            is_like:'',
            like_amount:'',
            post_detail:{},
            game_detail:{},
            comment_list:[],
        }
    },
    created(){
      
    },
    methods: {
        postDetail:function(imgurl){
            let post_id=this.$route.query.post_id;
            this.$axios.post('/h5/post_detail', {post_id:post_id}).then(res => {
                res = res.data;
                if (res.code == 0) {
                    let data=res.data;
                    this.post_detail=data.post_detail[0];
                    this.like_amount=data.post_detail[0].like_amount;
                    this.is_like=data.post_detail[0].is_like;
                    this.game_detail=data.game_detai;
                    this.comment_list=data.post_detail;
                }
                else {
                    this.toggleModal(res.msg);
                }
            })
        },
        dianzan(){//点赞取消点赞
            let post_id=this.$route.query.post_id;
            let act='';
            if(this.is_like==1){//是否点赞 0：否 1：是
                act="del"
            } else {
                act="add"
            }
            // console.log(act);
            let that = this;
            let ajaxURL = '/h5/post_like';
            this.$axios.post(ajaxURL, {
                post_id: post_id,//评论id
                act: act,//del:取消点赞，add：点赞
            }).then(res => {
                res = res.data;
                if (res.code == 0) {
                    if(this.is_like==1){
                        this.is_like = 0;
                        this.like_amount--
                    } else {
                        this.is_like = 1;
                        this.like_amount++
                    }
                }
                else {
                    that.toggleModal(res.msg);
                }
            })
        },
        post_del(){//删除帖子
            let that=this;
            let post_id=this.$route.query.post_id;
            let game_id=this.$route.query.game_id;
            this.$refs.dialogBar.open({
                type: 2,
                content:'确定删除吗',  // 内容
                shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
                button: ['取消','确定'], // 按钮内容 默认 知道了
                yes () {          // 点击确认回调
                    that.$refs.dialogBar.close();
                    this.$axios.post('/h5/post_del', {post_id:post_id,game_id:game_id}).then(res => {
                        res = res.data;
                        if (res.code == 0) {
                            
                        }
                        else {
                            that.toggleModal(res.msg);
                        }
                    })

                },
                no(){
                    that.$refs.dialogBar.close();
                }

            })
        },
        gotalk(){//说点什么吧
            this.$router.push({path:'/m/evaluate',query:{type:5,post_id:this.$route.query.post_id,game_id:this.$route.query.game_id}});
        }
    },
    
    mounted(){
        this.postDetail();
    },

}
</script>

<style lang="scss" scoped>
    .my_evalulate{
        background-color: #fff;
        padding:0.2rem 0.15rem;
        .flex{
            img{
                width: 0.48rem;
                height: 0.48rem;
                border-radius: 50%;
            }
            .nickname{
                font-size:0.14rem;
                padding-left:0.2rem;
                color: #666;
            }

        }
        .content{
            width: 82%;
            margin-left:0.68rem;
            font-size:0.16rem;
            padding:0.06rem 0;
        }
        .great{
            color:#D7D7D7;
            width: 1.34rem;
            height: 0.7rem;
            text-align: center;
            float: left;
            margin-left:0.64rem;
            span{
                margin:0.1rem 0.5rem;
                width: 0.34rem;
                height: 0.34rem;
                display: block;
                background:url(../../assets/3dianzan-zhauntai@2x.png) no-repeat;
                background-size:cover;
                &.islike{
                    background:url(../../assets/3dianzan@2x.png) no-repeat;
                    background-size:cover;
                    
                }
            }
            
        }
        .cancel{
            width: 0.34rem;
            height: 0.7rem;
            float: left;

            span{
                width: 0.34rem;
                height: 0.34rem;
                margin:0.1rem 0;
                display: block;
                background:url(../../assets/3shanchu@2x.png) no-repeat;
                background-size:cover; 
            }
            
        }
    }
    .source{
        margin-top:0.1rem;
        background-color: #fff;
        padding:0 0.16rem 0.2rem;
        .title{
            // height: 0.46rem;
            // line-height: 0.46rem;
            font-size: 0.16rem;
            color:#333;
        }
    }

    .gameEvaluate{
        background-color: #fff;
        margin-top:0.1rem;
        .gameDetails{
            padding:0.15rem;
            p{
                // font-size: 0.18rem;
            }

        }
        .title{
            font-size: 0.16rem;
            padding:0 0.15rem;
            height: 0.42rem;
            line-height: 0.42rem;
            span{
                color: #999;
                margin-left: 0.06rem;
            }
        }
    }
    .comment-list{
        background-color: #fff;
        padding-bottom:0.86rem;
        .comment-item{
            margin:0;
        }
    }

    .othertalk{
        position: fixed;
        width: 100%;
        bottom:0;
        height: 0.45rem;
        line-height: 0.45rem;
        background-color: #32B182;
        color:#fff;
        font-size: 0.16rem;
        text-align: center;
    }
</style>
