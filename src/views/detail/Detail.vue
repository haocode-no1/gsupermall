<template>
  <div id="detail" >
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :paramInfo="paramInfo" ref="params"/>
      <detail-comment-info :commentInfo="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommend"/>      
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top id="backTop" @click.native="backClick" v-show="isShowBackTop"></back-top>
    <!-- <toast :message="message" :show="show"/> -->
  </div>
</template>
  
<script>
  import DetailNavBar from './childComps/DetailNavBar.vue'
  import DetailSwiper from './childComps/DetailSwiper.vue'
  import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
  import DetailShopInfo from './childComps/DetailShopInfo.vue'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
  import DetailParamInfo from './childComps/DetailParamInfo.vue'
  import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
  import DetailBottomBar from './childComps/DetailBottomBar.vue'


  import Scroll from 'components/common/scroll/Scroll'  
  import GoodsList from 'components/content/goods/GoodsList'

  // import Toast from 'components/common/toast/Toast'  

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail.js'
  import {itemListenerMixin, backTopMixin} from 'common/mixin.js'
  import {debounce} from 'common/utils'

  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      // Toast
        
    },
    mixins: [itemListenerMixin, backTopMixin],
    data(){
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    created(){
      //1.保存出入的iid
      this.iid = this.$route.params.iid

      //2.根据iid请求详情数据
      getDetail(this.iid).then(res => {

        // console.log(res);

        const data = res.result
        //1.获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages

        //2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        //3.获取店铺信息
        this.shop = new Shop(data.shopInfo)

        //4.获取店铺底部推荐商品数据
        this.detailInfo = data.detailInfo

        //5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //6.获取评论的信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]          
        }        
        
      })
    
      //3.请求推荐数据
      getRecommend().then(res => {
        // console.log(res)
        this.recommends = res.data.list
      })

      //4.给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
        this.themeTopYs.push(Number.MAX_VALUE)

        // console.log(this.themeTopYs);
      }, 200)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad(){
        this.$refs.scroll.refresh()

        this.getThemeTopY()
      },
      titleClick(index){
        // console.log(index)
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
      },      
      contentScroll(position){
        //console.log(position)
        //1.获取y值
        const positionY = -position.y
        //2.positionY和主题中的值进行对比
        let length = this.themeTopYs.length
        //1.普通方法 
        /*
        for(let i = 0; i < length; i++){     
           if( this.currentIndex !== i &&
              (  ( i < length - 1 && positionY >= this.themeTopYs[i] 
                &&  positionY < this.themeTopYs[i+1] ) 
                ||  ( i === length -1 && positionY >= this.themeTopYs[i] )
              )
            ){
                this.currentIndex = i
                this.$refs.nav.currentIndex = this.currentIndex
              } 
        }*/
        //2.hack方法
        for(let i = 0; i < length - 1; i++){
          if(this.currentIndex !== i && 
          (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

        //3.是否显示回到顶部
          //1.判断BackTop是否显示
          this.listenShowBackTop(position)
      },
      addToCart(){
        //1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid
        //2.将商品添加到购物车
        // this.$store.cartList.push(product)        
        // this.$store.commit('addCart', product)
        //Promise方法
        //then回调actions.js里的Promise函数
        //1.mapActions简化操作
        this.addCart(product).then((res) => {
          // this.show = true
          // this.message = res       

          // setTimeout(() => {
          //   this.show = false
          //   this.message = ''            
          // }, 1500)

          //插件安装方式 toast/index.js
          this.$toast.show(res)
        })
        
        /* this.$store.dispatch('addCart', product).then((res) => {
          console.log(res)
        }) */

      }

    },       
    mounted(){      
           
    },
    destroyed(){
      this.$bus.$off('itemImageLoad', this.itemImgListener)      
    }
  }
</script>
  
<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;

  }

  .content {
    height: calc(100% - 44px - 49px);
  }

  #backTop {
    margin-bottom: 10px;
  }
</style>