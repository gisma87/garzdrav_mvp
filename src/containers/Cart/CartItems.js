import React from "react";
import {useMediaQuery} from "react-responsive";
import CartItem from "../../components/CartItem";
import CartItemMobile from "../../components/CartItemMobile/CartItemMobile";


const CartItems = props => {

  const isMobile = useMediaQuery({query: '(max-width: 900px)'})
  return (
    <div className='Cart__itemContainer'>
      {props.cart.length === 0
        ? <p style={{padding: 40, fontSize: '2rem'}}>Корзина пуста</p>
        : props.cartItems.map((item, i) => {
          const index = props.cart.findIndex((cartItem) => cartItem.itemId === item.guid);
          const count = index > -1 ? props.cart[index].count : null
          const maxCountProduct = props.stopCount(item)
          if (maxCountProduct && count && count > maxCountProduct) {
            const delta = count - maxCountProduct
            // ставим в cart[index].count значение maxCountProduct
            props.setCountItemCart(item.guid, delta)
          }
          const priceIndex = item.retails.findIndex(retail => retail.guid === props.selectedRetail)
          const price = priceIndex >= 0 ? item.retails[priceIndex].priceRetail : null
          if (props.cart[index] !== undefined) {
            if (isMobile) {
              return (<CartItemMobile key={item.guid + i + 'mobile'}
                                      item={{
                                        id: item.guid,
                                        img: null,
                                        title: item.product,
                                        maker: item.manufacturer,
                                        minPrice: item.retails.sort((a, b) => a.priceRetail > b.priceRetail ? 1 : -1)[0].priceRetail,
                                        price
                                      }}
                                      retails={item.retails}
                                      classStyle={'Cart__item'}
                                      count={count}
                                      addedToCart={() => props.addedToCart(item.guid)}
                                      itemRemovedFromCart={() => {
                                        if (count > 1) props.itemRemovedFromCart(item.guid);
                                      }}
                                      allItemRemovedFromCart={() => props.allItemRemovedFromCart(item.guid)}
              />)
            } else {
              return (<CartItem key={item.guid + 'desktop'}
                                item={{
                                  id: item.guid,
                                  img: null,
                                  title: item.product,
                                  maker: item.manufacturer,
                                  minPrice: item.retails.sort((a, b) => a.priceRetail > b.priceRetail ? 1 : -1)[0].priceRetail,
                                  price,
                                }}
                                retails={item.retails}
                                classStyle={'Cart__item'}
                                count={count}
                                addedToCart={() => props.addedToCart(item.guid)}
                                itemRemovedFromCart={() => {
                                  if (count > 1) props.itemRemovedFromCart(item.guid);
                                }}
                                allItemRemovedFromCart={() => props.allItemRemovedFromCart(item.guid)}
              />)
            }
          }
        })
      }
    </div>
  )
}

export default CartItems