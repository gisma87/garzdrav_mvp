import React from "react";
import {useMediaQuery} from "react-responsive";
import CartItem from "../../components/CartItem";
import CartItemMobile from "../../components/CartItemMobile/CartItemMobile";
import {useHistory} from "react-router-dom";
import {CartItemType, TypeProductInfo} from "../../types";

type Props = {
    cart: CartItemType[],
    cartItems: TypeProductInfo[],
    stopCount: (product: TypeProductInfo) => number,
    setCountItemCart: (idProduct: string, delta: number) => void,
    selectedRetail: null | string,
    addedToCart(item: string): void,
    itemRemovedFromCart: (item: string) => void,
    allItemRemovedFromCart: (item: string) => void
}

const CartItems: React.FC<Props> = props => {

    const history = useHistory()

    const isMobile = useMediaQuery({query: '(max-width: 900px)'})
    const itemSelect = (itemId: string) => {
        history.push(`/Card/${itemId}`)
    }
    return (
        <div className='Cart__itemContainer'>
            {props.cart.length === 0
                ? <p style={{padding: 40, fontSize: '2rem'}}>Корзина пуста</p>
                : props.cartItems.map((item, i) => {
                    const index = props.cart.findIndex((cartItem) => cartItem.itemId === item.guid);
                    const count = index > -1 ? props.cart[index].count : 0
                    const maxCountProduct = props.stopCount(item)
                    if (maxCountProduct && count && count > maxCountProduct) {
                        const delta = count - maxCountProduct
                        // ставим в cart[index].count значение maxCountProduct
                        props.setCountItemCart(item.guid, delta)
                    }
                    const priceIndex = item.retails.findIndex(retail => retail.guid === props.selectedRetail)
                    const price = priceIndex >= 0 ? item.retails[priceIndex].priceRetail : 0
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
                                                    itemSelect={() => itemSelect(item.guid)}
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
                                              itemSelect={() => itemSelect(item.guid)}
                                              retails={item.retails}
                                              count={count}
                                              addedToCart={() => props.addedToCart(item.guid)}
                                              itemRemovedFromCart={() => {
                                                  if (count > 1) props.itemRemovedFromCart(item.guid);
                                              }}
                                              allItemRemovedFromCart={() => props.allItemRemovedFromCart(item.guid)}
                            />)
                        }
                    }
                    return null
                })
            }
        </div>
    )
}

export default CartItems