<template>
    <div>
        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="my_scroller" style="padding-top:0;padding-bottom:0.5rem;">
            <div class="game-recommend">
              <div class="listItem" v-for="(item,index) of recommend_list" :key="index">
                  <div class="datetime">{{$commonModel.daytxt(item.show_time)}}</div>
                  <!-- <div class="flex gametime" v-for="(list,index) of item.data"> -->
                  <router-link  class="flex gametime"  v-for="(list,index) of item.data" :key="index" :to="{path:'/m/game',query:{queryid:list.id}}">
                      <div class="flex_2 kpic">
                          <img :src="list.pic">
                      </div>
                       <div class="flex_6 gamedetails">
                          <div class="item">{{list.title}}</div>
                          <div class="itembtn itembtnp0" v-for="label of list.label">{{label}}</div>
                          <div class="iteminfo">
                            <div class="iteminfo_hidden">{{list.introduce}}</div>
                          </div>
                      </div>
                  <!-- </div> -->
                  </router-link>
              </div>
            </div>
        </scroller>
    </div>
</template>

<script>

export default {
  name: 'game_recommend',
  data () {
    return {
        recommend_list:[],// 上拉加载更多的数据存放数组
        nodata:false,
        pagecur : 0, //页码
        num : 7,  // 一次显示多少条
        isfresh:false,
        list_has:true,//是否有下一页
        }
    },
    methods:{
        game_recommend_list:function(done){
            let that=this;
            this.$axios.post('/h5/game_recommend_list', {offset:that.pagecur,limit:that.num
            }).then(res => {
              res = res.data;
              if (res.code == 0) {
                const data = res.data;
                that.pagecur++;
                that.list_has=data.has_more;
                if(data.game_recommend_list.length>0){
                    var arr=data.game_recommend_list;
                    var map = {},
                    dest = [];
                    for(var i = 0; i < arr.length; i++){
                        var ai = arr[i];
                        if(!map[ai.show_time]){
                            dest.push({
                                show_time: ai.show_time,
                                data: [ai]
                            });
                            map[ai.show_time] = ai;
                        }else{
                            for(var j = 0; j < dest.length; j++){
                                var dj = dest[j];
                                if(dj.show_time == ai.show_time){
                                    dj.data.push(ai);
                                    break;
                                }
                            }
                        }
                    }

//                  console.log(that.recommend_list[0].show_time)
                  let  rec_list=that.recommend_list;
                  if(rec_list.length>0&&dest[0].show_time==rec_list[rec_list.length-1].show_time){
                    dest[0].data.forEach(function (val) {
                      rec_list[rec_list.length - 1].data.push(val);
                    });

                    dest.splice(0, 1);
                    dest.forEach(function (value) {
                      that.recommend_list.push(value);
                    });
                  } else {
                    dest.forEach(function (value) {
                      that.recommend_list.push(value);
                    });
                  }

                }
                if(typeof(done)=="function"){
                    this.isfresh = false;
                    done();
                }
                if(!that.list_has){
                    this.$refs.my_scroller.finishInfinite(true);
                    this.$refs.my_scroller.finishPullToRefresh();
                }
              }
              else {
                this.toggleModal(res.msg);
              }
        })

        },
        infinite(done) {
            if(this.list_has) {
              if(this.isfresh){
                this.$refs.my_scroller.finishInfinite(false);
                return false;
              }
              this.game_recommend_list(done);
            } else {
              this.$refs.my_scroller.finishInfinite(true)
            }
        },
        refresh(done) {
            this.nodata=false;
            this.pagecur = 0;//页码
            this.recommend_list= []; // 上拉更多的数据存放数组
            this.isfresh = true;
            this.game_recommend_list(done);
        }

    },
    mounted(){

    }
}
</script>
<style lang="scss" scoped>
    @import '../../css/variables.scss';
    .datetime{
        font-size:0.18rem;
        color: #999;
        padding:0.15rem 0;
    }

</style>
