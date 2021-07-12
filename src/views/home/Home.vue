<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control class="tab-control" 
                  :titles="['流行', '新款', '精选']"
                  @tabClick="tabClick"/>
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
        isShowBackTop: false
      }
    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
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
      },
      backClick(){
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position){
        this.isShowBackTop = (-position.y) > 1000
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
        
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

          this.$refs.scroll.finishPullUp()
        })
      }      
    }
  }
</script>
<style scoped>
  #home {
    padding-top: 44px;
    /* vh -> viewport hegiht */
    height: 100vh;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /* 停留效果
    位置定位: 滑动固定头部导航栏 */
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    z-index: 9;
  }
  /* 停留效果 */
  .tab-control {
    position: sticky;
    top: 0px;
    position: relative;
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