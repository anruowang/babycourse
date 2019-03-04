<template>
    <div>
        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="my_scroller">
            <div class="nodata" v-if="nodata">暂无数据</div>
            <div class="searchList"  v-if="this.$route.query.type==1 && showList">
                <div class="title">专栏</div>
                <div class="list">
                    <ul>
                        <li  v-for="(item,index) of course_list" :key="index">
                            <router-link :to="{path:'/m/column',query:{queryid:item.id}}">{{item.column_title}}</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="searchList" v-if="this.$route.query.type==2 && showList">
                <div class="title">课程</div>
                <div class="list">
                    <ul>
                        <li v-for="(item,index) of course_list"  :key="index">
                            <router-link :to="{path:'/m/course',query:{queryid:item.id}}">{{item.course_title}}</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="searchList" v-if="this.$route.query.type==3 && showList">
                <div class="title">小知识</div>
                <div class="list">
                    <ul>
                        <li  v-for="(item,index) of course_list" :key="index">
                            <router-link :to="{path:'/m/course',query:{queryid:item.id}}">{{item.title}}</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="searchList" v-if="this.$route.query.type==4 && showList">
                <div class="title">正在挑战</div>
                <div class="list">
                    <ul>
                        <li  v-for="(item,index) of course_list" :key="index">{{item.name}}</li>
                    </ul>
                </div>
            </div>
            <div class="searchList"  v-if="this.$route.query.type==5 && showList">
                <div class="title">每日推荐</div>
                <div class="list">
                    <ul>
                        <li v-for="(item,index) of course_list" :key="index">{{item.title}}</li>
                    </ul>
                </div>
            </div>
        </scroller>
        <dialogBar ref="dialogBar"></dialogBar>
    </div>
</template>
<script>
    import dialogBar from '@/components/common/layer'
    export default {
        name: 'search',
        components:{
            dialogBar,
        },
        data(){
            return{
                // column_list:[],// 上拉加载更多的数据存放数组
                course_list:[],
                // knowledge_list:[],
                // game_list:[],
                // recommend_list:[],
                search_name:'',//搜索名
                nodata:false,//没有数据显示缺省页
                pagecur : 0, //页码
                num :20,  // 一次显示多少条
                list_has:true,//是否还有更多
                isfresh:false,//是否刷新
                showList:false,
            }
        },
        methods:{
            getlist(done){
                let that= this;
                let ajaxURL;
                switch(this.$route.query.type){
                    case 1:
                        ajaxURL='/h5/search_column_list';
                        break;
                    case 2:
                        ajaxURL='/h5/search_course_list';
                        break;
                    case 3:
                        ajaxURL='/h5/search_knowledge_list';
                        break;
                    case 4:
                        ajaxURL='/h5/search_game_list';
                        break;
                    case 5:
                        ajaxURL='/h5/search_recommend_list';
                        break;
                }
                this.$axios.post(ajaxURL, {
                    offset:that.pagecur,
                    limit:that.num,
                    search_name:that.search_name
                }).then((res) => {
                    res = res.data;
                    if(res.code==0){
                        that.pagecur++;
                        let list;
                        switch(this.$route.query.type){
                            case 1:
                                list=res.data.column_list;
                                break;
                            case 2:
                                list=res.data.course_list;
                                break;
                            case 3:
                                list=res.data.knowledge_list;
                                break;
                            case 4:
                                list=res.data.game_list;
                                break;
                            case 5:
                                list=res.data.recommend_list;
                                break;
                        }
                        
                        that.list_has=res.data.has_more;
                        if(that.pagecur==1){
                            if(list&&list.length>0){
                                that.showList=true;
                                that.nodata=false;
                            } else {
                                that.showList=false;
                                that.nodata=true;
                            }
                        }
                        if(list&&list.length>0){
                            list.forEach(function (value) {
                                that.course_list.push(value);
                            });
                        }
                        if(typeof(done)=="function"){
                            this.isfresh = false;
                            done();
                        }
                        if(!res.data.has_more){
                            this.$refs.my_scroller.finishInfinite(true);
                            this.$refs.my_scroller.finishPullToRefresh();
                        }
                    }
                });
            },

            toggleModal(content){
                this.$refs.dialogBar.open({
                    type: 1,//自动隐藏
                    content:content,  // 内容
                    time:1,
                })
            },

            infinite:function(done){
                if(this.list_has) {
                    if(this.isfresh){
                    this.$refs.my_scroller.finishInfinite(false);
                    return false;
                }
                    this.getlist(done);
                } else {
                    this.$refs.my_scroller.finishInfinite(true)
                }
            },
            refresh:function(done){
                this.pagecur = 0;//页码
                this.course_list=[];// 上拉加载更多的数据存放数组
                this.nodata=false;
                this.isfresh = true;
                this.getlist(done);
            },
        },
        mounted(){
                this.search_name=this.$route.query.details;
        }
    }
</script>
<style lang="scss" scoped>
    .nodata{
        margin-top:1.2rem;
        img{
            width: 2.6rem;
            height: 1.9rem;
        }
    }
    .search{
        height: 0.5rem;
        width: 100%;
        padding:0.1rem 0 0.1rem 0.15rem;
        background-color: #fff;
        .searchInput{
            height: 0.3rem;
            width: 3rem;
            float: left;
            background-color: #f5f5f5;
            border-radius: 0.04rem;
            padding-left: 0.2rem;
        }
        .cancel{
            color: #32B182;
            font-size: 0.16rem;
            float: left;
            width: 0.6rem;
            height: 0.3rem;
            line-height: 0.3rem;
            padding:0 0.12rem;
        }
    }
    .searchpb{
        padding-bottom:1.2rem;
    }
    .searchList{
        margin-top:0.1rem;
        
        .title{
            height: 0.44rem;
            line-height: 0.44rem;
            font-size: 0.16rem;
            color: #333;
            padding-left: 0.15rem;
            .more{
                margin-right:0.15rem;
                font-size: 0.12rem;
                padding-right:0.12rem;
                color: #999;
                position: relative;
                &.arrowright:after{
                    margin-top: -4px;
                }
            }
        }
        .list{
            background-color: #fff;
            ul{
                padding-left: 0.15rem;
                li{
                    height: 0.44rem;
                    line-height:0.44rem;
                    
                    border-bottom:1px solid #f6f6f6;
                    a{
                        width: 100%;
                        height: 100%;
                        display: block;
                        font-size: 0.14rem;
                        color: #666;
                    }

                }
            }
        }
    }
</style>
