<template>
    <div>
        <div class="radio-group">
            <span v-for="(item,index) in tabs"
                :class="{cur: index == tabnum}"
                @click="tab(index)">
                {{item}}
            </span>
        </div>
        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="my_scroller" style="padding-top:0.55rem; padding-bottom:0.5rem;" :class="{isNotData:nodata}">
            <div class="gamelist clearfix">
                <div class="nodata" v-if="nodata">暂无数据</div>
                <template v-for="(v,index) of list">
                    <div style="position:relative;width:3.45rem;height:1.22rem;margin-bottom:0.2rem;">
                        <router-link class="" :to="{path:(v.goods_type==0)?('/m/course'):('/m/column'),query:{queryid:v.goods_id}}">
                            <div class="course">
                                    <img :src="v.goods_info.cover">
                                    <div v-if="v.goods_info.course_type == 4 || v.goods_info.column_type == 4">
                                        <span class="live">直播</span>
                                        <span class="time">{{v.goods_info.start_time}}</span>
                                    </div>
                                    <div class="showtime">{{v.goods_info.title}}</div>
                            </div>
                        </router-link>
                        <div style="position:absolute;bottom:0.1rem;left:1.65rem;width:1.7rem;">
                            <template v-if="v.be_present_user_id">
                                <span class="present">{{v.be_present_user_id>0?('领取好友：'+v.goods_info.be_present_nickname):('课程未领取')}}</span>
                                <span v-if="v.be_present_user_id==0" class="btn54x22 fr enter" @click="gift(v.id)">赠送好友</span>
                            </template>
                            <template v-else>
                                <router-link class="" :to="{path:(v.goods_type==0)?('/m/course'):('/m/column'),query:{queryid:v.goods_id}}">
                                    <span class="btn54x22 enter fr">进入</span>
                                </router-link>
                            </template>
                        </div>
                    </div>
                </template>
            </div>
        </scroller>
        <div class="shareimg" v-show="show" @click="hideimg()">
            <img :src="shareimg">
        </div>
        <dialogBar ref="dialogBar"></dialogBar>
    </div>
</template>

<script>
import dialogBar from '@/components/common/layer';
export default {
    name: 'mycourse',
    components:{
        dialogBar
    },
    data () {
    return {
        list:[],// 上拉加载更多的数据存放数组
        nodata:false,//没有数据的缺省页
        pagecur : 0, //页码
        num : 5,  // 一次显示多少条
        isfresh:false,//是否刷新
        list_has:true,//是否还有更多数据
        tabs: {1:"已购",2:"赠送"},//标签
        tabnum:1,//tab标签默认选项
        istab:false,//是否刚切换tab标签
        shareimg:'',//分享好友图片生成
        show:false
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
        //标签切换
        tab(index,done) {
            if(this.tabnum == index){
                return false;
            }
            this.tabnum = index;
            this.istab = true;
            this.pagecur = 0;
            this.nodata = false;
            this.get_more_list(done);
        },
        get_more_list:function(done){
            let that=this;
            this.$axios.post('/h5/my_course_list', {offset: that.pagecur,limit: that.num, type: that.tabnum
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
            this.pagecur = 0;
            this.list= [];
            this.isfresh = true;
            this.list_has = true;
            this.get_more_list(done);
        },
        gift(id){
            this.show=!this.show;
            this.$axios.post('/h5/my_course_give_key', {my_course_id : id}).then(
                res => {
                    res = res.data;
                    if(res.code == 0){
                        this.shareimg=res.data.pic_url; 
                    }else {
                        this.toggleModal(res.msg);
                    }
            })
        },
        hideimg(){
            this.show=false;
        }
    },
    mounted(){
    },
}
</script>
<style lang="scss" scoped>
    @import "../../css/head_tab.scss";
    .shareimg{
        position: absolute;
        left:0;
        top:0;
        width: 0;
        min-height: 6.02rem;
        padding:0.4rem;
        width: 100%;
        background-color: rgba(0,0,0,0.6);
        z-index: 999;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .radio-group{
        position: fixed;
        left: 0;
        top: 0;
        background-color: #fff;
        z-index: 99;
        width: 100%;
    }
    .gamelist{
        padding: 0 0.15rem 0.2rem;
        .course{
            top: 0;
            width:3.45rem;
            height: 1.22rem;
            background-color: #fff;
            margin-bottom: 0.2rem;
            position: relative;
            &:nth-child(2n+1){
                margin-right: 0.17rem;  
            }
            img{
                margin: 0.1rem;
                width:1.45rem;
                height: 1.02rem;
            }
            .showtime{
                position: absolute;
                top:0.1rem;
                left: 1.65rem;
                font-size: 0.16rem;
                color: #000;
                width: 1.7rem;
            }
            .enter{
                position: absolute;
                bottom: 0.15rem;
                right: 0.19rem;
                z-index:999;
            }
            .live{
                position: absolute;
                top: 0.15rem;
                left: 1.13rem;
                background-color: rgba(0, 0, 0, 0.4);
                color: #fff;
                font-size: 0.1rem;
                width: 0.32rem;
                line-height: 0.14rem;
                height: 0.14rem;
                text-align: center;
                border-radius: 0.07rem
            }
            .time{
                position: absolute;
                bottom: 0.1rem;
                left: 0.1rem;
                background-color: #FED13A;
                color: #fff;
                height: 0.15rem;
                line-height: 0.15rem;
                font-size: 0.1rem;
                width:1.45rem;
                text-align: center;
            }
            
        } 
        .present{
            color: #999999;
            line-height:0.22rem;
        } 
    }

    
    
  
</style>