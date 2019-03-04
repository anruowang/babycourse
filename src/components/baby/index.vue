<template>
  <div>
    <div class="head-menu">
      <ul class="nav">
        <li v-for="(tab ,index) in category_list" :class="{active:$store.state.schoolMod.school==tab.id}" @click="tabsView(tab.id)">{{tab.category_name}}</li>
      </ul>
    </div>
    <scroller :on-refresh="refresh" :on-infinite="infinite" ref="my_scroller" style="padding-top:0.44rem;padding-bottom:0.5rem;">
      <div>
        <banner-swiper :list="banner_list" v-if="bannershow"></banner-swiper>
        <div class="child-index-mian">
          <div class="nodata" v-if="nodata1&&nodata">暂无数据</div>
          <div class="list-section listItem" v-if="showList1">
            <div class="" v-for="(list,index) of listdata1" :key="index">
              <router-link class="flex gametime" :class="{group:list.type==1 || list.type==2}" :to="{path:list.type==0?'/m/course':(list.type==1?'/m/column':(list.type==2?'/m/game':'')),query:{queryid:list.id}}">
                <div class="flex_2 kpic">
                  <img :src="list.cover">
                  <span class="liveicon" v-if="list.course_type==4 ||  list.column_type==4">直播</span>
                  <span class="livetime" v-if="list.course_type==4">{{list.start_time}}</span>
                  <span class="livetime" v-if="list.column_type==4">{{list.start_time}}-{{list.end_time.slice(11)}}</span>
                </div>
                <div class="flex_6 gamedetails" v-if="list.type==2"> <!-- 游戏 -->
                  <div class="item">{{list.title}}</div>
                  <div class="itembtn" v-for="label of list.label">{{label}}</div>
                  <div class="iteminfo">{{list.introduce}}</div>
                </div>
                <div class="flex_6 gamedetails" v-if="list.type==0 || list.type==1"> <!-- 课程 专栏 -->
                  <div class="item" :class="{itemcourse:list.type==0}">{{list.title}}</div>
                  <div class="itembtn" :class="{itembtnp0:list.type==1}">{{list.expected_lectures_desc}}</div>
                  <div class="price">
                    <span class="fl studycount">{{list.study_count}}人</span>
                    <!-- 付费类型 1免费 2 付费 3加密 4必须购买专栏 -->
                    <span class="fr money free" v-if="list.money_type==1">免费</span>
                    <span class="fr money" v-if="list.money_type==2 && list.limit_time_open==2">¥{{$commonModel.returnFloat(list.money)}}</span>
                    <span class="fr money" v-if="list.money_type==2 && list.limit_time_open==1 && list.limit_time_money>0">
                              <del class="oldmoney">¥{{$commonModel.returnFloat(list.money)}}</del>¥{{$commonModel.returnFloat(list.limit_time_money)}}
                            </span>
                    <span class="fr money free" v-if="list.money_type==2 && list.limit_time_open==1 && list.limit_time_money==0">
                              <del class="oldmoney">¥{{$commonModel.returnFloat(list.money)}}</del>限时免费
                            </span>
                    <span class="fr money" v-if="list.money_type==3">加密</span>
                    <span class="fr money" v-if="list.money_type==4">¥{{$commonModel.returnFloat(list.money)}}</span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
          <div class="list-section listItem" v-if="showList">
            <div class="" v-for="(list,index) of listdata" :key="index">
              <router-link class="flex gametime" :class="{group:list.type==1 || list.type==2}" :to="{path:list.type==0?'/m/course':(list.type==1?'/m/column':(list.type==2?'/m/game':'')),query:{queryid:list.id}}">
                    <div class="flex_2 kpic">
                        <img :src="list.cover">
                        <span class="liveicon" v-if="list.course_type==4 ||  list.column_type==4">直播</span>
                        <span class="livetime" v-if="list.course_type==4">{{list.start_time}}</span>
                        <span class="livetime" v-if="list.column_type==4">{{list.start_time}}-{{list.end_time.slice(11)}}</span>
                    </div>
                     <div class="flex_6 gamedetails" v-if="list.type==2"> <!-- 游戏 -->
                        <div class="item">{{list.title}}</div>
                        <div class="itembtn" v-for="label of list.label">{{label}}</div>
                        <div class="iteminfo">{{list.introduce}}</div>
                    </div>
                    <div class="flex_6 gamedetails" v-if="list.type==0 || list.type==1"> <!-- 课程 专栏 -->
                        <div class="item" :class="{itemcourse:list.type==0}">{{list.title}}</div>
                        <div class="itembtn" :class="{itembtnp0:list.type==1}">{{list.expected_lectures_desc}}</div>
                        <div class="price">
                            <span class="fl studycount">{{list.study_count}}人</span>
                            <!-- 付费类型 1免费 2 付费 3加密 4必须购买专栏 -->
                            <span class="fr money free" v-if="list.money_type==1">免费</span>
                            <span class="fr money" v-if="list.money_type==2 && list.limit_time_open==2">¥{{$commonModel.returnFloat(list.money)}}</span>
                            <span class="fr money" v-if="list.money_type==2 && list.limit_time_open==1 && list.limit_time_money>0">
                              <del class="oldmoney">¥{{$commonModel.returnFloat(list.money)}}</del>¥{{$commonModel.returnFloat(list.limit_time_money)}}
                            </span>
                            <span class="fr money free" v-if="list.money_type==2 && list.limit_time_open==1 && list.limit_time_money==0">
                              <del class="oldmoney">¥{{$commonModel.returnFloat(list.money)}}</del>限时免费
                            </span>
                            <span class="fr money" v-if="list.money_type==3">加密</span>
                            <span class="fr money" v-if="list.money_type==4">¥{{$commonModel.returnFloat(list.money)}}</span>
                        </div>
                    </div>
                </router-link>
            </div>
          </div>

        </div>
      </div>
    </scroller>
    <dialogBar ref="dialogBar"></dialogBar>
    <Footer :idx="2"></Footer>
  </div>
