import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/login/Login'
import Author from '@/components/login/Author'
import LoginPhone from '@/components/login/PhoneLogin'
import School from '@/components/school'
import Course from '@/components/course'
import CoursePay from '@/components/course/course_pay'
// import CourseLive from '@/components/course/course_live'

import Evaluate from '@/components/common/evaluate'
import Evaluate_details from '@/components/common/evaluate_details'
import Game from '@/components/game'

import Column from '@/components/column'
import ColumnPay from '@/components/column/column_pay'
import Baby from '@/components/baby'
import Sknowledge from '@/components/homepage/sknowledge'
import Gamelist from '@/components/homepage/gamelist'
import Game_recommend from '@/components/homepage/game_recommend'
import Search from '@/components/homepage/search'
import Search_more from '@/components/homepage/search_more'

import My from '@/components/my'
import Mycourse from '@/components/my/mycourse'
import Setting from '@/components/my/setting'
import Bindphone from '@/components/my/bindphone'
import Contactus from '@/components/my/contactus'
import User_concern from '@/components/my/user_concern'
import Message from '@/components/my/message'
import Addbaby from '@/components/my/addbaby'
import Mycollect from '@/components/my/mycollect'
import Babyinfo from '@/components/my/babyinfo'
import Babydaily from '@/components/my/babydaily'
import Myinfo from '@/components/my/myinfo'
import Course_receive from '@/components/my/course_receive'

import Challenge from '@/components/challenge/Challenge'
import ChallengeVideo from '@/components/challenge/video'
import AudioPlayer from '@/components/common/AudioPlayer'

Vue.use(Router)
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/m',
      name: 'index',
      component: Index,
      meta: {
        title:"伴伴虎首页",
        content: ''
      }
    },
    {
      path: '/m/login',//登录页
      name: 'login',
      component: Login,
      meta: {
        title:"登录页",
        content: ''
      }
    },
    {
      path: '/m/author',//微信登录授权中间页
      name: 'author',
      component: Author,
      meta: {
        title:"微信登录授权中",
        content: ''
      }
    },
    {
      path: '/m/loginphone',//手机登录
      name: 'loginphone',
      component: LoginPhone,
      meta: {
        title:"手机登录",
        content: ''
      }
    },
    {
      path: '/m/school',//小私塾
      name: 'school',
      component: School,
      meta: {
        title:"小私塾",
        content: ''
      }
    },
    {
      path: '/m/course',//课程
      name: 'course',
      component: Course,
      meta: {
        title:"课程",
        content: ''
      }
    },
    {
      path: '/m/course_pay',//课程订单支付页
      name: 'coursepay',
      component: CoursePay,
      meta: {
        title:"",
        content: ''
      }
    },
    // {
    //   path: '/m/course_live',//课程直播间
    //   name: 'courselive',
    //   component: CourseLive,
    //   meta: {
    //     title:"直播间",
    //     content: ''
    //   }
    // },
    {
      path: '/m/column',//专栏
      name: 'column',
      component: Column,
      meta: {
        title:"专栏",
        content: ''
      }
    },
    {
      path: '/m/column_pay',//专栏支付页
      name: 'columnpay',
      component: ColumnPay,
      meta: {
        title:"确认订单",
        content: ''
      }
    },
    {
      path: '/m/baby',//亲子课
      name: 'baby',
      component: Baby,
      meta: {
        title:"亲子课",
        content: ''
      }
    },
    {
      path: '/m/sknowledge',//小知识
      name: 'sknowledge',
      component: Sknowledge,
      meta: {
        title:"小知识首页",
        content: ''
      }
    },
    {
      path: '/m/gamelist',//游戏-正在挑战
      name: 'gamelist',
      component: Gamelist,
      meta: {
        title:"正在挑战",
        content: ''
      }
    },
    {
      path: '/m/game_recommend',//游戏-每日推荐
      name: 'game_recommend',
      component: Game_recommend,
      meta: {
        title:"每日推荐",
        content: ''
      }
    },
    {
      path: '/m/my',//我的
      name: 'my',
      component: My,
      meta: {
        title:"我的",
      }
    },
    {
      path: '/m/mycourse',//我的课程
      name: 'mycourse',
      component: Mycourse,
      meta: {
        title:"我的课程",
      }
    },
    {
      path: '/m/setting',//我的设置
      name: 'setting',
      component: Setting,
      meta: {
        title:"设置",
      }
    },
    {
      path: '/m/bindphone',//绑定手机
      name: 'bindphone',
      component: Bindphone,
      meta: {
        title:"绑定手机",
      }
    },
    {
      path: '/m/contactus',//联系我们
      name: 'contactus',
      component: Contactus,
      meta: {
        title:"联系我们",
      }
    },
    {
      path: '/m/user_concern',//我的关注
      name: 'user_concern',
      component: User_concern,
      meta: {
        title:"我的关注",
      }
    },
    {
      path: '/m/message',//我的消息
      name: 'message',
      component: Message,
      meta: {
        title:"我的消息",
      }
    },
    {
      path: '/m/evaluate',//意见反馈
      name: 'evaluate',
      component: Evaluate,
      meta: {
        title:"意见反馈",
      }
    },
    {
      path: '/m/evaluate_details',//意见反馈
      name: 'evaluate_details',
      component: Evaluate_details,
      // meta: {
      //   title:"意见反馈",
      // }
    },
    {
      path: '/m/addbaby',//添加宝宝
      name: 'addbaby',
      component: Addbaby,
      meta: {
        title:"宝宝资料",
      }
    },
    {
      path: '/m/mycollect',//我的收藏
      name: 'mycollect',
      component: Mycollect,
      meta: {
        title:"我的收藏",
      }
    },
    {
      path: '/m/babyinfo',//修改宝宝信息
      name: 'babyinfo',
      component: Babyinfo,
      meta: {
        title:"宝宝资料",
      }
    },
    {
      path: '/m/babydaily',//宝宝成长日记
      name: 'babydaily',
      component: Babydaily,
      meta: {
        title:"宝宝成长日记",
      }
    },
    {
      path: '/m/myinfo',//编辑个人信息
      name: 'myinfo',
      component: Myinfo,
      meta: {
        title:"编辑个人信息",
      }
    },
    {
      path: '/m/challenge',//挑战详情
      name: 'challenge',
      component: Challenge,
      meta: {
        title:"挑战详情",
      }
    },
    {
      path: '/m/challenge_video',//挑战视频
      name: 'challengevideo',
      component: ChallengeVideo,
      meta: {
        title:"挑战视频",
      }
    },
    {
      path: '/m/game',//游戏详情
      name: 'game',
      component: Game,
      meta: {
        title:"游戏详情",
      }
    },
    {
      path: '/m/course_receive',//领取课程详情
      name: 'course_receive',
      component: Course_receive,
      meta: {
        title:"领取",
      }
    },
    {
      path: '/m/search',//搜索
      name: 'search',
      component: Search,
      meta: {
        title:"搜索",
      }
    },
    {
      path: '/m/search_more',//搜索更多
      name: 'search_more',
      component: Search_more,
      // meta: {
      //   title:"搜索",
      // }
    },
    {
      path: '/m/audioplay',//搜索
      name: 'audioplay',
      component: AudioPlayer,
      meta: {
        title:"阅读小知识",
      }
    },
  ]
})
