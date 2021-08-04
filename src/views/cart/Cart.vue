<template>
  <div class="cart">
    <!-- 1.导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <!-- 2.商品列表 -->
    <cart-list/>
    <!-- 3.底部汇总 -->
    <cart-bottom-bar/>
  </div>
</template>
  
<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartList from './childComps/CartList.vue'

  import {mapGetters} from 'vuex'
  import CartBottomBar from './childComps/CartBottomBar.vue'


  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      ...mapGetters([
        'cartLength'        
      ])
    }
  }
</script>
  
<style scoped>
  .cart {
    height: 100vh;
  }

  .nav-bar {
    background: var(--color-tint);
    color: #fff;

  }
</style>