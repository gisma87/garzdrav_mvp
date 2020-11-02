import React, {useEffect, useState} from "react"
import './Cart.scss'
import dataCatds from "../../testData/dataCards";
import SvgCheck from "../../components/UI/icons/SvgCheck";
import CartItem from "../../components/CartItem";
import RetailCheckPanel from "../../components/RetailCheckPanel";
import BlockWrapper from "../../components/BlockWrapper";
import {addedToCart, addedToFavorits, allItemRemovedFromCart, itemRemovedFromCart, rewriteCart} from "../../actions";
import {compose} from "../../utils";
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import PopupMapCart from "../../components/PopupMapCart/PopupMapCart";
import points from "../../testData/points";
import dataCart from "../../testData/dataCart";


const Cart = (props) => {
  const {cart, favorites, addedToCart, allItemRemovedFromCart, itemRemovedFromCart, addedToFavorits} = props;

  const [active, setActive] = useState(false);
  const [popup, setPopup] = useState(false);
  // const [fullRetailItem, setFullRetailItem] = useState([])
  // const [activeRetail, setActiveRetail] = useState()


  // useEffect(() => props.storeService.setLocal(cart))

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

  const sum = newArr().reduce((accumulator, currentValue) => {
    return currentValue.minPrice + accumulator
  }, 0)
  const retailItems = dataCart.map((item) => {
    return {
      ...item,
      sum: item.items.reduce((accumulator, currentValue) => {
        return currentValue.price + accumulator
      }, 0)
    }
  })
  retailItems.sort((a, b) => a.sum > b.sum ? 1 : -1)
  const fullRetailItemState = retailItems.filter(item => item.items.length >= 3)


  // useEffect(() => {
  // setFullRetailItem(retailItems)
  //   console.log(retailItems);
  //   console.log('fullRetailItem: ', fullRetailItemState);
  // })

  const [checked, setChecked] = useState(fullRetailItemState[0].retail.guid)
  const onCheck = (id) => {
    setChecked(id)
  }
  const isChecked = (id) => {
    if (checked === id) {
      return true
    } else return false
  }

  return (
    <div className='Cart wrapper'>
      <h1>Корзина</h1>
      <section className='Cart__mainContainer'>

        <div className='Cart__itemContainer'>
          {cart.length === 0 ? "Корзина пуста" :
            newArr().map((item) => {
              const index = cart.findIndex((cartItem) => cartItem.itemId === item.id);
              const isFavorite = favorites.includes(item.id);
              return cart[index] !== undefined && <CartItem item={item}
                                                            classStyle={'Cart__item'}
                                                            cart={cart}
                                                            // updateCart={() => props.storeService.setLocal(cart)}
                                                            isFavorite={isFavorite}
                                                            count={cart[index].count}
                                                            addedToFavorits={() => addedToFavorits(item.id)}
                                                            addedToCart={() => {
                                                              addedToCart(item.id)
                                                              // props.storeService.setLocal(cart)
                                                            }}
                                                            itemRemovedFromCart={() => {
                                                              itemRemovedFromCart(item.id)
                                                              // props.storeService.setLocal(cart)
                                                            }}
                                                            allItemRemovedFromCart={() => {
                                                              allItemRemovedFromCart(item.id)
                                                              // props.storeService.setLocal(cart)
                                                            }}
                                                            key={item.id}
              />
            })
          }
        </div>

        <BlockWrapper classStyle='Cart__pricePanel'>
          <div className='Cart__resultPrice'>Итого: {cart.length} товара на сумму {sum} ₽
          </div>
          <div className='Cart__retail'>
            <p>Забрать из аптеки:</p>
            <span>г. Красноярск, ул. Дмитрия Мартынова, 24</span>
          </div>
          <button className='Cart__button Cart__buttonToCart' onClick={() => {
            setActive(state => !state)
            setPopup(true)
            document.body.style.overflow = 'hidden'
          }}>
            {active ? <SvgCheck style={{color: 'white'}}/> : 'Купить'}
          </button>
        </BlockWrapper>
      </section>

      <section className='Cart__choiceRetail'>
        <h2 className='Cart__titleChoice'>Дешевле всего: </h2>
        <RetailCheckPanel item={fullRetailItemState[0]}
                          isChecked={isChecked(fullRetailItemState[0].retail.guid)}
                          onCheck={() => {
                            onCheck(fullRetailItemState[0].retail.guid)
                          }}/>

        <h2 className='Cart__titleChoice'>В других аптеках: </h2>
        <BlockWrapper classStyle='Cart__blockMoreItems'>
          {
            fullRetailItemState.map((item, index) => {
              if (index === 0) return null;
              return <RetailCheckPanel key={item.retail.guid}
                                       item={item}
                                       list={true}
                                       isChecked={isChecked(item.retail.guid)}
                                       onCheck={() => {
                                         onCheck(item.retail.guid)
                                       }}/>
            })
          }
        </BlockWrapper>
      </section>
      <PopupMapCart active={popup}
                    retails={points}
                    onClick={() => {
                      setPopup(false);
                      document.body.style.overflow = 'auto'
                    }}
                    onSelectItem={(item) => {
                      console.log(item)
                    }}
      />
    </div>
  )
}

const mapStateToProps = ({cart, favorites}) => {
  return {
    cart,
    favorites
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item)),
    rewriteCart: (item) => dispatch(rewriteCart(item)),
    addedToFavorits: (itemId) => dispatch(addedToFavorits(itemId))
  }
}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(Cart))