<template>
    <div class="addbaby">
        <div class="my-cells babypic">
            <div class="txtdiv arrowright">头像
                <img  :src="avatar">
                <input type="file" id="file" name="file" @change="changeImage($event)" @blur="baby_modify()">
            </div>
        </div>
        <div class="my-cells">
            <div class="txtdiv arrowright">昵称
                <input class="birthday babyname" type="text" name="" placeholder="请输入昵称" v-model.trim="babyname" @blur="baby_modify()">
            </div>
        </div>
        <div class="my-cells">
            <div class="txtdiv arrowright">性别
                <select v-model="selected" @blur="baby_modify()">
                    <option v-for="option in babysex" :value="option.value">{{option.name}}</option>
                </select>
            </div>
        </div>
        <div class="my-cells">
            <div class="txtdiv arrowright">生日
                <input class="birthday birthday_r" type="date" name="" placeholder="请选择日期" v-model="babybirth" @blur="baby_modify()">
            </div>
        </div>
        <div class="tx-c" style="margin-top:0.35rem;">
            <button class="finishbtn" @click="deletebaby()">删除宝宝</button>
            <router-link :to="{path:'/m/my/addbaby'}" v-if="this.baby_list.length<2">
                <button class="finishbtn" style="background-color:#FED13A">添加宝宝</button>
            </router-link>
        </div>
        <dialogBar ref="dialogBar"></dialogBar>
    </div>
</template>

<script>
    import dialogBar from '@/components/common/layer'
    export default {
        name: 'babyinfo',
        components:{
            dialogBar
        },
        data () {
            return {
               avatar:require('@/assets/avatar.png'),
               file:'',
               babyname:'',
               babynamemax:'20',
               babysex:[{name:'男',value:1},{name:'女',value:2}],
               selected:1,
               babybirth:'',
               babyrela:'妈妈',
               baby_list:[]
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
            baby_modify(){
                let babyid=this.$route.query.babyid;
                if (!this.babyname) {
                    this.toggleModal_tip('宝宝昵称不能为空')
                    return false;
                }
                if (!this.babybirth) {
                    this.toggleModal_tip('宝宝生日不能为空')
                    return false;
                }
                
                this.$axios.post('/h5/baby_modify', {baby_id:babyid,nickname:this.babyname,sex:this.selected,birthday:this.babybirth,logo:this.avatar}).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                      // this.toggleModal('成功添加宝宝！');
                    }
                    else {
                      this.toggleModal(res.msg);
                    }
                })
            },
            babylist(){
                let babyid=this.$route.query.babyid;
                this.$axios.post('/h5/baby_list', {}).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        const data=res.data.list;
                        this.baby_list=data;
                        for(let i=0;i<data.length;i++){
                            if(data[i].id==babyid){
                                this.avatar=data[i].logo;
                                this.babyname=data[i].nickname;
                                this.selected=data[i].sex;
                                this.babybirth=data[i].birthday;
                            }
                        }
                    }
                    else {
                      this.toggleModal(res.msg);
                    }
                })
            },
            deletebaby(){
                let babyid=this.$route.query.babyid;
                let that=this;
                this.$refs.dialogBar.open({
                    type: 2,
                    content:'确定删除宝宝吗',  // 内容
                    shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
                    button: ['取消','确定'], // 按钮内容 默认 知道了
                    yes () {          // 点击确认回调
                        that.$refs.dialogBar.close();
                        this.$axios.post('/h5/baby_del', {baby_id:babyid}).then(res => {
                            res = res.data;
                            if (res.code == 0) {
                              that.$router.push({path:'/m/my'});
                            }
                            else {
                              that.toggleModal(res.msg);
                            }
                        })
                    },
                    no(){
                        that.$refs.dialogBar.close();
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
                       that.$router.push({path:'/m/my'});
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
            this.babylist();
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
