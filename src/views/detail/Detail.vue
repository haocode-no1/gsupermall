<template>
  <div id="detail" >
    <detail-nav-bar class="detail-nav"/>
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :paramInfo="paramInfo"/>
      <detail-comment-info :commentInfo="commentInfo"/>
      <goods-list :goods="recommends"/>
    </scroll>
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


  import Scroll from 'components/common/scroll/Scroll'  
  import GoodsList from 'components/content/goods/GoodsList'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail.js'
  import {itemListenerMixin} from 'common/mixin.js'

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
      Scroll,
      GoodsList
    },
    mixins: [itemListenerMixin],
    data(){
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: []
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
    },
    methods: {
      imageLoad(){
        this.$refs.scroll.refresh()
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
    height: calc(100% - 44px);
  }
</style>