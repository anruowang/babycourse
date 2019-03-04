<template>
    <div>
        <textarea placeholder="请输入......" v-model="content" maxlength="300"></textarea>
        <div class="com-upload-img" v-if="this.$route.query.type!=1 && this.$route.query.type!=5">
            <div class="img_group">
                <div class="uploadimg clearfix">
                    <div class="imgarea" v-for="(item,index) in imgArr" :key="index">
                        <img :src="item">
                        <span class="close" @click="deleteImg(index)"></span>
                    </div>
                    <div class="img_box" v-if="allowAddImg">
                        <input type="file" accept="image/*" multiple="multiple" @change="changeImg($event)">
                        <div class="filter"></div>
                    </div>
                </div>

            </div>
        </div>
        <template v-if="this.$route.query.type==0"><!-- 0:意见反馈 1：游戏评价  3.成长日记 4.课程评价 5 游戏打卡详情页评价-->
            <div class="my-cells">
                <input type="text" name="" class="contactway" placeholder="您的联系方式（QQ/微信、手机号、邮箱）" v-model="contact_method">
            </div>
            <div class="tx-c">
                <button class="release" @click="feedback_add()">发布</button>
            </div>
        </template>

        <template v-if="this.$route.query.type==2 || this.$route.query.type==3">
            <div class="my-cells   arrowright">
                添加到成长日记
                <select class="babyname" v-model="selected">
                    <option  v-for="item of nickname"  :value="item.id">{{item.nickname}}</option>
                </select>
            </div>
        </template>

        <template v-if="this.$route.query.type!=0">
            <div class="tx-c">
                <button class="release" @click="add_send()">发布</button>
            </div>
        </template>
        <div class="shareimg" v-show="show" @click="hideimg()">
            <img :src="gamecard">
        </div>
        <dialogBar ref="dialogBar"></dialogBar>
    </div>
</template>

