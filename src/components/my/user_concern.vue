<template>
    <div>
        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="my_scroller" style="padding-top:0;padding-bottom:0.5rem;">
            <div class="concernlist clearfix">
                <div class="nodata" v-if="nodata">暂无数据</div>
                <div class="challenge flex" v-for="(list,index) of data_list" :key="index">
                    <img :src="list.user_pic">
                    <div class="flex_6" v-if="!list.introduce">
                       <div class="nickname" style="margin-top:0.18rem;">{{list.nickname}}</div>
                    </div>
                    <div class="flex_6" v-if="list.introduce">
                       <div class="nickname">{{list.nickname}}</div>
                        <div class="introduce">{{list.introduce}}</div>
                    </div>
                    <span class="btn54x22 gray" :id="addId(list.concern_user_id)" @click="isConcernFun(list.concern_user_id)">已关注</span>
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>
    export default {
        name: 'concernlist',
        data () {
            return {
                data_list:[],    // 上拉加载更多的数据存放数组
                nodata:false,    // 是否有数据
                initView:true,   // 是否为首次加载
                pagecur:0,       // 页码
                num:10,          // 一次显示多少条
                list_has:true,   // 是否还有更多
                issx:false,      // 是否下拉刷新
                guanzhuid:0,     // 0取消关注 1关注 
            }
        },
        methods:{
            data_list_show:function(done){
                let that = this;
                let post_data = {offset:that.pagecur,limit:that.num};
                this.$axios.post('/h5/fans_list',post_data).then(
                    res => {
                        res = res.data;
                        // console.log(res);
                        if (res.code == 0) {
                            const data = res.data;
                            // console.log(data.list);
                            if(that.pagecur == 0){
                                that.initView = false;
                            }
                            that.pagecur++;
                            that.list_has = data.hasmore;
                            if(data.list.length > 0){
                                data.list.forEach(function (value) {
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
            isConcernFun:function(user_id){         // 是否关注
                let ajaxURL = '/h5/fans_like';
                let that = this;
               

                this.$axios.post(ajaxURL, {
                    type:this.guanzhuid,             // 0取消关注 1关注 
                    like_id: user_id,  // 被关注人ID
                }).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        if (this.guanzhuid == 1) {
                            this.guanzhuid = 0;
                            document.getElementById("u_" + user_id).className += ' gray';
                            document.getElementById("u_" + user_id).innerHTML = '已关注';
                        }else{
                            this.guanzhuid = 1;
                            document.getElementById("u_" + user_id).className = 'btn54x22';
                            document.getElementById("u_" + user_id).innerHTML = '关注';
                        }
                    }else {
                        that.toggleModal(res.msg);
                    }
                })
            },
            addId:function(user_id){                // 新增标签id
                return "u_" + user_id;
            },
            infinite(done) {
                if(this.issx){
                    return false
                }
                if(this.list_has) {
                    this.data_list_show(done);
                }else{
                    this.$refs.my_scroller.finishInfinite(true);
                }
            },
            refresh() {
                if(!this.initView){
                    this.nodata = false;
                    this.pagecur = 0;        // 页码
                    this.data_list = [];     // 上拉更多的数据存放数组
                    this.list_has = true;    // 是否还有更多
                    this.issx = true;
                    this.data_list_show();
                }
            }
        },
        mounted(){
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../css/variables.scss';
    .concernlist{
        padding-bottom:0.2rem;
        .challenge{
            width:3.75rem;
            height:1.04rem;
            padding:0.2rem 0.15rem;
            border-bottom:1px solid #f4f4f4;
            background-color:#fff;
            // background:rgba(255,255,255,1);
            /*position: relative;*/
            &:nth-child(2n+1){
                // margin-right: 0.17rem;
            }
            img{
                width:0.64rem;
                height:0.64rem;
                border-radius:50%;



                // float: left;
            }
            .flex_6{
                height: 0.64rem;
                position: relative;
                padding:0.04rem 0.2rem;
                // padding-left:0.2rem;
                .nickname{
                    font-size:0.16rem;
                    font-weight:bold;
                    height: 0.28rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 1.92rem;

                }
                .introduce{
                    // height: 0.36rem;

                    position: absolute;
                    bottom: 0;
                    left: 0.2rem;
                    right: 0.2rem;
                    font-size: 0.13rem;
                    color: #999;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    word-wrap: break-word;
                    word-break: break-all;
                    -webkit-line-clamp: 2;
                }
            }
            .concern{
                /*position: absolute;*/
                width:0.58rem;
                height:0.26rem;
                float: left;
                background:rgba(254,209,58,1);
                border-radius:0.13rem;
            }
            .btn54x22{
                width: 0.58rem;
                height: 0.26rem;
                line-height:0.26rem;
                border-radius: 0.13rem;
            }
        }  
    }
</style>