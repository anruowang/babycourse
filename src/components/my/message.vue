<template>
    <div>

        <div class="radio-group">
            <span v-for="(item,index) in tabs" :class="{cur: index == tabnum}" @click="tab(index)">{{item}}</span>
        </div>

        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="my_scroller" style="padding-top:0;padding-bottom:0.5rem;">
            <div class="messagelist clearfix">
                <div class="nodata" v-if="nodata">暂无数据</div>
                <div  v-for="(list,index) of data_list" :key="index">
                    <div @click="read(list)">
                        <div v-if="tabnum == 1" class="trend_list">
                            <p class="time">{{list.create_time}}</p>
                            <p class="title">{{list.title}}
                                <i class="read"></i>
                                <span class="text-minor arrowright">查看详情</span>
                            </p>
                            
                        </div>
                        <div v-else-if="tabnum == 2" class="update_list">
                            <p class="time">{{list.create_time}}</p>
                            <p class="title">{{list.title}}
                                <i class="read"></i>
                            </p>
                            <div class="flex upinfo">
                                <div class="flex_2">
                                    <img :src="list.logo">
                                </div>
                                <div class="flex_6">
                                    <p class="followp">{{list.content}}</p>
                                    <p class="text-minor">更新时间：{{list.start_time}}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="tabnum == 3" class="broad_list">
                            <p class="title">{{list.title}}
                                <i class="read"></i>
                            </p>
                            <p class="text-minor">{{list.content}}</p>
                        </div>
                    </div>

                </div>
            </div>
        </scroller>

    </div>
</template>

<script>
    export default {
        name: 'messagelist',
        data () {
            return {
                tabs: {1:"动态",2:"更新",3:"广播"},
                tabnum:1,
                istab:false,//是否切换
                data_list:[],    // 上拉加载更多的数据存放数组
                nodata:false,    // 是否有数据
                initView:true,   // 是否为首次加载
                pagecur:0,       // 页码
                num:10,          // 一次显示多少条
                list_has:true,   // 是否还有更多
                issx:false,      // 是否下拉刷新 
            }
        },
        methods:{
            tab(index) {
                if(this.tabnum == index){
                    return false;
                }
                this.tabnum = index;
                this.istab = true;
                this.pagecur = 0;
                this.data_list_show();
            },
            data_list_show:function(done){
                let that = this;
                let post_data = {offset:that.pagecur,limit:that.num,h_type:that.tabnum};
                this.$axios.post('/h5/user_message_list',post_data).then(
                    res => {
                        res = res.data;
                        if(that.istab){
                            that.data_list = [];
                            that.istab = false;
                        }
                        // console.log(res);
                        if (res.code == 0) {
                            const data = res.data;
                            // console.log(data.message_list);
                            if(that.pagecur == 0){
                                that.initView = false;
                            }
                            that.pagecur++;
                            that.list_has = data.has_more;
                            if(data.message_list.length > 0){
                                data.message_list.forEach(function (value) {
                                    that.data_list.push(value);
                                });
                                // console.log(that.data_list);
                            }
                            if(typeof(done) == "function"){
                                done();
                            }
                            that.$refs.my_scroller.finishPullToRefresh();
                            if (!that.list_has) {
                                that.$refs.my_scroller.finishInfinite(true);
                            }
                        }else {
                            this.toggleModal(res.msg);
                        }
                    }
                )
            },
            read:function(list){         // 上报阅读
                let ajaxURL = '/h5/user_message_read';
                let that = this;
                if (list.is_read == 0) {
                    this.$axios.post(ajaxURL, {m_id:list.id}).then();
                }
                
                this.$router.push({path:list.goods_type==0?'/m/course':(list.goods_type==1?'/m/column':(list.goods_type==2?'/m/game':'')),query:{queryid:list.goods_id}})
            },
            infinite(done) {
                if(this.list_has) {
                    this.data_list_show(done);
                }else{
                    this.$refs.my_scroller.finishInfinite(true)
                }
            },
            refresh() {
                this.nodata = false;
                this.initView = true;    // 是否为首次加载
                this.pagecur = 0;        // 页码
                this.data_list = [];     // 上拉更多的数据存放数组
                this.list_has = true;    // 是否还有更多
            }
            // infinite(done) {
            //     if(this.issx){
            //         return false
            //     }
            //     if(this.list_has) {
            //         this.data_list_show(done);
            //     }else{
            //         this.$refs.my_scroller.finishInfinite(true);
            //     }
            // },
            // refresh() {
            //     if(!this.initView){
            //         this.nodata = false;
            //         this.pagecur = 0;        // 页码
            //         this.data_list = [];     // 上拉更多的数据存放数组
            //         this.list_has = true;    // 是否还有更多
            //         this.issx = true;
            //         this.data_list_show();
            //     }
            // }
        },
        mounted(){
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../css/variables.scss';
    @import "../../css/head_tab.scss";
    .radio-group{
        position: fixed;
        left: 0;
        top: 0;
        background-color: #fff;
        z-index: 99;
        width: 100%;
        &>span{
            width:33.3%;
        }
    }
    .messagelist{
        padding:0.44rem 0.15rem;
        .time{
            max-width: 1.6rem;
            height: 0.25rem;
            line-height:0.25rem;
            border-radius: 0.125rem;
            background-color:#e1e1e1;
            color: #fff;
            text-align:center;
            margin: 0.2rem auto;
        }
        .title{
            width: 3.45rem;
            height: 0.45rem;
            line-height: 0.45rem;
            background-color:#fff;
            border-radius:0.04rem;
            font-size: 0.16rem;
            color:#333;
            padding:0 0.2rem;
        }
        .trend_list{
            margin-bottom: 0.2rem;
            .title{
                .text-minor{
                    float: right;
                    color: #999;
                    font-size: 0.12rem;
                    position: relative;
                    padding-right:0.12rem;
                    &.arrowright:after{
                        margin-top:-5px;
                    }
                }
            }
        }
        .update_list{
            margin-bottom: 0.2rem;
            .title{
                border-bottom:1px solid #f4f4f4;
            }
            .upinfo{
                background-color:#fff;
                padding:0.16rem;
                align-items:initial;
                .flex_2{
                    img{
                        width:0.82rem;
                        height: 0.58rem;
                        border-radius:0.04rem;
                    }
                    
                }
                .flex_6{
                    width:2rem;
                    position: relative;
                    .followup{
                        font-size:0.14rem;
                    }
                    .text-minor{
                        font-size:0.12rem;
                        color:#999;
                        position: absolute;
                        bottom: 0;
                    }
                }
            }
          
        }
        .broad_list{
            .text-minor{
                background-color:#fff;
                font-size:0.14rem;
                color:#999;
                padding:0 0.2rem;
                height: 0.3rem;
                line-height: 0.3rem;
            }
        }
        
    }
</style>