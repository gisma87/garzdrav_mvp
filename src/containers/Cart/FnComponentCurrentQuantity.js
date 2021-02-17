import {useEffect} from "react";

const FnComponentCurrentQuantity = (props) => {
  const {cart, cartItems, allItemRemovedFromCart} = props;

  useEffect(() => {
    if (cartItems.length < cart.length) {
      const delItems = cart.filter(item => !cartItems.some((element => element.guid === item.itemId)))
      console.log('По этим товарам сервер ответил ошибкой, они удалены из корзины: ', delItems)
      delItems.forEach(item => {
        allItemRemovedFromCart(item.itemId)
      })
    }
  })

  return null
}

export default FnComponentCurrentQuantity