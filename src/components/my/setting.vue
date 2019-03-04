<template>
    <div>
        <div class="my-cells">
            <router-link :to="{path:'/m/bindphone'}" class="txtdiv arrowright">绑定手机
                <span v-if="!$commonModel.userInfo('phone_num')" class="introfr">未绑定</span>
                <span v-if="$commonModel.userInfo('phone_num')" class="introfr">已绑定</span>
            </router-link>
        </div>
        <div class="my-cells">
            <router-link :to="{path:'/m/evaluate',query:{type:0}}"class="txtdiv arrowright">意见反馈</router-link><!-- type:0意见反馈 1：评价 -->
        </div>
        <div class="my-cells">
            <router-link :to="{path:'/m/contactus'}" class="txtdiv arrowright">联系我们</router-link>
        </div>
        <div class="tx-c">
            <button class="exitbtn" @click="exit">退出登录</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'setting',
        components:{
          
        },
        data () {
          return {

          }
        },
        methods:{
            exit(){
                window.localStorage.removeItem('user_info');
                window.localStorage.removeItem('accessToken');
                this.$router.push({path:'/m/login'});
            }
        },
        mounted(){
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../../css/variables.scss';
    .my-cells{
        .txtdiv{
            width:100%;
        }
        .introfr{
            float: right;
            margin-right:0.2rem;
            font-size: 0.14rem;
            color: #999;
            width: 2.2rem;
            text-align: right;
        }
    }
    .exitbtn{
        width: 3.03rem;
        height: 0.42rem;
        background-color:$color;
        color:#fff;
        font-size:0.16rem;
        margin-top:0.35rem;
        border-radius: 0.21rem;
    }
</style>
