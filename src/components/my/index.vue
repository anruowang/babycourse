<template>
    <div class="index">
        <div class="my" :style="{backgroundImage: 'url(' + avatar + ')', backgroundSize:'cover'}" style="position:relative;-webkit-filter: blur(6px);"></div>
        <div class="my" style="position:absolute;left:0;top:0;background-color: rgba(0,0,0,0.12);">
            <div class="setmessage">
                <router-link :to="{path:'/m/setting'}" class="myset"></router-link>
                <router-link :to="{path:'/m/message'}" class="mymessage">
                    <i v-if="this.message_count>0"></i>
                </router-link>
            </div>
            <router-link :to="{path:'/m/myinfo'}" class="flex">
                <div class="avatarpic">
                    <img :src="avatar">
                </div>
                <div class="nickname arrowright">{{this.nickname}}</div>
            </router-link>
            <template v-if="this.babylist.length==0">
                <router-link :to="{path:'/m/addbaby'}" class="babyinfo flex">
                    <div><img src="../../assets/avatar.png"></div>
                    <div class="flex_10" style="line-height0.28rem;">添加宝宝信息</div>
                    <div class="add">+</div>
                </router-link>
            </template>
            <template  v-if="this.babylist.length==1">
                <router-link :to="{path:'/m/babyinfo',query:{babyid:item.id}}" class="babyinfo flex" v-for="(item,index) of babylist" :key="index">
                    <div><img :src="item.logo"></div>
                    <div class="babyname">{{item.nickname}}</div>
                    <div class="onebabyage flex_4 tx-r">{{item.age}}</div>
                </router-link>
            </template>
            <template v-if="this.babylist.length==2">
                <div class=" babyinfo flex" style="padding:0;">
                    <router-link :to="{path:'/m/babyinfo',query:{babyid:item.id}}" class="flex_2 flex babypr"  v-for="(item,index) of babylist" :key="index" style="height:0.58rem">
                        <div style="padding-left:0.15rem;"><img :src="item.logo"></div>
                        <div class="flex_6">
                            <div class="babyname">{{item.nickname}}</div>
                            <div class="babyage">{{item.age}}</div>
                        </div>
                        <div class="babysex" :class="{babysexman:item.sex==1}"></div>
                    </router-link>
                </div>
            </template>
        </div>
        <div class="grownote tx-c">
            <!-- <router-link :to="{path:'/m/my/babydaily'}" > -->
                <button @click="baby_daily()">宝宝成长日记</button>
            <!-- </router-link> -->
        </div>
        <div class="my-cells">
            <div class="imgdiv">
                <span class="cpbg-icon"></span>
            </div>
            <div class="txtdiv arrowright">测评报告</div>
        </div>
        <router-link :to="{path:'/m/mycourse'}" class="my-cells">
            <div class="imgdiv">
                <span class="wdkc-icon"></span>
            </div>
            <div class="txtdiv arrowright">我的课程</div>
        </router-link>
        <router-link :to="{path:'/m/mycollect'}" class="my-cells">
            <div class="imgdiv">
                <span class="wdsc-icon"></span>
            </div>
            <div class="txtdiv arrowright">我的收藏</div>
        </router-link>
        <router-link :to="{path:'/m/user_concern'}" class="my-cells">
            <div class="imgdiv">
                <span class="wdgz-icon"></span>
            </div>
            <div class="txtdiv arrowright">我的关注</div>
        </router-link>
        <!-- <router-link :to="{path:'/m/my/user_concern'}" class="my-cells">
            <div class="imgdiv">
                <span class="wdgz-icon"></span>
            </div>
            <div class="txtdiv arrowright">课程评价</div>
        </router-link> -->
        <!-- <div class="my-cells">
            <div class="imgdiv">
                <span class="wdqd-icon"></span>
            </div>
            <div class="txtdiv arrowright">我的签到</div>
        </div> -->
        
        <dialogBar ref="dialogBar"></dialogBar>
        <Footer :idx="3"></Footer>
    </div>

</template>

