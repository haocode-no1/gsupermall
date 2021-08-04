import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutations-types'
export default {
  
    //mutations 唯一的目的是 修改 state中状态
    //mutations 的每个方法尽可能完成的事件比较单一点
    [ADD_COUNTER](state, payload){
      payload.count++
    },
    [ADD_TO_CART](state, payload){
      payload.checked = true
      state.cartList.push(payload)
    }
  
}