</template>
<script>
  import axios from '@/components/apis/index'
  import Footer from '@/components/common/Footer'
  import DialogMob from '@/components/common/layer'
  import bannerSwiper from '@/components/common/Swiper'
  export default {
    name: 'school',
    components:{
      'dialogBar': DialogMob,
      bannerSwiper,
      Footer,
    },
    data () {
      return {
        bannershow:false,
        category_list:[],//导航条数据
        banner_list:[],//banner数据
        showList:true,
        showList1:true,
        nodata:false,
        nodata1:false,
        initView:true,//是否为首次加载
        category_id:'',
        pagecur : 0, //页码
        num : 10,  // 一次显示多少条
        listdata: [],  // 上拉加载更多的数据存放数组
        listdata1:[],//推荐
        list_has:true,//是否还有更多

      }
    },
    created(){
//      this.tabs=this.$store.state.schoolMod.navlist;
    },
    mounted(){
      this.categoryList();
      this.tabsView();
    },
//    mounted: function() {
//      this.onRefresh();
//    },
    methods: {

      categoryList:function () {
        let that=this;
        let ajaxURL ='/h5/category_list';
        this.$axios.post(ajaxURL, {
          c_type:2//1小私塾 2亲子课
        }).then(res => {
          let data = res.data.data;
          if (res.data.code == 0) {
            that.category_list=data.category_list;
            that.$store.dispatch('changeSchool',data.category_list[0].id);//默认选择第一个
          }
          else {
            that.toggleModal(res.data.msg);
            return false;
          }
        })
      },
      tabsView:function(id){
        let that=this;
        let ajaxURL ='/h5/category_parent';
        this.$axios.post(ajaxURL, {
          category_id: id,
        }).then(res => {
          res=res.data;
          const data = res.data;
          if (res.code == 0) {
            that.pagecur=0
            that.initView=false;
            that.listdata=[];
            that.listdata1=[];
            if(data.banner_list&&data.banner_list.length>0){

              that.banner_list=data.banner_list;
              that.bannershow=true;
            } else {
              that.banner_list=[];
              that.bannershow=false;
            }
            if(id==''||id==undefined){
              that.category_id='';
            } else {
              that.category_id=id;
              that.$store.dispatch('changeSchool',id);
            }

            if(data.course_list&&data.course_list.length>0){
              that.listdata1=data.course_list;
            } else {
              that.listdata1=[];
            }
            if(that.pagecur==0){
              that.getlist();//第一次加载列表信息
            }

            if(data.course_list.length>0){
              that.showList1=true;
              that.nodata1=false;
            } else {
              that.showList1=false;
              that.nodata1=true;
            }

          }
          else {
            that.toggleModal(res.msg);
          }
        })
      },
      getlist(done){
        let that= this;
        let ajaxURL='/h5/category_parent_list'
        this.$axios.post(ajaxURL, {
          category_id: that.category_id,
          offset:that.pagecur,
          limit:that.num,
        }).then((response) => {
          let resData = response.data;
          if(resData.code==0){
            that.pagecur++;
            let list=resData.data.course_list;

            that.list_has=resData.data.has_more;
            if(list&&list.length>0){
              that.showList=true;
              that.nodata=false;
              list.forEach(function (value) {
                that.listdata.push(value);
              });
            } else {
              that.showList=false;
              that.nodata=true;
              if(that.pagecur==1){
                that.listdata=[]
              }
            }
            if(typeof(done)=="function"){
              done();
            }
            that.$refs.my_scroller.finishPullToRefresh();
            if ( !that.list_has) {
              that.$refs.my_scroller.finishInfinite(true);
            }
          }
        });
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
      infinite(done) {
        if(this.pagecur==0){
          return false
        }
        if(this.list_has) {
          this.getlist(done);
        } else {
          this.$refs.my_scroller.finishInfinite(true)
        }
      },
      refresh() {
        this.nodata=false;
        this.nodata1=false;
        this.initView=true;//是否为首次加载
        this.pagecur = 0;//页码
        this.listdata= []; // 上拉更多的数据存放数组
        this.listdata1= []; // 推荐
        this.list_has=true;//是否还有更多
        this.tabsView(this.category_id);

      }

    },

  };
</script>
<style lang="scss" scoped>
  @import "../../css/head_tab.scss";
</style>
