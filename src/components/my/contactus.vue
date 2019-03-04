<template>
    <div>
        <div class="name">
            <img class="logo" src="../../assets/kapian1@2x.png">
            <div class="logoname">伴伴虎</div>
        </div>
        <div class="contacttype">
            <div class="my-cells">
                <div class="imgdiv">
                    <span class="cpbg-icon"></span>
                </div>
                <div class="txtdiv">11345878895@qq.com</div>
            </div>
            <div class="my-cells">
                <div class="imgdiv">
                    <span class="cpbg-icon"></span>
                </div>
                <div class="txtdiv">wwwdfvv123</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'contactus',
        components:{
          
        },
        data () {
            return {
                  

            }
        },
        methods:{
            
        },
        mounted(){
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../../css/variables.scss';  
    .name{
        text-align:center;
        height: 2.78rem;
        background-color:#fff;
       .logo{
            width: 1.08rem;
            height: 1.08rem;
            margin: 0.65rem auto 0;

        }
        .logoname{
            font-size:0.22rem;
            color:$color;
            padding:0.2rem 0;
        } 
    }
    .contacttype{
        margin-top:0.05rem;
        background-color:#fff;
    }
</style>
