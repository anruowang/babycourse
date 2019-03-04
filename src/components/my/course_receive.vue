<template>
    <div class="course_receive">
        <template v-if="course_info!=undefined && course_info!=null">
        <div class="title">
            <p class="great">超级棒</p>
            <p class="courseTitle">收到课程<span>《{{course_info.title}}》</span></p>
        </div>
        <div class="given flex">
            <div class="giver_pic">
                <img src="../../assets/avatar.png">
            </div>
            <div class="given_info">
                <div class="per">赠送人：</div>
                <div class="name">{{course_info.nick_name}}</div>
            </div>
        </div>
        <div class="receive_info">
            <div class="slogan">让我们用爱与科学，伴宝宝健康成长！</div>
            <div class="course_pic">
                <img :src="course_info.content_pic">
            </div>
            <div class="tx-c recbtn"><!--  1 可领取 2当前领取人是自己（自己不能赠送给自己）3领取人已经拥有这个课程了 -->
                <button v-if="course_info.status==1" @click="my_course_receive()">领取课程</button>
                <button v-if="course_info.status==2" class="disabled">自己不能赠送给自己</button>
                <button v-if="course_info.status==3" class="disabled">已经被别人领走了，下次早点吧~</button>
                <!-- <p>领取到当前微信账号</p> -->
            </div>
        </div>

        <div class="flex download">
            <div class="logo">
                <img src="">
            </div>
            <div class="downloadTips flex_10">
                <p class="linef">下载伴伴虎</p>
                <p class="lines">伴你开心快乐每一天</p>
            </div>
            <div class="downloadBtn">
                <button>下载APP</button>
            </div>
        </div>
        <dialogBar ref="dialogBar"></dialogBar>
        </template>
    </div>

</template>

<script>
    import dialogBar from '@/components/common/layer';
    export default {
        name: 'course_receive',
        components:{
            dialogBar
        },
        data () {
          return {
            course_info:{},

          }
        },
        methods:{
            my_course_receive(){
                var bbhkey=this.$route.query.bbhkey;
                this.$axios.post('/h5/my_course_receive', {bbhkey:bbhkey}).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                       this.toggleModal('领取成功',1);                         
                    }
                    else {
                        this.toggleModal(res.msg);
                    }
                })
            },
            my_course_give_info(){
                var bbhkey=this.$route.query.bbhkey;
                this.$axios.post('/h5/my_course_give_info', {bbhkey:bbhkey}).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        const data = res.data;
                        this.course_info=data;
                    }else if(res.code == 1){
                        this.$router.push({path:'/m/my'});
                    }
                    else {
                        this.toggleModal(res.msg);
                    }
                })
            },
            toggleModal(msg,param){
                let that=this;
                this.$refs.dialogBar.open({
                    type: 2,
                    content:msg,  // 内容
                    shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
                    button: ['确定'], // 按钮内容 默认 知道了
                    no () {        // 点击确认回调
                        if(param==1){
                            that.$router.push({path:'/m/my/mycourse'});
                        }else{
                            that.$refs.dialogBar.close()
                        }
                       
                    }

                })
            },
        },
        mounted(){
            this.my_course_give_info();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .course_receive{
        background-color: #fff;
        .title{
            padding:0.2rem;
            text-align: center;
            overflow: hidden;
            border-bottom:1px solid #f4f4f4;
            .great{
                font-size: 0.22rem;
                color: #333;
            }
            .courseTitle{
                font-size: 0.16rem;
                color: #666;
                padding:0.08rem 0;
                >span{
                    color:#35BFA5;

                }
            }
        }
        .given{
            padding:0.2rem 0.3rem 0;
            .giver_pic{
                width: 0.54rem;
                height: 0.54rem;
                border-radius: 50%;
            }
            .given_info{
                padding:0 0.1rem;
                .per{
                    font-size: 0.13rem;
                    color: #999;
                }
                .name{
                    font-size: 0.17rem;
                    color:#333;
                    margin-top:0.02rem;
                }
            }
        }
        .receive_info{
            text-align: center;
            padding-bottom:1rem;
            .slogan{
                font-size: 0.17rem;
                padding:0.26rem 0;
            }
            .course_pic{
                width: 3rem;
                height: 1.46rem;
                text-align: center;
                margin: 0 auto;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 0.04rem;
                }
            }
            .recbtn{
                margin-top:0.43rem;
                button{
                    width: 3.03rem;
                    height: 0.42rem;
                    background-color: #35BFA5;
                    color: #fff;
                    border-radius: 0.21rem;
                    font-size: 0.16rem;
                    &.disabled{
                        opacity: 0.6
                    }
                }
                p{
                    font-size: 0.12rem;
                    padding:0.1rem 0;
                    color: #999;
                }
            }
        }
        .download{
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 0.8rem;
            padding:0.13rem 0.3rem;
            background-color: #fff;
            border-top: 1px solid #f4f4f4;
            .logo{
                width: 0.54rem;
                height: 0.54rem;
                background-color: red;
                border-radius: 0.04rem;
            }
            .downloadTips{
                padding:0 0.15rem;
                .linef{
                    font-size: 0.16rem;
                    color:#333;
                }
                .lines{
                    font-size: 0.12rem;
                    color: #999;
                }
            }
            .downloadBtn{
                button{
                   background-color: #35BFA5;
                    color: #fff;
                    width: 0.76rem;
                    height: 0.24rem;
                    border-radius: 0.12rem; 
                }
            }
        }
    }
    
</style>