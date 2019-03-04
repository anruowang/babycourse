<template>
    <div>
        <home-swiper :list="swiperList"></home-swiper>
        <div class="listItem" style="padding:0">
            <!-- 小知识 -->
            <div class="knowledge white-bg mt10"  style="padding:0 0.15rem;">
                <div class="title">{{general_knowledge.nickname}}</div>
                <div class="flex">
                    <div class="flex_2 kpic">
                        <img :src="general_knowledge.pic">
                    </div>
                    <div class="flex_6 knowledgedetails">
                        <div v-for="item of general_knowledge_list" :key="item.id" @click="singleplay(item)"><i class="icon-pause"></i>{{item.title}}</div>
                    </div>
                </div>
                <div class="clearfix playbtn">
                    <span class="fl allplay" @click="allplay()"></span>
                    <router-link :to="{path:'/m/sknowledge'}" class="fr more">更多</router-link>
                </div>
            </div>

            <!-- 推荐模块 -->
          <div style="padding:0 0.15rem 0.15rem">
            <div v-for="item of recommend"><!-- 0课程 1专栏 2游戏每日推荐 3游戏挑战区 --><!-- 1直播 2音频录播 3视频录播 4视频直播 -->
                <template v-if="item.type==1"><!-- 列表-->
                    <div class="title">{{item.name}}</div>
                    <template v-for="list of item.data_list">
                        <router-link class="flex gametime" :class="{group:list.type==1 || list.type==2}" :to="{path:list.type==0?'/m/course':(list.type==1?'/m/column':(list.type==2?'/m/game':'')),query:{queryid:list.id}}">
                            <div class="flex_2 kpic">
                                <img :src="list.cover">
                                <span class="liveicon" v-if="list.course_type==4 ||  list.column_type==4">直播</span>
                                <span class="livetime" v-if="list.course_type==4">{{list.start_time}}</span>
                                <span class="livetime" v-if="list.column_type==4">{{list.start_time}}-{{list.end_time.slice(11)}}</span>
                            </div>
                             <div class="flex_6 gamedetails" v-if="list.type==2"> <!-- 游戏 -->
                                <div class="item">{{list.title}}</div>
                                <div class="itembtn itembtnp0" v-for="label of list.label">{{label}}</div>
                                <div class="iteminfo">
                                    <div class="iteminfo_hidden">{{list.introduce}}</div>
                                </div>
                            </div>
                            <div class="flex_6 gamedetails" v-if="list.type==0 || list.type==1"> <!-- 课程 专栏 -->
                                <div class="item" :class="{itemcourse:list.type==0}">{{list.title}}</div>
                                <div class="itembtn" :class="{itembtnp0:list.type==1}">{{list.expected_lectures_desc}}</div>
                                <div class="price">
                                    <span class="fl studycount">{{list.study_count}}人</span>
                                    <!-- 付费类型 1免费 2 付费 3加密 4必须购买专栏 -->
                                    <span class="fr money free" v-if="list.money_type==1">免费</span>
                                    <span class="fr money" v-if="list.money_type==2 && list.limit_time_open==2">￥{{$commonModel.returnFloat(list.money)}}</span>
                                    <span class="fr money" v-if="list.money_type==2 && list.limit_time_open==1 && list.limit_time_money>0">
                                      <del class="oldmoney">￥{{$commonModel.returnFloat(list.money)}}</del>￥{{$commonModel.returnFloat(list.limit_time_money)}}
                                    </span>
                                    <span class="fr money free" v-if="list.money_type==2 && list.limit_time_open==1 && list.limit_time_money==0">
                                      <del class="oldmoney">￥{{$commonModel.returnFloat(list.money)}}</del>限时免费
                                    </span>
                                    <span class="fr money" v-if="list.money_type==3">加密</span>
                                    <span class="fr money" v-if="list.money_type==4">￥{{$commonModel.returnFloat(list.money)}}</span>
                                </div>
                            </div>
                        </router-link>
                    </template>

                </template>

                <template v-else-if="item.type==2"><!-- 卡片-->
                    <div class="title">{{item.name}}</div>
                    <template v-for="list of item.data_list" >
                        <div class="flex psy" v-if="list.type==2"><!-- 游戏 -->
                            <router-link class="psy_flex_2" :to="{path:list.type==0?'/m/course':(list.type==1?'/m/column':(list.type==2?'/m/game':'')),query:{queryid:list.id}}">
                                <img :src="list.cover">
                                <div class="coursename">
                                    {{list.title}}
                                </div>
                                <div class="knowicon">
                                    <span v-for="label of list.label">{{label}}</span>
                                </div>
                                <div class="iteminfo">
                                    <div class="iteminfo_hidden">{{list.introduce}}</div>
                                </div>
                            </router-link>
                        </div>
                        <div class="flex psy" v-if="list.type==0 || list.type==1"><!--课程 专栏 -->
                            <router-link class="psy_flex_2" :to="{path:list.type==0?'/m/course':(list.type==1?'/m/column':(list.type==2?'/m/game':'')),query:{queryid:list.id}}">
                                <div class="imgtime">
                                    <img :src="list.cover">
                                    <span class="liveicon" v-if="list.course_type==4 ||  list.column_type==4">直播</span>
                                    <span class="livetime" v-if="list.course_type==4">{{list.start_time}}</span>
                                    <span class="livetime" v-if="list.column_type==4">{{list.start_time}}-{{list.end_time}}</span>
                                </div>
                                <div class="coursename" :class="{itemcourse:list.type==0}">
                                    {{list.title}}
                                </div>
                                <div class="knowicon" :class="{knowiconmb0:list.type==1}" v-if="list.type==1">
                                    <span>{{list.expected_lectures_desc}}</span>
                                </div>
                                <div class="pricedel"><del v-if="list.limit_time_open==1">5</del></div>
                                <div class="price">
                                    <span class="fl">{{list.study_count}}人</span>
                                    <span class="fr money free" v-if="list.money_type==1">免费</span>
                                    <span class="fr money" v-if="list.money_type==2 && list.limit_time_open==2">￥{{$commonModel.returnFloat(list.money)}}</span>
                                    <span class="fr money free" v-if="list.money_type==2 && list.limit_time_open==1 && list.limit_time_money>0">
                                      ￥{{$commonModel.returnFloat(list.limit_time_money)}}
                                    </span>
                                    <span class="fr money free" v-if="list.money_type==2 && list.limit_time_open==1 && list.limit_time_money==0">
                                      限时免费
                                    </span>
                                    <span class="fr money" v-if="list.money_type==3">加密</span>
                                    <span class="fr money" v-if="list.money_type==4">￥{{$commonModel.returnFloat(list.money)}}</span>
                                </div>
                            </router-link>
                        </div>
                    </template>

                </template>

            </div>
          </div>
        </div>
        <Player v-if="playerShow" :list="play_songs" :hidePlayer="hidePlayer"></Player>
        <dialogBar ref="dialogBar"></dialogBar>
    </div>

