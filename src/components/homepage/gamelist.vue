<template>
    <div>
        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="my_scroller" style="padding-top:0;padding-bottom:0.5rem;">
            <div class="gamelist clearfix">
                <div class="nodata" v-if="nodata">暂无数据</div>
                <div class="challenge" v-if="game_list.length>0" v-for="(list,index) of game_list" :key="index" @click="toChallenge(list.id)">
                    <img :src="list.pic">
                    <div class="showtime">{{list.show_time}}</div>
                    <div class="playPic"></div>
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>

export default {
  name: 'gamelist',
  data () {
    return {
            game_list:[],// 上拉加载更多的数据存放数组
            nodata:false,
            pagecur : 0, //页码
            num : 10,  // 一次显示多少条
            isfresh:false,
            list_has:true//是否有下一页
        }
    },
    methods:{
        game_list_show:function(done){
            let that=this;
            this.$axios.post('/h5/game_list', {offset:that.pagecur,limit:that.num
            }).then(res => {
              res = res.data;
              if (res.code == 0) {
                const data = res.data;
                that.pagecur++;
                that.list_has=data.has_more;
                if(data.game_list.length>0){
                    data.game_list.forEach(function (value) {
                        that.game_list.push(value);
                    });
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
              this.game_list_show(done);
            } else {
              this.$refs.my_scroller.finishInfinite(true)
            }
        },
        refresh(done) {
            this.nodata=false;
            this.pagecur = 0;//页码
            this.game_list= []; // 上拉更多的数据存放数组
            this.isfresh = true;
            this.game_list_show(done);
        },
        toChallenge(id){
              this.$router.push({path:'/m/challenge',query:{game_id:id}})
        }
    },
    mounted(){
    }
}
</script>
<style lang="scss" scoped>
    @import '../../css/variables.scss';
    .gamelist{
        padding:0.23rem 0.15rem;
        .challenge{
            width:1.64rem;
            float: left;
            margin-bottom: 0.2rem;
            position: relative;
            .playPic{
                position: absolute;
                left: 0.6rem;
                top: 0.6rem;
                background:url(../../assets/anytinganniu112@2x.png);
                width: 0.44rem;
                height: 0.44rem;
                background-size: cover;

            }
            &:nth-child(2n+1){
                margin-right: 0.17rem;
            }
            img{
                width:1.64rem;
                height: 1.64rem;
                border-radius:0.05rem;
            }
            .showtime{
                position: absolute;
                bottom:0rem;
                left: 0;
                font-size: 0.12rem;
                color: #fff;
                width: 100%;
                height: 0.18rem;
                line-height: 0.18rem;
                background-color: rgba(0,0,0,0.6);
                text-align: center;
            }
        }
    }



</style>