<script>
import dialogBar from '@/components/common/layer'
export default {
    name:'index',
    components:{
        dialogBar
    },
    data () {
        return {
            content:'',
            contact_method:'',
            evaluate:'',
            contactway:'',
            imgData:'',
            imgArr:[],
            imgSrc:[],
            allowAddImg:true,
            nickname:[],
            selected:localStorage.getItem('babyid')?localStorage.getItem('babyid'):'',
            gamecard:'',
            show:false
        }
    },
    created(){
      if(this.$route.query.type==1){
        let challenge_swiperinfo=localStorage.getItem("challenge_swiperinfo")
        if(challenge_swiperinfo&&challenge_swiperinfo.video_title){
            document.title=challenge_swiperinfo.video_title;
        } else {
            document.title="挑战视频"
        }

        }
        if(this.$route.query.type==2){
            document.title="打卡"
        }
        if(this.$route.query.type==3){
            document.title="成长日记"
        }
        if(this.$route.query.type==4){
            document.title="课程评价"
        }
        if(this.$route.query.type==5){
            document.title="游戏评价"
        }

    },
    methods: {
        changeImg: function(e) {
            var that = this;
            var imgLimit = 1024;
            var files = e.target.files;
            var image = new Image();
            if(files.length>0){
                var dd = 0;
                var timer = setInterval(function(){
                if(files.item(dd).type != 'image/png'&&files.item(dd).type != 'image/jpeg'&&files.item(dd).type != 'image/gif'){
                    return false;
                }

                if(files.item(dd).size>imgLimit*102400){
                    //to do sth
                }else{
                    image.src = window.URL.createObjectURL(files.item(dd));
                    image.onload = function(){
                        // 默认按比例压缩
                        var w = image.width,
                        h = image.height,
                        scale = w / h;
                        w = 200;
                        h = w / scale;
                        // 默认图片质量为0.7，quality值越小，所绘制出的图像越模糊
                        var quality = 0.7;
                        //生成canvas
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        // 创建属性节点
                        var anw = document.createAttribute("width");
                        anw.nodeValue = w;
                        var anh = document.createAttribute("height");
                        anh.nodeValue = h;
                        canvas.setAttributeNode(anw);
                        canvas.setAttributeNode(anh);
                        ctx.drawImage(image, 0, 0, w, h);
                        var ext = image.src.substring(image.src.lastIndexOf(".")+1).toLowerCase();//图片格式
                        // var base64;
                        var base64 = canvas.toDataURL("image/"+ext, quality );
                        // console.log(base64);
                        that.getimgurl(base64);
                        // 回调函数返回base64的值
                        if(that.imgArr.length<=8){
                            that.imgArr.unshift('');
                            that.imgArr.splice(0, 1, base64);//替换数组数据的方法，此处不能使用：this.imgArr[index] = url;
                            if(that.imgArr.length>=9){
                                that.allowAddImg = false;
                            }
                        }
                    }
                }


                if(dd<files.length-1){
                    dd++;
                }else{
                    clearInterval(timer);
                }
                },1000)
            }
        },
        deleteImg: function(index){
            this.imgArr.splice(index,1);
            if(this.imgArr.length<9){
                this.allowAddImg = true;
            }
        },
        getimgurl:function(imgurl){
            this.$axios.post('/h5/img_upload', {img_data:imgurl}).then(res => {
                res = res.data;
                if (res.code == 0) {
                    this.imgSrc.push(res.data);
                    console.log(this.imgSrc);
                }
                else {
                    this.toggleModal(res.msg);
                }
            })
        },
        feedback_add:function(){
            if (!this.content) {
                this.toggleModal_tip('内容不能为空')
                return false;
            }
            if (!this.contact_method) {
                this.toggleModal_tip('联系方式不能为空')
                return false;
            }
            this.$axios.post('/h5/feedback_add', {content:this.content,pictures:this.imgSrc.join(),contact_method:this.contact_method}).then(res => {
                res = res.data;
                if (res.code == 0) {
                    this.toggleModal('提交成功',0);
                }
                else {
                    this.toggleModal(res.msg);
                }
            })
        },
        post_send(){
            let column_id=this.$route.query.column_id;
            let game_id=this.$route.query.game_id;
            let h_type=this.$route.query.type;
            let data={column_id:column_id,game_id:game_id,h_type: h_type,content:this.content,source_url:this.imgSrc.join(),baby_ids:this.selected};
            if (!this.content) {
                this.toggleModal_tip('内容不能为空')
                return false;
            }
            this.$axios.post('/h5/post_send',data).then(res => {
                res = res.data;
                if (res.code == 0) {
                    this.toggleModal('评价成功',2);
                }
                else {
                    this.toggleModal(res.msg);
                }
            })
        },
        add_send(){
            if (!this.content) {
                this.toggleModal_tip('内容不能为空')
                return false;
            }
            let h_type=this.$route.query.type;//评价类型
            let column_id=this.$route.query.column_id;
            let game_id=this.$route.query.game_id;//游戏id
            let post_id=this.$route.query.post_id;//帖子id
            let game_title=this.$route.query.title;//游戏标题
            let data;
            if(h_type==1){
                data={post_id:this.$route.query.game_id,content:this.content};
            }else if(h_type==2){
                data={game_title:game_title,game_id:game_id,h_type:h_type,content:this.content,source_url:this.imgSrc.join(),baby_ids:this.selected};
            }else if(h_type==3){
                data={h_type:h_type,content:this.content,source_url:this.imgSrc.join(),baby_ids:this.selected};
            }else if(h_type==4){
                data={column_id:column_id,game_id:game_id,h_type: h_type,content:this.content,source_url:this.imgSrc.join()};
            }else if(h_type==5){
                data={post_id:this.$route.query.post_id,content:this.content};
            }
            

            if(h_type==1){//视频挑战
                this.$axios.post('/h5/post_comment_send',data).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        this.toggleModal('发布成功',1);
                    }
                    else {
                      this.toggleModal(res.msg);
                    }
                })
            }else if(h_type==5){
                this.$axios.post('/h5/post_comment_send',data).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                      this.toggleModal('发布成功',5);
                    }
                    else {
                      this.toggleModal(res.msg);
                    }
                })
            }else{
                this.$axios.post('/h5/post_send',data).then(res => {
                    res = res.data;
                    if (res.code == 0) {
                        if(h_type==2){
                            this.gamecard=res.data;
                            this.show=!this.show;
                        }else{

                            this.toggleModal('发布成功',0);
                        }
                    }
                    else {
                      this.toggleModal(res.msg);
                    }
                })
            }
        },
        baby_list(){
            if(this.$route.query.type!=3 && this.$route.query.type!=2){
                return false;
            }
            this.$axios.post('/h5/baby_list', {}).then(res => {
                res = res.data;
                if (res.code == 0) {
                    const data = res.data.list;
                    this.nickname=data;
                }
                else{
                    this.toggleModal(res.msg);
                }
            })
        },
        hideimg(){
            this.show=false;
        },
        toggleModal(msg,param){
            let that=this;
            let game_id=this.$route.query.game_id;//游戏id
            let post_id=this.$route.query.post_id;//帖子id
            this.$refs.dialogBar.open({
                type: 2,
                content:msg,  // 内容
                shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
                button: ['确定'], // 按钮内容 默认 知道了
                no () {          // 点击确认回调
                    if(param==2){
                        this.$router.push({path:'/m/course',query:{queryid:this.$route.query.game_id}});
                    }else if(param==1){
                        this.$router.push({path:'/m/challenge_video',query:{
                            is_game:this.$route.query.is_game,
                            p_id:this.$route.query.game_id,}
                        });
                        localStorage.setItem("challenge_video_type","video")
                    }else if(param==5){
                        this.$router.push({path:'/m/evaluate_details',query:{type:5,post_id:post_id,game_id:game_id}});
                    }
                    else{
                        this.$router.push({path:'/m/my'});
                    }
                    that.$refs.dialogBar.close()
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
        this.baby_list();
    },
}
</script>

<style lang="scss" scoped>
    @import '../../css/variables.scss';
    .shareimg{
        position: absolute;
        left:0;
        top:0;
        width: 0;
        min-height: 6.02rem;
        padding:0.4rem;
        width: 100%;
        background-color: rgba(0,0,0,0.6);
        z-index: 999;
        img{
            width: 100%;
            height: 100%;
        }
    }

    .img_box{
        width: 0.91rem;
        height: 0.91rem;
        position: relative;
        background: url(../../assets/tianjai6@2x.png);
        background-size: cover;
        input{
            width: 0.91rem;
            height: 0.91rem;
            opacity: 0;
            padding:0.15rem 0 0.15rem 0.3rem;
        }

    }
    textarea{
        height: 1.44rem;
        width: 3.43rem;
        border:1px solid #fff;
        padding:0.15rem;
        display: block;
        font-size: 0.15rem;
        line-height: 1.5;

    }
    .uploadimg{
        padding:0.15rem 0 0.15rem 0.3rem;
        background-color: #fff;
        border-top:1px solid #f4f4f4;
        border-bottom:1px solid #f4f4f4;

        img{
            width: 100%;
            height: 100%;
            border-radius: 0.08rem;

        }
        .imgarea,.img_box{
            float: left;
        }
        .imgarea{
            width: 0.91rem;
            height: 0.91rem;
            background-size: cover;
            float: left;
            margin-right: 0.2rem;
            margin-bottom: 0.1rem;
            position: relative;
            .close{
                width: 0.28rem;
                height: 0.28rem;
                position: absolute;
                top: 0;
                right: 0;
                background: url(../../assets/4shanchu@2x.png);
                background-size:cover;
            }
        }

    }
    .contactway{
        width: 100%;
        height: 100%;
    }
    .release{
        width: 3.03rem;
        height: 0.42rem;
        background-color: #32B182;
        color: #fff;
        font-size: 0.16rem;
        margin-top: 0.35rem;
        border-radius: 0.21rem;
    }
    .my-cells{
        line-height:0.45rem;
        padding: 0 0.2rem;
        font-size: 0.15rem;
        &:after{
            right:0.2rem;
            width: 10px;
            height: 10px;
            margin-top:-5px;
        }
        .babyname{
            float: right;
            color: #999;
            height: 100%;
            margin-right: 0.1rem;
            font-size: 0.15rem;
            max-width: 1.9rem;
            overflow: hidden;
        }
    }
</style>