</template>

<script>

import dialogBar from '@/components/common/layer'
import HomeSwiper from '@/components/common/Swiper'
import Player from '@/components/common/player'
export default {
  name: 'first',
  components:{
    HomeSwiper,
    dialogBar,
    Player
  },
  data () {
    return {
        state:['','直播','音频','视频','直播'],
        swiperList: [],
        general_knowledge_list:[],
        general_knowledge:[],
        recommend:[],
        current_index:0,
        playerShow:false,
        play_songs:[],
        }
    },
    methods:{
        getHomeInfo(){
            let that=this;
            this.$axios.post('/h5/index_recommend', {}).then(res => {
                res = res.data;
                if (res.code == 0) {
                    const data = res.data;
                  that.swiperList = data.banner_list;
                  that.general_knowledge_list=data.general_knowledge_list;
                  that.general_knowledge=data.general_knowledge;
                  that.recommend=data.recommend;
                }
                else {
                  that.toggleModal(res.msg);
                }
            })
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
        allplay(){
            let mlist=this.general_knowledge_list;
            localStorage.setItem("music_list",JSON.stringify(mlist));
            this.playerShow=true;
            this.play_songs=mlist;
        },
        singleplay(item){
          let mlist=[];
          mlist[0]=item;
          this.play_songs=mlist;
          localStorage.setItem("music_list",JSON.stringify(mlist));
          this.playerShow=true;
        },

        hidePlayer(){//关闭播放器
          this.playerShow=false;
//          localStorage.removeItemItem("music_list");
        },

    },
    mounted(){
        this.getHomeInfo();

    }
}
</script>
<style lang="scss" scoped>
    @import '../../css/variables.scss';
    .listItem .price .free{
        color: $color;
    }


</style>