<script>
    import Footer from '@/components/common/Footer'
    import dialogBar from '@/components/common/layer'
    export default {
        name: 'index',
        components:{
          Footer,
          dialogBar
        },
        data () {
          return {
            babylist:[],
            avatar:'',
            nickname:'',
            message_count:'',
          }
        },
        methods:{
            baby_list(){
                this.$axios.post('/h5/baby_list', {}).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        const data = res.data.list;
                        this.babylist=data;
                        window.localStorage.baby_info=JSON.stringify(data);
                        if(JSON.stringify(data) != "{}" && data.length>0){
                            if(this.babylist.length==1){
                                window.localStorage.setItem('babyid',data[0].id)
                            }
                        }
                        
                        // console.log(this.babylist.length);
                    }
                    else {
                        this.toggleModal(res.msg);
                    }
                })

            },
            user_info(){
                this.$axios.post('/h5/user_info', {}).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        const data=res.data;
                        this.avatar=data.user_pic;
                        // console.log(data.user_pic);
                        this.nickname=data.nickname;
                        this.message_count=data.message_count;
                    }
                    else {
                      this.toggleModal(res.msg);
                    }
                })
            },
            baby_daily(){
                if(this.babylist.length>0){
                    this.$router.push({path:'/m/babydaily'});
                }else{
                    this.toggleModal('请先添加宝宝');
                }
            },
            toggleModal(msg){
                let that=this;
                this.$refs.dialogBar.open({
                    type: 2,
                    content:msg,  // 内容
                    shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
                    button: ['确定'], // 按钮内容 默认 知道了
                    no () {          // 点击确认回调
                       this.$router.push({path:'/m/my'});
                    }

                })
            }
        },
        mounted(){
            this.baby_list();
            this.user_info();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
 @import '../../css/variables.scss';
    .index{
        padding-bottom:0.6rem;
    }
    .my{
        // background:url(../../assets/mybg.png) no-repeat;
        width: 100%;
        height: 1.8rem;
        // background-size: cover;
        padding: 0.2rem 0.15rem 0.56rem;
        position: relative;
        .setmessage{
            height: 0.44rem;
            .myset{
                width: 0.18rem;
                height: 0.18rem;
                float: left;
                background: url(../../assets/shezhi@2x.png);
                background-size:cover;
            }
            .mymessage{
                width: 0.18rem;
                height: 0.18rem;
                float: right;
                background: url(../../assets/xiaoxi@2x.png);
                background-size:cover;
                position: relative;
                i{
                    width: 0.1rem;
                    height: 0.1rem;
                    background-color: red;
                    position: absolute;
                    border-radius: 0.05rem;
                    right: -0.1rem;
                    top: -0.04rem;
                }
            }
        }
        .flex{
            height: 0.64rem;
            width: 100%;
            color: #999;
            &.babypr{
                position: relative;
            }
            .avatarpic{
                width: 0.64rem;
                img{
                    width:0.64rem;
                    height: 0.64rem;
                    border-radius: 50%;
                }
                 
            }
            .nickname{
                width: 2.81rem;
                padding:0 0.16rem;
                font-size: 0.16rem;
                color: #fff;
                position: relative;
                &:after{
                    border-color:#fff;
                    width: 8px;
                    height: 8px;
                }
            }
        }
        .babyinfo{
            width: 3.45rem;
            height: 0.58rem;
            position: absolute;
            bottom:-0.29rem;
            left: 0.15rem;
            background-color:#fff;
            border-radius: 0.04rem;
            font-size: 0.16rem;
            color: #999;
            // display: block;
            padding:0.15rem;
            &>div{
                float: left;
            }
            img{
                width: 0.3rem;
                height: 0.3rem;
                border-radius: 50%;
                margin-right:0.1rem;
            }
            .babyname{
                overflow: hidden;
                width: 1.2rem;
                height: 0.28rem;
                line-height: 0.28rem;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 0.14rem;
                font-weight:bold;
                color: #333;
            }
            .onebabyage{
                height: 0.28rem;
                line-height: 0.28rem;
                font-size: 0.11rem;
                float: right;
            }
            .babyage{
                font-size: 0.11rem;
                height: 0.16rem;
                overflow: hidden;
                width:1.2rem;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .babysex{
                width: 0.2rem;
                height: 0.2rem;
                border-radius:100% 0 0 0;
                background-color:#FFB8CF;
                position: absolute;
                right: 0;
                bottom: 0;
                &.babysexman{
                    background-color: #B8D9FF;
                }
            }
            .add{
                font-size: 0.28rem;
                color: #32B182;
                margin-left:1.2rem
            }
        }
        
    }
    .grownote{
        margin-top:0.57rem;
        margin-bottom:0.25rem;
        border-radius: 0.04rem;
        width: 3.45rem;
        button{
            width: 1.8rem;
            height: 0.44rem;
            border-radius: 0.22rem;
            background-color: $color;
            color: #fff;
            font-size: 0.16rem;
        }
    }

</style>
