<template>
    <div class="phonelogin bindphone">
      <div class="formcell">
        <!-- <label>手机号</label> -->
        <div class="areacode">+86</div>
        <input class="inputcss" type="text" placeholder="手机号" v-model="loginPhone" />
      </div>
      <div class="formcell">
        <!-- <label>验证码</label> -->
        <ul class="codebox">
          <li class="codebar "><input type="text" placeholder="输入验证码" v-model="loginCode" /></li>
          <li class="getcode">
            <input type="button" @click="getCode(this)" :disabled="isSend" v-model="codetxt" />
          </li>
        </ul>
      </div>
      <div style="margin-top: 0.35rem">
        <button class="login-btn" @click="login()">{{isBtnLogin}}</button>
      </div>
      <dialogBar ref="dialogBar"></dialogBar>
    </div>

</template>

<script>
  import commonModel from '@/components/common/common'
  import DialogMob from '@/components/common/layer'
  export default {
    name: 'bindphone',
    components: {
      'dialogBar': DialogMob
    },
    data() {
      return {
        loginPhone: '',
        loginCode: '',
        isBtnLogin: '确定',
        dialogMsg: '',
        codetxt:'获取验证码',
        count:60,
        isSend:false,
        countDown:null,
      }
    },
    created () {

    },
    computed: {

    },
    methods: {
      login() {
        if (!this.loginPhone) {
          this.toggleModal('手机号码不能为空')
          return false;
        } else {
          if(!commonModel.test_phone(this.loginPhone)){
            this.toggleModal('手机号码格式不正确')
            return false;
          }
        }
        if (!this.loginCode) {
          this.toggleModal('请输入验证码')
          return false;
        } else {
          if(!commonModel.test_code(this.loginCode)){
            this.toggleModal('请输入4位数字验证码')
            return false;
          }
        }
        // this.isBtnLogin='登录中...';
        let ajaxURL ='/h5/bind_phone';
        this.$axios.post(ajaxURL, {
          phone_num:this.loginPhone,
          code:this.loginCode,
        }).then(res => {
          res = res.data;
          // this.isBtnLogin='登录'
          if (res.code == 0) {
            this.$axios.defaults.headers.common['Lztoken'] = res.data.token
            localStorage.setItem('accessToken', res.data.token)
            localStorage.setItem('loginType', 'wechat');
            localStorage.setItem('user_info', JSON.stringify(res.data.user_info));

            let beforeLoginUrl=localStorage.getItem("beforeLoginUrl");
            let pathUrl =beforeLoginUrl?beforeLoginUrl:'/m'
            this.$router.push({path: pathUrl});
          }
          else {
            this.toggleModal(res.msg)
          }
        })

      },
      countDown2(){
        if(this.count>0){
          let that=this;
          this.count--;
          this.codetxt='重新发送('+this.count+'s)',
          setTimeout(function () {
            that.countDown2();
          },1000);
        } else {
          this.codetxt='重新获取'
          this.count=60;
          this.isSend=false;
        }
      },
      getCode(){
        if (!this.loginPhone) {
          this.toggleModal('手机号码不能为空')
          return false;
        } else {
          if(!commonModel.test_phone(this.loginPhone)){
            this.toggleModal('手机号码格式不正确')
            return false;
          } else {
            let ajaxURL ='/h5/send_phone_code';
            this.$axios.post(ajaxURL, {
              phone_num:this.loginPhone,// 手机号
              type:2,// 类型 1登录 2绑定手机
            }).then(res => {
              if (res.data.code == 0) {
                  this.isSend=true;
                  if (this.isSend){
                    this.countDown2()//倒计时
                  }
              } else {
                this.toggleModal(res.data.msg)
              }
            });
          }
        }

      },
      toggleModal(content){
        this.$refs.dialogBar.open({
          type: 1,//自动隐藏
          content:content,  // 内容
          time:1,
        })
      },
    }
  }

</script>
<style lang="scss" scoped>
    .bindphone{
        margin: 0;
        width:100%;
        padding-top:0;
        .formcell{
            height: 0.5rem;
            line-height: 0.5rem;
            padding-left:0.43rem;
            border-bottom: 1px solid #f4f4f4;
            font-size:0.16rem;
            .areacode{
                position: absolute;
                top: 0;
                left: 0.43rem;
                // font-size:0.14rem;

            }
            .inputcss{
                padding-left:0.8rem;

            }

        }
        .login-btn{
            width: 80%;
        }
    }
</style>
