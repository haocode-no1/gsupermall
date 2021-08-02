<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @SwiperImageLoad="SwiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <!-- 监听组件的原生事件增加.native -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>
<script>
  
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView.vue'

  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/common/scroll/Scroll'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import BackTop from 'components/content/backTop/BackTop'
  

  import {getHomeMultidata,
          getHomeGoods
          } from 'network/home'
  import {itemListenerMixin} from 'common/mixin.js';
  

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,        
      TabControl,    
      getHomeGoods,
      GoodsList,
      Scroll,
      BackTop
    },
    mixins: [itemListenerMixin],
    data(){
      return {
        // result: null
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    destroyed(){
      console.log('home destroyed');
    },
    activated(){
      this.$refs.scroll.refresh()
      this.$refs.scroll.scrollTo(0, this.saveY, 0)      
    },
    deactivated(){      
      //1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()    
      //2.取消全局事件的监听
      this.$bus.$off('itemImgLoad', this.itemImgListener)  
    },
    created(){
      //1.请求多个数据
      this.getHomeMultidata()
      //2.请求商品数据
      this.getHomeGoods('pop') 
      this.getHomeGoods('new')
      this.getHomeGoods('sell')     
      
      
    },
    mounted(){            
    },
    methods: {
      
      /* 
        事件监听相关的方法
      */      
      
      tabClick(index){
        switch(index){
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break  
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick(){
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position){
        //1.判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000

        //2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop

      },
      loadMore(){
        this.getHomeGoods(this.currentType)
      },      
      SwiperImageLoad(){        
        //2.获取tabControl的tabOffsetTop    
        //所有组件都有一个属性$el: 用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop   
      },
      /* 
        网络请求相关的方法
      */
      getHomeMultidata(){
        //1.请求多个数据
        getHomeMultidata()
        .then(res => {
          // this.result = res
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type, page)
        .then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          //完成加载更多
          this.$refs.scroll.finshPullUp()
        })
      }      
    }
  }
</script>
<style scoped>
  #home {
    /* padding-top: 44px; */
    /* vh -> viewport hegiht */
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /* 停留效果
    浏览器原生滚动使用
    位置定位: 滑动固定头部导航栏 */
    /* position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    z-index: 9; */
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0px;
    right: 0px;
  }

  

  /* .content {
    height: calc(100% - 49px);     
    overflow: hidden;
  } */
</style>