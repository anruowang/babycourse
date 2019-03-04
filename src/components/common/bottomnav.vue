<template>
    <div class="footer">
        <div v-for='(item,index) of items' :class='[item.cls,{on:index === idx}]' @click="$router.push(item.push)">
            <img :src="index===idx?item.iconSelect:item.icon">
            <p :class="['colorChange',{on:index===idx}]" >{{item.name}}</p>
        </div>
    </div>
</template>
 
<script type="text/javascript">    
    export default{
        name: 'bottomnav',
        props:['idx'],
        data(){
            return {
                items:[{
                    cls:"home",
                    name:"首页",
                    push:"/m",
                    icon:require("../../assets/houyeweixuanhzong@2x.png"),
                    iconSelect:require("../../assets/shouyexuanzhong@2x.png")
                },
                {
                    cls:"shares",
                    name:"小私塾",
                    push:"/m/school",
                    icon:require("../../assets/xiaosishuweixuanzhong@2x.png"),
                    iconSelect:require("../../assets/xiaosishuxuanzhong@2x.png")
                },
                {
                    cla:"community",
                    name:"亲子课",
                    push:"/m/baby",
                    icon:require("../../assets/qinzikeweixuanhzong@2x.png"),
                    iconSelect:require("../../assets/qingzikexuanzhong@2x.png")
                },
                {
                    cla:"mine",
                    name:"我的",
                    push:"/m/my",
                    icon:require("../../assets/wodeweixhuanzhong@2x.png"),
                    iconSelect:require("../../assets/wodexuanzhong@2x.png")
                }]
            }
        }
    } 
</script>
<style lang="scss" scoped>
    .footer{
        display: flex;
        position: absolute;
        left: 0;
        bottom: 0;
        box-sizing: border-box;
        height: 0.5rem;
        background: #fff;
        border-top: 1px solid #e5e5e5;
        width: 100%;}
        div{
            flex: 1;
            font-size: 0.12rem;
            text-align:center;
        }
        div img{
            width: 0.22rem;
            height: 0.22rem;
            margin-top:0.05rem;

        }
        div p{
            color:#666;
            font-size: 0.12rem;
        }
        .on{
            color:#32B182;
        }


</style>