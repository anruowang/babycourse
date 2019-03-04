<template>
  <div>
    <div class="listItem">
      <div class="flex gametime">
        <div class="flex_2 kpic">
          <img :src="course_info.cover">
          <span class="liveicon" v-if="course_info.course_type==4">直播</span>
          <span class="livetime" v-if="course_info.course_type==4">{{course_info.start_time}}</span>
        </div>

        <div class="flex_6 gamedetails">
          <div class="item itemcourse">{{course_info.title}}</div>
          <div class="itembtn">{{course_info.expected_lectures_desc}}</div>
          <div class="price">
            <span class="fl studycount">{{course_info.study_count}}人</span>
          </div>
        </div>
      </div>
    </div>
    <div class="buy-bar" v-if="isBuy==0||is_present==1">
      <div class="order-price fl">
        <span class="fs16">合计：</span><span class="red fs20">¥{{orderMoney}}</span>
      </div>

      <button class="submit-btn orderbtn" @click="submitOrder">确认订单</button>

    </div>

    <dialogBar ref="dialogBar"></dialogBar>
  </div>
</template>
<script>
  import axios from '@/components/apis/index'
  import Footer from '@/components/common/Footer'
  import DialogMob from '@/components/common/layer'
  import  WXPay from "@/components/pay/wxpay";

  export default {
    name: 'column',
    components:{
      'dialogBar': DialogMob,

    },
    data () {
      return {
        nodata:false,
        course_info:{},//栏目详情
        isBuy:null,//是否已购买，0未购买，1已购买
        orderMoney:0,
        querydata:null,
        is_present:'',
      }
    },
    created(){
//      this.course_info=this.order_course_info();
    },
    mounted(){
      this.init();
      this.is_present=this.$route.query.is_present;
    },
    methods: {
      init(){
        let that=this;
        let ajaxURL ='/h5/course_info/'+ this.$route.query.goods_id;
        this.$axios.post(ajaxURL, {
          lzid:this.$route.query.lzid,//分享人id lzid=12345678&uf=1&st=1(选填)
          uf:this.$route.query.uf,//用户来源 0平台 1助手 2机器人(选填)
          st:this.$route.query.st,//分享的渠道0链接 1sharefriend/2sharefriendcircle/3sharecard/4app(选填)
        }).then(res => {
          res = res.data;
          const data=res.data;
          if (res.code == 0) {
            that.course_info=data.course_info;
            that.isBuy=data.course_info.is_buy;
            that.user_info=data.user_info;
            let istype=data.course_info.money_type;
            let limit_time_open=data.course_info.limit_time_open
            let money=data.course_info.money;
            let limit_money=data.course_info.limit_time_money;
            if(istype==2 &&limit_time_open==1){
              that.orderMoney=that.$commonModel.returnFloat(limit_money)
            } else{
              that.orderMoney=that.$commonModel.returnFloat(money)
            }

          }
          else {
            that.toggleModal(res.msg);
          }
        })

      },
      submitOrder(){
        let that=this;
        let columnQuery={
          queryid: this.$route.query.goods_id,//课程或专栏id
          lzid:this.$route.query.lzid,// 邀请人id
          uf:this.$route.query.uf?this.$route.query.queryid:0,//用户来源 0平台 1助手 2机器人(选填)
          st:this.$route.query.st,//分享的渠道0链接 1sharefriend/2sharefriendcircle/3sharecard/4app(选填)
        }
        this.querydata =columnQuery;
        if(this.is_buy==1){ //是否购买 0 无 1已购买
          this.$router.push({path:'/m/course',query:that.querydata})
          return false
        } else {
          let orderdata={
            goods_id: this.$route.query.goods_id,//课程或专栏id
            goods_type:0, //类型 默认0 0课程 1专栏
            is_present: this.$route.query.is_present,//不赠送 1赠送
            lzid:this.$route.query.lzid,// 邀请人id
            uf:this.$route.query.uf?this.$route.query.queryid:0,//用户来源 0平台 1助手 2机器人(选填)
            st:this.$route.query.st,//分享的渠道0链接 1sharefriend/2sharefriendcircle/3sharecard/4app(选填)
          }
          WXPay.order(orderdata,that.payCallback,that.toggleModal)
        }
      },
      payCallback(payed,msg){
        let that=this;
        if(payed==1){
          this.$refs.dialogBar.open({
            type: 2,
            content: msg,  // 内容
            shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
            button: ['确定'], // 按钮内容 默认 知道了
            no () {          // 点击确认回调
              that.$refs.dialogBar.close();
              that.$router.replace({path:'/m/course',query:that.querydata})
            }
          })
        } else {
          that.toggleModal(msg)
        }

      },
      toggleModal(msg){
        let that = this;
        this.$refs.dialogBar.open({
          type: 2,
          content: msg,  // 内容
          shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
          button: ['确定'], // 按钮内容 默认 知道了
          no () {          // 点击确认回调
            that.$refs.dialogBar.close()
          }
        })
      },

    }
  };
</script>
<style lang="scss" scoped>
  @import "../../css/head_tab.scss";
  @import "../../css/column_style.scss";
</style>
