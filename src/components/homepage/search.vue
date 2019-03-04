<template>
    <div class="searchIndex">
        <div class="search">
            <input type="search" name="" class="searchInput" placeholder="请输入关键字搜索" v-model="search_name" @keydown.enter="searchInput()">
            <div class="cancel" @click="searchInput()">搜索</div>
        </div>
        <div class="nodata" v-if="column_list.length==0 && course_list.length==0  && knowledge_list.length==0 && game_list.length==0 && recommend_list==0">
            <img src="../../assets/searchnodata.png">
        </div>
        <div class="searchpb">
            <div class="searchList"  v-if="column_list.length>0">
                <div class="title">专栏
                    <router-link :to="{path:'/m/search_more',query:{type:1,details:this.search_name}}" class="fr more arrowright" v-if="column_list.length>20">更多</router-link>
                </div>
                <div class="list">
                    <ul>
                        <li  v-for="(item,index) of column_list" :key="index">
                            <router-link :to="{path:'/m/column',query:{queryid:item.id}}">{{item.column_title}}</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="searchList" v-if="course_list.length>0">
                <div class="title">课程
                    <router-link :to="{path:'/m/search_more',query:{type:2,details:this.search_name}}" class="fr more arrowright" v-if="course_list.length>20">更多</router-link>
                </div>
                <div class="list">
                    <ul>
                        <li v-for="(item,index) of course_list"  :key="index">
                            <router-link :to="{path:'/m/course',query:{queryid:item.id}}">{{item.course_title}}</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="searchList" v-if="knowledge_list.length>0">
                <div class="title">小知识
                    <router-link :to="{path:'/m/search_more',query:{type:3,details:this.search_name}}" class="fr more arrowright" v-if="knowledge_list.length>20">更多</router-link>
                </div>
                <div class="list">
                    <ul>
                        <li  v-for="(item,index) of knowledge_list" :key="index">
                            <router-link :to="{path:'/m/course',query:{queryid:item.id}}">{{item.title}}</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="searchList" v-if="game_list.length>0">
                <div class="title">正在挑战
                    <router-link :to="{path:'/m/search_more',query:{type:4,details:this.search_name}}" class="fr more arrowright" v-if="game_list.length>20">更多</router-link>
                </div>
                <div class="list">
                    <ul>
                        <li  v-for="(item,index) of game_list" :key="index">{{item.name}}</li>
                    </ul>
                </div>
            </div>
            <div class="searchList"  v-if="recommend_list.length>0">
                <div class="title">每日推荐
                    <router-link :to="{path:'/m/search_more',query:{type:5,details:this.search_name}}" class="fr more arrowright" v-if="recommend_list.length>20">更多</router-link>
                </div>
                <div class="list">
                    <ul>
                        <li v-for="(item,index) of recommend_list" :key="index">{{item.title}}</li>
                    </ul>
                </div>
            </div>
        </div>
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
                column_list:[],
                course_list:[],
                knowledge_list:[],
                game_list:[],
                recommend_list:[],
                search_name:'',
                pagecur : 0, //页码
                num : 20,  // 一次显示多少条
            }
        },
        methods:{
            search_column_list(){
                let that=this;
                this.$axios.post('/h5/search_column_list', {offset:that.pagecur,limit:that.num,search_name:that.search_name}).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        const data = res.data;
                        this.column_list=data.column_list;
                    }
                    else {
                        this.toggleModal(res.msg);
                    }
                })
            },
            search_course_list(){
                let that=this;
                this.$axios.post('/h5/search_course_list', {offset:that.pagecur,limit:that.num,search_name:that.search_name}).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        const data = res.data;
                        this.course_list=data.course_list;
                    }
                    else {
                        this.toggleModal(res.msg);
                    }
                })
            },
            search_knowledge_list(){
                let that=this;
                this.$axios.post('/h5/search_knowledge_list', {offset:that.pagecur,limit:that.num,search_name:that.search_name}).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        const data = res.data;
                        this.column_list=data.knowledge_list;
                    }
                    else {
                        this.toggleModal(res.msg);
                    }
                })
            },
            search_game_list(){
                let that=this;
                this.$axios.post('/h5/search_game_list', {offset:that.pagecur,limit:that.num,search_name:that.search_name}).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        const data = res.data;
                        this.game_list=data.game_list;
                    }
                    else {
                        this.toggleModal(res.msg);
                    }
                })
            },
            search_recommend_list(){
                let that=this;
                this.$axios.post('/h5/search_recommend_list', {offset:that.pagecur,limit:that.num,search_name:that.search_name}).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        const data = res.data;
                        this.recommend_list=data.recommend_list;
                    }
                    else {
                        this.toggleModal(res.msg);
                    }
                })
            },
            searchInput(){
                this.search_column_list();
                this.search_course_list();
                this.search_knowledge_list();
                this.search_game_list();
                this.search_recommend_list()


            }
  

        },
        mounted(){

        }
    }
</script>
<style lang="scss" scoped>
    .searchIndex{
        // background-color: #fff;
    }
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
        .searchInput::-webkit-input-placeholder {
           /* placeholder字体大小  */
           font-size: 0.12rem;
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
