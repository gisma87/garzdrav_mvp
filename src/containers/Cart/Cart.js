import React, {useEffect, useState} from "react"
import './Cart.scss'
import LayoutDesktop from "../../hoc/LayoutDesktop";
import dataCatds from "../../testData/dataCards";
import SvgCheck from "../../components/UI/icons/SvgCheck";
import CartItem from "../../components/CartItem";
import RetailCheckPanel from "../../components/RetailCheckPanel";
import BlockWrapper from "../../components/BlockWrapper";
import {addedToCart, allItemRemovedFromCart, itemRemovedFromCart, rewriteCart} from "../../actions";
import {compose} from "../../utils";
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

const Cart = (props) => {
  const {cart, addedToCart, allItemRemovedFromCart, itemRemovedFromCart, rewriteCart} = props;

  const [active, setActive] = useState(false);

  useEffect(() => {
    props.storeService.setLocal(cart)
  })

  const newArr = () => {
    const cartItems = []
    dataCatds.forEach((item) => {
      cart.forEach((cartItem) => {
        if (item.id === cartItem.itemId) {
          cartItems.push(item)
        }
      })
    })
    return cartItems
  }

  return (
    <LayoutDesktop>
      <div className='Cart wrapper'>
        <h1>Корзина</h1>
        <section className='Cart__mainContainer'>

          <div className='Cart__itemContainer'>
            {cart.length === 0 ? "Корзина пуста" :
              newArr().map((item) => {
                const index = cart.findIndex((cartItem) => cartItem.itemId === item.id);
                return cart[index] !== undefined && <CartItem item={item}
                                                              style={'Cart__item'}
                                                              count={cart[index].count}
                                                              addedToCart={() => addedToCart(item.id)}
                                                              itemRemovedFromCart={() => itemRemovedFromCart(item.id)}
                                                              allItemRemovedFromCart={() => allItemRemovedFromCart(item.id)}
                                                              key={item.id}
                />
              })
            }
          </div>

          <BlockWrapper style='Cart__pricePanel'>
            <div className='Cart__resultPrice'>Итого: 2 товара на сумму 580 ₽</div>
            <div className='Cart__retail'>
              <p>Забрать из аптеки:</p>
              <span>г. Красноярск, ул. Дмитрия Мартынова, 24</span>
            </div>
            <button className='Cart__button Cart__buttonToCart' onClick={() => {
              setActive(state => !state)
            }}>
              {active ? <SvgCheck style={{color: 'white'}}/> : 'Выбрать аптеку'}
            </button>
          </BlockWrapper>
        </section>

        <section className='Cart__choiceRetail'>
          <h2 className='Cart__titleChoice'>Дешевле всего: </h2>
          <RetailCheckPanel/>
        </section>
      </div>
    </LayoutDesktop>
  )
}

const mapStateToProps = ({cart}) => {
  return {
    cart
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item)),
    rewriteCart: (item) => dispatch(rewriteCart(item))
  }
}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(Cart))