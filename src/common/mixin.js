import {debounce} from 'common/utils'

export const itemListenerMixin = {
  data(){
    return {
      itemImgListener: null
    }
  },
  mounted(){
    //1.监听item中图片加载完成,接收事件总线
    const refresh = debounce(this.$refs.scroll.refresh, 50)    
      
    //2.对监听的事件进行保存
    this.itemImgListener = () => {        
      refresh()}
    
    this.$bus.$on('itemImageLoad', this.itemImgListener) 
  }
}