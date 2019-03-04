<template>
  <div>
    <div style="margin-top: 1rem;text-align: center">正在登录。。。</div>
    <dialogBar ref="dialogBar"></dialogBar>
  </div>

</template>
<script>
  import vue from 'vue'
  import DialogMob from '@/components/common/layer'

  export default {
    components: {
      'dialogBar': DialogMob
    },
    mounted(){
      let codeNum = this.$route.query.code;
      let islzid =this.$route.query.lzid?this.$router.query.lzid:'';
      let isuf = this.$route.query.uf?this.$router.query.uf:0;
      let isst = this.$route.query.st?this.$router.query.st:'';
      let lzid='',uf='',st='';
      if(!localStorage.getItem('accessToken')){
        if(codeNum){
          this.anscyFun();
        } else {
          // 跳转到微信授权页面
          let state=localStorage.getItem("beforeLoginUrl")?localStorage.getItem("beforeLoginUrl"):'';
          state = escape(state);
          // alert(state)
          let appId =this.$commonModel.appId;
          if(islzid){
            lzid = 'lzid='+islzid
          }
          if(isuf){
            uf = 'uf='+isuf
          }
          if(isst){
            st = 'st='+isst
          }
          let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" +
            this.$commonModel.baseURL2+"/m/author"+ lzid + uf + st+ "&response_type=code&scope=snsapi_userinfo&state=" + state + "#wechat_redirect"
          window.location.href = url;
        }

      }
      else{
         //如果有token 但是vuex中没有用户登录信息则做登录操作
        this.anscyFun();
      }
    },
    methods: {
      anscyFun(){
        let that=this;
        let codeNum = this.$route.query.code;
        let islzid =this.$route.query.lzid?this.$router.query.lzid:'';
        let isuf = this.$route.query.uf?this.$router.query.uf:0;
        let isst = this.$route.query.st?this.$router.query.st:'';

        let ajaxURL ='/h5/login_wechat_h5';
        console.log(codeNum)
        this.$axios.post(ajaxURL, {
          code: codeNum,
          lzid:islzid,
          uf:isuf,
          st:isst
        }).then(res => {
          res = res.data;
          if (res.code == 0) {
            // 保存用户登录状态(Vuex)'
//            this.$axios.defaults.headers.l=data.token;
            this.$axios.defaults.headers.common['Lztoken'] = res.data.token

            localStorage.setItem('accessToken', res.data.token)
            localStorage.setItem('loginType', 'wechat');
            localStorage.setItem('user_info', JSON.stringify(res.data.user_info));
            setTimeout(() => {
              that.goBeforeLoginUrl() // 页面恢复(进入用户一开始请求的页面)
            }, 1000)

          }
          else {
            that.toggleModal(res.msg);
          }
        })


      },
      goBeforeLoginUrl(){
        let url = localStorage.getItem('beforeLoginUrl');
//        url = url.replace(commonModel.baseURL2, '');
        url = escape(url);
        if (!url || url.indexOf('/m/author') != -1) {
//          router.push('/m')
          this.$router.push({path: '/m'});
        } else {
          if (url == '/') {
            url = '/m'
          }
          this.$router.push({path:unescape(url)});
          localStorage.setItem('beforeLoginUrl', unescape(url))
//          this.$store.loginChat.commit('setBeforeLoginUrl','');
        }
      },

      toggleModal(msg){
        let that=this;
        this.$refs.dialogBar.open({
          type: 2,
          content:msg,  // 内容
          shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
//          logImg1:require('@/assets/avatar.png'),
          button: ['确定'], // 按钮内容 默认 知道了
          no () {          // 点击确认回调
            that.$refs.dialogBar.close()
          }

        })
      },

    }

  }

</script>

