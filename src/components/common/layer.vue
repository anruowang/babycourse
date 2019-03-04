<template>
  <div class="mask" v-if="layershow">
    <div class="layermbox">
      <div class="laymshade" :class="{'laymshadeBgNo': type >= 2 ? false : shade}" @click="laymshadeClose"></div>
      <div class="layermmain" :class="layermmain[type]">
        <template v-if="type == 0">
          <transition name="fade">
            <div class="layermchild">
              <div class="logBox" v-if="layershow">
               <img class="img1" :src="logImg1" v-if="logImg1" alt=""/>
                <img class="img2" :src="logImg2" v-if="logImg2" alt=""/>
              </div>
            </div>
          </transition>
        </template>
        <template v-if="type == 1">
          <div class="section">
            <transition name="fade">
              <div class="layermchild layermPrompts" v-if="layershow">
                <section class="layermcont">
                  <!--<img class="img" :src="imgurl"/>-->
                 <img class="img" :src="imgurl" v-if="imgurl" alt=""/>
                  <p class="text">{{content}}</p>
                </section>
              </div>
            </transition>
          </div>
        </template>
        <template v-if="type == 2">
          <div class="section">
            <transition name="fade">
              <div class="layermchild" v-if="layershow">
                <section class="layermcont">
                  <p>{{content}}</p>
                </section>
                <div class="layermbtn">
                  <span class="layermspan" v-for="(item, index) in button" @click="sure(index)">{{ item }}</span>
                </div>
              </div>
            </transition>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    name: 'dialogBar',
    props: {
      isShow: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        layershow: false, // 是否显示弹出框
        type: 0, // 显示类型：0：无内容，1：1秒后自动隐藏，2：有取消、确认按钮
        shade: true, // 蒙层
        shadeClose: false, // 蒙层是否点击隐藏
        imgurl: '', // 默认类型是1的 图标
        content: '全力加载中',  // 默认内容
        button: ['确定'], // 默认按钮
        logImg1: '',  // type为1时-加载图标require('')
        logImg2: '',  // type为2时-加载图标
        time: 20, // 倒计时隐藏时间
        callback: '', // 是否回调-type大于1
        no: '', // 点击取消按钮回调
        yes: '' // 点击确认按钮回调
      }
    },
    created () {
      this.layermmain = ['layermmain0', 'layermmain1', 'layermmain2']
      this.imgurl_ = ['error', 'success', 'collection']
    },
    methods: {
      open (opt) {
        this.close()
        if (opt) {
          // console.log(opt)
          let cloneObj = JSON.parse(JSON.stringify(this.$data))
          for (var key in opt) {
            this.$data[key] = opt[key]
          }
          if (opt.imgurl) {
            this.$data['imgurl'] = require('@/assets/' + opt.imgurl)
          }
          this.layershow = true
          if (this.time && this.type === 1) {
            setTimeout(() => {
              this.close()
              this.callback && this.callback()
            }, this.time * 1000)
            return false
          }
        }
        this.callback && this.callback()
      },
      sure (index) {
        if (this.button.length > 1) {
          if (index === 0) {
            this.no && this.no()
          } else {
            this.yes && this.yes()
          }
          return false
        }
        this.no && this.no()
        this.close()
      },
      close () {
        this.layershow = false
        this.type = 0
        this.shade = true
        this.shadeClose = false
        this.imgurl = ''
        this.content = '全力加载中'
        this.button = ['确定']
      },
      laymshadeClose () {
        this.shadeClose && this.close()
      }
    },
    computed: {}
  }
</script>

<style lang="scss">
    @import "./../../css/layer.scss";
</style>
