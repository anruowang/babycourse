<template>
  <div id="bdbox" class="login-main">

    <div class="logo"></div>
    <div class="name"></div>
    <ul class="login-type">
      <li style="margin: 0.9rem auto">
        <router-link class="login-btn" to="/m/author">微信登录</router-link>
      </li>
      <li>
        <div class="top-hr">
            <span>或</span>
        </div>
        <router-link class="phone-btn" to="/m/loginphone">登录</router-link>
      </li>
    </ul>
    <div class="txtinfo">登录即表示您同意该用户协议</div>
  </div>

</template>
<script>

  export default {
    name: 'login',
    mounted(){
      this.boxh();
    },
    methods: {
      boxh(){
        let boxH=document.documentElement.clientHeight;
        document.getElementById("bdbox").style.height=boxH+'px';
      },
    }
  }

</script>

