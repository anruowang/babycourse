<template>
    <div class="second">
        <div class="gamepic">
            <img :src="swiperPic" v-if="bannershow">
        </div>
        <div class="listItem">
            <div>
                <div class="title">正在挑战<router-link :to="{path:'/m/gamelist'}" class="fr more">更多</router-link></div>
                <div class="flex">
                    <div class="flex_2 challenge" v-for="item of game_list" @click="toChallenge(item.id)">
                        <img :src="item.pic">
                    </div>
                </div>
            </div>

            <div>
                <div class="title">每日推荐<router-link :to="{path:'/m/game_recommend'}" class="fr more">更多</router-link></div>
                <div class="babyname">
                    <span  v-if="baby_info.length>0" v-for="(item,index) in baby_info"
                        :class="{active:item.id == tabnum}"
                        @click="tab(item.id)"
                        :key="item.id"
                        >
                        {{item.nickname}}
                    </span>
                </div>
            </div>

            <div class="tabCon" v-for="item of recommend_list">
                <div class="datetime">{{item.name}}</div>
                <router-link  class="flex gametime"  v-for="(list,index) of item.data_list" :key="index" :to="{path:'/m/game',query:{queryid:list.id}}" >
                <!-- <div class="flex gametime" v-for="list of item.data_list"> -->
                    <div class="flex_2 kpic">
                        <img :src="list.pic">
                    </div>
                     <div class="flex_6 gamedetails">
                        <div class="item">{{list.title}}</div>
                        <div class="itembtn itembtnp0" v-for="label of list.label">{{label}}</div>
                        <div class="iteminfo">
                            <div class="iteminfo_hidden">{{list.introduce}}</div>
                        </div>
                    </div>
                <!-- </div> -->
                </router-link>
            </div>

        </div>
        <dialogBar ref="dialogBar"></dialogBar>
    </div>
</template>
<script>
    import dialogBar from '@/components/common/layer'
    import HomeSwiper from '@/components/common/Swiper'
    export default {
        name: 'second',
        components:{
            HomeSwiper,
            dialogBar
        },
        data(){
            return{
                swiperPic: '',//一张图片
                game_list:[],
                baby_info:[],
                recommend_list:[],
                bannershow:false,
            }
        },

        methods:{
            getHomeInfo(param){
                this.$axios.post('/h5/game_hall', {baby_id:param}).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        const data = res.data;
                        if(data.ad_list.length>0){
                            this.swiperPic = data.ad_list[0].img_url;
                            this.bannershow=true;
                        }else{
                            this.bannershow=false;
                        }
                        
                        this.game_list=data.game_list;
                        this.recommend_list=data.recommend_list;
                    }
                    else {
                        this.toggleModal(res.msg);
                    }
                })

            },
            tab(param) {
                this.getHomeInfo(param);
                this.$store.dispatch('updateBabyId',param);
                // this.$store.dispatch('updateBabyName',param);
                localStorage.setItem('babyid',param)
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
            toChallenge(id){
              this.$router.push({path:'/m/challenge',query:{game_id:id}})
            }

        },
        mounted(){
            if(localStorage.getItem('babyid')){
                this.getHomeInfo(this.$store.state.indexMod.babyid);
            }else{
                this.getHomeInfo(0);
            }

            if(window.localStorage.baby_info!=undefined && window.localStorage.baby_info!=null){
                this.baby_info=JSON.parse(window.localStorage.baby_info)
            }
        },
        computed:{
          tabnum(){
            return this.$store.state.indexMod.babyid
          },
        },
        watch:{
             tabnum(oldVal,newVal){
                // console.log(this.$store.state.indexMod.babyid)
                this.tab( this.$store.state.indexMod.babyid)
                 
             }
        },
    }
</script>
<style lang="scss" scoped>
    .second{
        background-color: #fff;
    }
    .gamepic{
        width: 100%;
        height: 1.5rem;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .listItem{
        padding-bottom:0.6rem;
        .gametime{
            border:1px solid #e5e5e5;
            margin-bottom:0;
            .gamedetails{
                 .iteminfo{
                    position: absolute;
                    bottom: 0;
                 }
            }
        }

        .more{
            padding-right:0.14rem;
            background:url(../../assets/gengduo@2x.png) no-repeat right center;
            background-size: 0.12rem 0.12rem;
            font-size: 0.12rem;
            color: #999;
            margin-top:0.06rem;
        }
        .challenge{
            width:1.64rem;
            &:first-child{
                margin-right: 0.17rem;
            }
            img{
                width:1.64rem;
                height: 1.64rem;
                border-radius:0.06rem;
            }
        }
        .babyname{
            span{
                max-width: 1.4rem;
                height: 0.3rem;
                padding:0 0.06rem;
                font-size: 0.16rem;
                margin-right:0.15rem;
                background-color: #EBEBEB;
                border: 1px solid #999;
                border-radius: 0.15rem;
                line-height: 0.3rem;
                text-align: center;
                display: inline-block;
                &.active{
                    background-color:#D6EFE6;
                    border:1px solid #32B182;
                    color: #32B182;
                }
            }

        }
        .datetime{
            font-size:0.18rem;
            color: #999;
            padding:0.15rem 0;
        }
    }
</style>
