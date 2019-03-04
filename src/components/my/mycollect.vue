<template>
    <div>
        <div class="radio-group">
            <span v-for="(item,index) in tabs" :class="{cur: item.collect_type == collect_type}" @click="tab(item.collect_type)">{{item.name}}</span>
            <div class="cradio-group" v-if="collect_type != 3">
                <span v-for="(citem, cindex) in ctabs" :class="{tabactive: cindex == category_id}" @click="ctab(cindex)">{{citem.name}}</span>
            </div>
        </div>

            <scroller :on-refresh="refresh" :on-infinite="infinite" ref="my_scroller" class="scrollerdiv" :class="{scrollerdivnone: collect_type == 3, isNotData:nodata}">
                <div class="gamelist clearfix" >
                    <div class="nodata" v-if="nodata">暂无数据</div>
                    <template v-for="(v,index) of list">
                        <div class="course">
                            <router-link class="" :to="{path:(v.goods_type==0)?('/m/course'):('/m/column'),query:{queryid:v.goods_id}}">
                                <img :src="v.info.cover">
                                <div v-if="v.info.course_type == 4 || v.info.column_type == 4">
                                    <span class="live">直播</span>
                                    <span class="time">{{v.create_time}}</span>
                                </div>
                                <div class="showtime">{{v.info.title}}</div>
                                <div class="collecttime">{{v.create_time}}</div>
                            </router-link>
                        </div>
                    </template>
                </div>
            </scroller>

    </div>
</template>

<script>
import dialogBar from '@/components/common/layer';
export default {
    name: 'mycollect',
    components:{dialogBar},
    data () {
        return {
            list:[],// 上拉加载更多的数据存放数组
            nodata:false,
            pagecur : 0, //页码
            num : 5,  // 一次显示多少条
            isfresh:false,//是否刷新
            list_has:true,//是否还有更多数据
            collect_type:1,
            category_id:0,
            tabs: [],
            ctabs: [],
            istab:false,//是否切换
        }
    },
    methods:{
        toggleModal(msg){
            let that=this;
            this.$refs.dialogBar.open({
                type: 2,
                content:msg,  // 内容
                shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
                button: ['确定'], // 按钮内容 默认 知道了
                no () {          // 点击确认回调
                   that.$refs.dialogBar.close()
                }

            })
        },
        tab(index,done){
            if(this.collect_type == index){
                return false;
            }
            this.collect_type = index;
            this.ctabs = this.tabs[index-1].collect_info;
            this.category_id = 0;
            this.istab = true;
            this.pagecur = 0;
            this.nodata = false;
            this.get_more_list(done);
        },
        ctab(index){
            if(this.category_id == index){
                return false;
            }
            this.category_id = index;
            this.istab = true;
            this.pagecur = 0;
            this.nodata = false;
            this.get_more_list();
        },
        get_more_list:function(done){
            let that=this;
            this.$axios.post('/h5/collect_list', {offset: that.pagecur, limit: that.num, collect_type: that.collect_type, category_id: that.category_id 
            }).then(res => {
                res = res.data;
                //切换数据后列表清空标记切换完成
                if(that.istab){
                    that.list = [];
                    that.istab = false;
                }
                //第一页就没有数据时候显示缺省页
                if(that.pagecur == 0 && res.data.list.length == 0 || this.nodata){
                    this.nodata = true;
                    return false;
                }
                if (res.code == 0) {
                    const data = res.data;
                    that.pagecur++;
                    that.list_has = data.has_more;
                    if(data.list && data.list.length > 0){
                        data.list.forEach(function (value) {
                            that.list.push(value);
                        });
                    }
                    if(typeof(done)=="function"){
                        that.isfresh = false;
                        done();
                    }
                    that.list_has = data.has_more;
                    this.$refs.my_scroller.finishInfinite(!that.list_has);
                }else {
                    this.toggleModal(res.msg);
                }
            })
        },
        infinite(done) {
            if(!this.isfresh && this.list_has){
                this.get_more_list(done);
            }else{
                this.$refs.my_scroller.finishInfinite(!this.list_has);
            }
        },
        refresh(done) {
            this.nodata=false;
            this.pagecur = 0;//页码
            this.list= []; // 上拉更多的数据存放数组
            this.isfresh = true;
            this.list_has = true;
            this.get_more_list(done);
        },
    },
    mounted(){
        this.$axios.post('/h5/collect_category', {}).then(res => {
            res = res.data;
            let that = this;
            if(res.code == 0){
                that.tabs = res.data;
                that.ctabs = that.tabs[0].collect_info;
            }else {
                this.toggleModal(res.msg);
            }
        })
    },
}
</script>
<style lang="scss" scoped>
    @import "../../css/head_tab.scss";
    .radio-group{
        position: fixed;
        left: 0;
        top: 0;
        background-color: #fff;
        z-index: 99;
        width: 100%;
        &>span{
            width:33.3%;
        }
    }
    .cradio-group{
        padding-left: 0.4rem;
        height: 0.44rem;
        background-color: #f4f4f4;
        &>span{
            width: 0.65rem;
            height: 0.25rem;
            background-color: #E3E3E3;
            display: inline-block;
            line-height: 0.25rem;
            margin-right: 0.2rem;
            border-radius: 0.125rem;
            font-size: 0.12rem;
            text-align: center;
            color: #999;
            border: 1px solid #999;
            &.tabactive{
                background-color: #CFE8DF;
                border:1px solid #32B182;
                color: #32B182;
            }
        }
    }
    .scrollerdiv{
        padding-top: 0.88rem;
    }
    .scrollerdivnone{
        padding-top: 0.54rem;
    }
    .gamelist{
        padding:0 0.15rem;
        .course{
            top: 0;
            width:3.45rem;
            height: 1.22rem;
            background-color: #fff;
            margin-bottom: 0.2rem;
            position: relative;
            &:nth-child(2n+1){
                margin-right: 0.17rem;  
            }
            img{
                margin: 0.1rem;
                width:1.45rem;
                height: 1.02rem;
            }
            .showtime{
                position: absolute;
                top:0.1rem;
                left: 1.65rem;
                font-size: 0.16rem;
                color: #000;
            }
            .live{
                position: absolute;
                top: 0.15rem;
                left: 1.13rem;
                background-color: rgba(0, 0, 0, 0.4);
                color: #fff;
                font-size: 0.1rem;
                width: 0.32rem;
                line-height: 0.14rem;
                height: 0.14rem;
                text-align: center;
                border-radius: 0.07rem
            }
            .time{
                position: absolute;
                bottom: 0.1rem;
                left: 0.1rem;
                background-color: #FED13A;
                color: #fff;
                height: 0.15rem;
                width:1.45rem;
                text-align: center;
            }
            .collecttime{
                position: absolute;
                left: 1.65rem;
                bottom: 0.16rem;
                color:#999999;
                font-size: 0.12rem;
            }
        }  
    }
</style>