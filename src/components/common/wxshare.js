
import Axios from '@/components/apis/index'
import wx from 'weixin-js-sdk'


/**
 *分享
 * @param _this
 * @param shareTitle 标题
 * @param shareUrl 链接
 * @param shareImg 图片
 * @param shareDesc 描述
 */
export const commonShare = (_this, shareTitle, shareUrl, shareImg, shareDesc,maskint) => {
  var url_link=window.location.href.split('#')[0];
  let ajaxURL ='/h5/share_conf';
  Axios.post(ajaxURL, {
    url: url_link
  }).then(res => {
      res = res.data;
    if (res.code == 0) {
      let data = res.data;

      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.wxconfig.appId, // 必填，公众号的唯一标识
        timestamp: data.wxconfig.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.wxconfig.nonceStr, // 必填，生成签名的随机串
        signature: data.wxconfig.signature, // 必填，签名，见附录1
        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(function () {
        wx.onMenuShareTimeline({
          title: shareTitle, // 分享标题
          link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: shareImg, // 分享图标
          success: function () {

            _this.$refs.dialogBar.open({
              type: 2,
              content:"分享成功",  // 内容
              shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
              button: ['确定'], // 按钮内容 默认 知道了
              no () {          // 点击确认回调
                _this.$refs.dialogBar.close()
              }

            })

          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
            _this.$refs.dialogBar.open({
              type: 2,
              content:"取消分享",  // 内容
              shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
              button: ['确定'], // 按钮内容 默认 知道了
              no () {          // 点击确认回调
                _this.$refs.dialogBar.close()
              }

            })
          }
        });
        wx.onMenuShareAppMessage({
          title: shareTitle, // 分享标题
          desc: shareDesc, // 分享描述
          link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: shareImg, // 分享图标
          type: "", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
            _this.$refs.dialogBar.open({
              type: 2,
              content:"分享成功",  // 内容
              shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
              button: ['确定'], // 按钮内容 默认 知道了
              no () {          // 点击确认回调
                _this.$refs.dialogBar.close()
              }

            })
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
            _this.$refs.dialogBar.open({
              type: 2,
              content:"分享成功",  // 内容
              shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
              button: ['确定'], // 按钮内容 默认 知道了
              no () {          // 点击确认回调
                _this.$refs.dialogBar.close()
              }

            })
          }
        });
      });
    }
  }).catch(err => {
    console.log(err)
  })
};
