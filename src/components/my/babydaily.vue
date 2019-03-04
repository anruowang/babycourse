<template>
    <div>
        <!-- 头部 -->
        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="my_scroller" class="scrollerdiv" :class="{isNotData:nodata}">
            <div class="headerpic">
                <img src="../../assets/baobaoriji@2x.png" width="100%" height="100%" />
                <div class="babylist">
                    <div class="babybox flex" v-for="(baby, index) of babyinfo" @click="changeBaby(baby.id)">
                        <img :src="baby.logo" width="100%" height="100%" class="img" />
                        <div class="flex_6">
                            <div class="nickname">{{baby.nickname}}</div>
                            <div class="age">{{baby.age}}</div>
                        </div>
                        <div :class="{chose: baby.id == babyid}"></div>
                    </div>
                </div>
            </div>

                
            <div class="gamelist clearfix">
                <div class="nodata" v-if="nodata">暂无数据</div>
                <template v-for="(value,index) in list">
                    <div class="year" v-if="index==0 || getyear(list[index-1].create_time) != getyear(value.create_time)">{{getyear(value.create_time)}}</div>
                    <div class="today" v-if="index==0 || getmonth(list[index-1].create_time) != getmonth(value.create_time) || getday(list[index-1].create_time) != getday(value.create_time)">
                        <span class="day">{{getday(value.create_time)}}</span>
                        <span class="month">{{getmonth(value.create_time)}}月</span>
                    </div>
                    <div class="dadily-content">
                        <div class="dailytime">{{gettime(value.create_time)}}</div>
                        <div class="content">
                            <div class="tag">{{dailytype[value.log_type]}}</div>
                            <div class="text">{{value.content}}</div>
                            <div class="gameimg" v-if="value.pictures != '' ">
                                <template v-for="(picv,pindex) in value.pictures"><img :src="picv"/></template>
                            </div>
                            <div class="game" v-if="value.log_type != 3"><div class="gametype">游戏馆</div><div>{{value.game_title}}</div></div>
                            <div class="oprate">
                                <div><img src="../../assets/dianzan.png" /> {{value.like_amount}}</div>
                                <div><img src="../../assets/2fenxiang@2x.png" /></div>
                                <div @click="deleteDaily(value.id,index)"><img src="../../assets/shanchu000@2x.png" /></div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            
        </scroller>
        <div v-if="share_mask_show" class="sharemask" @click="mask_hide()">
          <div class="shareImg"><img src="../../assets/share_tips.png"></div>
        </div>
        <div class="adddaily" @click="adddaily()"></div>
        <dialogBar ref="dialogBar"></dialogBar>
    </div>
</template>

