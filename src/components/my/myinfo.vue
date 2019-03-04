<template>
    <div class="addbaby">
        <div class="my-cells babypic">
            <div class="txtdiv">头像
                <img  :src="avatar">
                <input type="file" id="file" name="file" @change="changeImage($event)">
            </div>
        </div>
        <div class="my-cells">
            <div class="txtdiv">昵称
                <input class="birthday babyname" type="text" name="" placeholder="请输入昵称" v-model.trim="babyname">
            </div>
        </div>
        
        
        <div class="tx-c" style="margin-top:0.35rem;">
            <button class="finishbtn" @click="user_modify()">提交</button>
        </div>
        <dialogBar ref="dialogBar"></dialogBar>
    </div>
</template>

<script>
    import dialogBar from '@/components/common/layer'
    export default {
        name: 'myinfo',
        components:{
            dialogBar
        },
        data () {
            return {
               avatar:require('@/assets/avatar.png'),
               file:'',
               babyname:'',
            }
        },
        methods:{
            changeImage(e){
                let file = e.target.files[0] || e.dataTransfer.files[0];
                if (file) {
                    this.file=file;
                    let reader = new FileReader();
                    let that=this;
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        that.avatar = this.result
                    }
                      
                }
            },
            user_modify(){
                if (!this.babyname) {
                    this.toggleModal_tip('昵称不能为空')
                    return false;
                }
                
                this.$axios.post('/h5/user_modify', {nickname:this.babyname,user_pic:this.avatar}).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        this.toggleModal('成功修改个人信息！');
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
                        this.babyname=data.nickname;
                    }
                    else {
                      this.toggleModal(res.msg);
                    }
                })
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
            },
            toggleModal_tip(content){
                this.$refs.dialogBar.open({
                  type: 1,//自动隐藏
                  content:content,  // 内容
                  time:1,
                })
              },
        },
        mounted(){
            this.user_info();
        },
        watch:{
            babynamemax(){
                if (this.babyname.length > this.babynamemax) {
                    this.toggleModal('宝宝昵称在0-20个字符之间');
                    this.babyname = String(this.babyname).slice(0, this.babynamemax);
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../../css/variables.scss';  
    .addbaby{
        margin-top:0.1rem;
        select,.birthday{
            float: right;
            height: 100%;
            margin-right:0.2rem;
            color:#999;
        }
        .birthday_r{
            margin-right: 0;
            text-align: right;
        }
        .my-cells{
            .txtdiv{
                width: 100%
            }
        } 
        .babypic{
            height: 0.79rem;
            position: relative;
            .txtdiv{
                height: 0.79rem;
                line-height:0.79rem;
            }
            img,input{
                width: 0.48rem;
                height: 0.48rem;
                float: right;
                margin-right: 0.2rem;
                margin-top:0.16rem;
                border-radius: 50%
            }
            input{
                border:1px solid #333;
                position: absolute;
                right: 0;
                top:0;
                opacity: 0;
                z-index:99;
            }

        }
        .finishbtn{
            width: 3.03rem;
            height: 0.42rem;
            background-color:$color;
            color:#fff;
            font-size:0.16rem;
            margin-top:0.25rem;
            border-radius: 0.21rem;
        }
        .babyname{
            width:2.8rem;
            text-align: right;
        }
    }
</style>
