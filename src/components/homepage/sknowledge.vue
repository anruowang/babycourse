<template>
    <div class="sknowledge">

        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="my_scroller">
          <div class="nodata" v-if="nodata">暂无数据</div>
          <div v-if="showList">
            <div class="updatecount">已更新{{update_amount}}个</div>
            <div class="listItem" v-for="(list,index) of knowledge_list" :key="index">
                <div class="flex gametime">
                    <div class="flex_2 kpic">
                        <img :src="list.pic">
                        <span class="livetime">{{list.show_time}}</span>
                    </div>
                    <div class="flex_6 gamedetails">
                        <div class="item itemcourse">{{list.title}}</div>
                        <div class="itembtn"></div>
                        <div class="price">
                            <span class="fl">{{list.study_count}}人学过</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </scroller>

        <dialogBar ref="dialogBar"></dialogBar>
    </div>
</template>
<script>
    import dialogBar from '@/components/common/layer'
    export default {
        name: 'sknowledge',
        components:{
            dialogBar,
        },
        data(){
            return{
                update_amount:null,
                knowledge_list:[],// 上拉加载更多的数据存放数组
                nodata:false,
                pagecur : 0, //页码
                num :5,  // 一次显示多少条
                list_has:true,//是否还有更多
                isfresh:false,
                showList:false,
            }
        },
      methods:{
          getlist(done){
            let that= this;
            let ajaxURL='/h5/general_knowledge_list'
            this.$axios.post(ajaxURL, {
              offset:that.pagecur,
              limit:that.num,
            }).then((response) => {
              let resData = response.data;
              if(resData.code==0){
                that.pagecur++;
                let list=resData.data.general_knowledge_list;
                that.list_has=resData.data.has_more;
                if(that.pagecur==1){
                    if(list&&list.length>0){
                      that.showList=true;
                      that.nodata=false;
                    } else {
                      that.showList=false;
                      that.nodata=true;
                    }
                }
                if(list&&list.length>0){
                  list.forEach(function (value) {
                    that.knowledge_list.push(value);
                  });
                }
                if(typeof(done)=="function"){
                  this.isfresh = false;
                  done();
                }
                if(!resData.data.has_more){
                  this.$refs.my_scroller.finishInfinite(true);
                  this.$refs.my_scroller.finishPullToRefresh();
                }
              }
            });
          },

           toggleModal(content){
                this.$refs.dialogBar.open({
                    type: 1,//自动隐藏
                    content:content,  // 内容
                    time:1,
                })
            },


          infinite:function(done){
            if(this.list_has) {
              if(this.isfresh){
                this.$refs.my_scroller.finishInfinite(false);
                return false;
              }
              this.getlist(done);
            } else {
              this.$refs.my_scroller.finishInfinite(true)
            }

          },
          refresh:function(done){
            this.pagecur = 0;//页码
            this.knowledge_list=[];// 上拉加载更多的数据存放数组
            this.nodata=false;
            this.isfresh = true;
            this.getlist(done);
          },

        },
    }
</script>
<style lang="scss" scoped>
    .sknowledge{
        .updatecount{
            padding:0.2rem 0.15rem;
            color: #999999;
            font-size: 0.16rem;
        }
        .listItem{
            padding: 0 0.15rem;
            .fl{
                color: #999;
            }
        }
    }
    .pull-to-refresh-layer{
        margin-top:-160px !important;
    }
</style>