<script>
import dialogBar from '@/components/common/layer';
import {commonShare, shareTitle, shareUrl, shareImg, shareDesc} from "@/components/common/wxshare";
export default {
  name: 'babydadily',
  components:{
    dialogBar
  },
  data () {
    return {
        list:[],// 上拉加载更多的数据存放数组
        nodata:false,//没有数据的缺省页
        pagecur : 0, //页码
        num : 10,  // 一次显示多少条
        isfresh:false,//是否刷新
        list_has:true,//是否还有更多数据
        babyinfo: this.$commonModel.babyInfo(),
        babyid: window.window.localStorage.babyid,
        dailytype:{1:'挑战', 2:'打卡', 3:'日记'},
        share_mask_show:false,//就否显示分享提示
        }
    },
    methods:{
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
        getyear(time){
            return time.split('-')[0];
        },
        getmonth(time){
            return time.split('-')[1];
        },
        getday(time){
            return time.split('-')[2].split(' ')[0];
        },
        gettime(time){
            return time.split(' ')[1].substring(0, time.split(' ')[1].lastIndexOf(':'));
        },
        changeBaby(babyid,done){
            if(this.babyid == babyid){
                return false;
            }
            this.babyid = babyid;
            localStorage.setItem("babyid",babyid)
            this.istab = true;
            this.pagecur = 0;
            this.nodata = false;
            this.get_more_list(done);
        },
        get_more_list:function(done){
            let that=this;
            this.$axios.post('/h5/baby_grow_daily_list', {offset: that.pagecur, limit: that.num, baby_id: that.babyid 
            }).then(res => {
                res = res.data;
                //切换数据后列表清空标记切换完成
                if(that.istab){
                    that.list = [];
                    that.istab = false;
                }
                //第一页就没有数据时候显示缺省页
                if(that.pagecur == 0 && res.data.list.length == 0 || that.nodata){
                    that.nodata = true;
                    return false;
                }
                if (res.code == 0) {
                    const data = res.data;
                    that.pagecur++;
                    that.list_has = data.has_more;
                    if(data.list && data.list.length > 0){
                        data.list.forEach(function (value) {
                            that.list.push(value);
                        });
                    }
                    if(typeof(done)=="function"){
                        that.isfresh = false;
                        done();
                    }
                    that.list_has = data.has_more;
                    this.$refs.my_scroller.finishInfinite(!that.list_has);
                }else {
                    this.toggleModal(res.msg);
                }
            })

        },
        infinite(done) {
            if(!this.isfresh && this.list_has){
                this.get_more_list(done);
            }else{
                this.$refs.my_scroller.finishInfinite(!this.list_has);
            }
        },
        refresh(done) {
            this.nodata=false;
            this.pagecur = 0;//页码
            this.list= []; // 上拉更多的数据存放数组
            this.isfresh = true;
            this.list_has = true;
            this.get_more_list(done);
        },
        adddaily(){
            this.$router.push({path:'/m/evaluate',query:{type:3}});
        },
        deleteDaily(id,index){
            let that=this;
            this.$refs.dialogBar.open({
                type: 2,
                content:'确定删除日记吗',  // 内容
                shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
                button: ['取消','确定'], // 按钮内容 默认 知道了
                yes () {          // 点击确认回调
                    that.$refs.dialogBar.close();
                    this.$axios.post('/h5/baby_daily_del', {dadily_id:id}).then(res => {
                        res = res.data;
                        if (res.code == 0) {
                            that.list.splice(index,1);
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
        course_share(init){//分享
            if(init!="init"){
                this.share_mask_show=true;
            } else{
                this.share_mask_show=false;
            }
            // let title = this.course_info.title;
            // let icon = this.course_info.cover;
            let url = window.location.href;
            commonShare(this, title, url, icon, '');
        },

        mask_hide(){
            this.share_mask_show=false;
        },


    },
    mounted(){

    },
}
</script>
<style lang="scss" scoped>
    .adddaily{
        width: 0.66rem;
        height: 0.66rem;
        background: url(../../assets/tianjiarukou@2x.png);
        background-size:cover;
        position: fixed;
        bottom:0.2rem;
        right: 0.2rem;
        z-index: 99;
    }
    .headerpic{
        height: 2rem;
        width: 100%;
        position: relative;
        z-index: 100;
    }
    .babylist{
        width: 3.45rem;
        height: 0.5rem;
        background-color: #FFFFFF;
        position: absolute;
        bottom: -0.25rem;
        left: 0.15rem;
    }
    .img{
        width: 0.40rem;
        height: 0.40rem;
        border-radius: 50%;
        margin-top: 0.05rem;
    }
    .babybox{
        font-size: 0.17rem;
        color: #666666;
        float: left;
        // text-align: center;
        // margin-left:0.2rem;
        width: 1.71rem;
        height: 100%;
        padding:0.15rem;
        position: relative;
        .flex_6{
            padding:0 0.1rem;
        }
        .nickname{
            font-size: 0.14rem;
            line-height: 0.14rem;
            color: #333333;
            width:1.0rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top:0.06rem;
        }
        .age{
            font-size: 0.11rem;
            line-height: 0.11rem;
            color: #999999;
            height: 0.12rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top:0.06rem;
        }
    }
    .chose{
        background-color: #32B182;
        height: 0.19rem;
        width: 0.19rem;
        border-radius:100% 0 0 0;
        position: absolute;
        left: 1.54rem;
        bottom: 0rem;
    }
    .scrollerdiv{
        // background-color: red;
        // z-index: 98;
        // padding-top: 2.35rem;
    }
    .gamelist{
        margin-top: 0.48rem;
        .year{
            padding-left: 0.05rem;
            color: #333333;
            font-size: 0.14rem;
            letter-spacing: 0.02rem;
            line-height: 0.13rem;
        }
        .today{
            margin-top: 0.1rem;
            margin-bottom: 0.15rem;
            width: 0.45rem;
            height: 0.45rem;
            background-color: #fff;
            border-radius: 0 15% 15% 0;
            position: relative;
            .day{
                position: absolute;
                height: 0.22rem;
                font-size: 0.18rem;
                line-height: 0.18rem;
                left:0.1rem;
                top: 0.04rem;
            }
            .month{
                position: absolute;
                height: 0.23rem;
                font-size: 0.11rem;
                line-height: 0.11rem;
                left:0.1rem;
                top: 0.27rem;
            }
        }
        .dadily-content{
            position: relative;
            min-height: 1.21rem;
            margin-bottom: 0.2rem;
            margin-top: 0.2rem;
            // background-color: red;
            .dailytime{
                position: absolute;
                left: 0;
                top: 0.2rem;
                background-color: #FFF;
                height: 0.19rem;
                line-height: 0.19rem;
                font-size:0.12rem;
                text-align: center;
                color:#666;
                width: 0.45rem;
                border-radius: 0  0.095rem 0.095rem 0;
            }
            .content{
                background-color: #FFF;
                min-height: 1.21rem;
                width: 3rem;
                margin-left: 0.6rem;
                border-radius: 0.05rem;
                padding-top: 0.15rem;
            }
            .tag{
                background-color: #FFF6D8;
                height: 0.21rem;
                width: 0.4rem;
                /*margin-top: 0.1rem;*/
                margin-left: 0.15rem;
                border-radius: 0.11rem;
                color:#FED13A;
                font-size: 0.12rem;
                line-height: 0.21rem;
                text-align: center;
            }
            .text{
                // margin-left: 0.15rem;
                padding: 0 0.15rem 0.15rem;
                line-height: 1.2;
                margin-top: 0.15rem;
                min-height: 0.16rem;
                font-size: 0.16rem;
                line-height: 0.16rem;
                color: #333333;
            }
            .gameimg{
                margin: 0.15rem 0 0.15rem 0.15rem;
                img{
                    width: 0.76rem;
                    height: 0.76rem;
                    margin-right: 0.15rem;
                }
            }
            .game{
                margin-left: 0.15rem;
                margin-bottom: 0.15rem;
                // margin-top: 0.2rem;
                background-color: #D6EFE6;
                width: 1.63rem;
                height: 0.2rem;
                line-height: 0.2rem;
                color: #999999;
                text-align: center;
                .gametype{
                    border: 0.01rem solid #32B182;
                    color: #32B182;
                    height: 0.2rem;
                    width: 0.47rem;
                    float: left;
                }
                .gemename{
                    text-align: center;
                    width: 1.13rem;
                    float: left;
                }
            }
            .oprate{
                border-top:0.01rem solid #EDEDED;
                margin-left: 0.1rem;
                height: 0.4rem;
                width: 2.8rem;
                color: #D7D7D7;
                div{
                    margin-top: 0.13rem;
                    float: left;
                    width: 0.9rem;
                    text-align: center;
                    img{
                        width: 0.14rem;
                    }
                }
            }
        }
    }  
</style>