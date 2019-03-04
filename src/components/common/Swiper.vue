<template>
  <div>
    <swiper :options="swiperOption" v-if="showSwiper">
      <swiper-slide v-for="item of list" :key="item.id">
        <router-link  :to="{path:item.goods_type==0?'/m/course':(item.goods_type==1?'/m/column':(item.goods_type==2?'/m/game':'')),query:{queryid:item.id,type:item.money_type}}"><img class="swiper-img" :src="item.img_url" /></router-link>
      </swiper-slide>
      <div class="swiper-pagination"  v-if="list.length>1" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
export default {
    name: 'HomeSwiper',
    props: {
        list: Array
    },
    data () {
        return {
            swiperOption: {
            //分页器设置         
            pagination: {
                el: '.swiper-pagination',
                clickable :true,
                type: 'custom',
                //自定义分页器样式
                renderCustom: function (swiper, current, total) {
                    const activeColor = '#168fed'
                    const normalColor = '#aeaeae'
                    let color = ''
                    let paginationStyle = ''
                    let html = ''
                    for (let i = 1; i <= total; i++) {
                        if (i === current) {
                            color = activeColor
                        }else {
                          color = normalColor
                        }
                        paginationStyle = `background:${color};opacity:1;margin-right:0.1rem;width:0.08rem;height:0.08rem;border-radius:50%;`
                        html += `<span class="swiper-pagination-bullet" style=${paginationStyle}></span>`
                    }
                    return html
                }
            },
            autoplay: {
                delay: 3000,
                stopOnLastSlide: false,
                disableOnInteraction: true,
            },
            loop: true
            }
        }
      },
    computed: {
        showSwiper () {
            return this.list.length
        }
      }
    }
</script>
<style>
  .swiper-slide{
    width:100%
  }
  .swiper-slide img{
    width:100%;
    height: 1.68rem
  }
</style>
