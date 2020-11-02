import React from "react"
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
// import points from "../../testData/points";
import dataCart from "../../testData/dataCart";


class Cart extends React.Component {

  fullRetailItemState = this.retailItems().filter(item => item.items.length >= 3)
  incompleteRetailItemState = this.retailItems().filter(item => item.items.length < 3)


  state = {
    active: false,
    popupMap: false,
    checked: this.fullRetailItemState[0].retail.guid
  }

  indexActiveRetail = () => dataCart.findIndex((item) => item.retail.guid === this.state.checked);

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.props.storeService.setLocal(this.props.cart)
  }

  newArr = () => {
    const cartItems = []
    dataCatds.forEach((item) => {
      this.props.cart.forEach((cartItem) => {
        if (item.id === cartItem.itemId) {
          cartItems.push(item)
        }
      })
    })
    return cartItems
  }

  retailItems() {
    const retailItems = dataCart.map((item) => {
      return {
        ...item,
        sum: item.items.reduce((accumulator, currentValue) => {
          return currentValue.price + accumulator
        }, 0)
      }
    })
    return retailItems.sort((a, b) => a.sum > b.sum ? 1 : -1)
  }

  onCheck = (id) => {
    this.setState({checked: id})
  }

  isChecked = (id) => {
    if (this.state.checked === id) {
      return true
    } else return false
  }

  render() {
    const sum = this.newArr().reduce((accumulator, currentValue) => {
      return currentValue.minPrice + accumulator
    }, 0)

    return (
      <div className='Cart wrapper'>
        <h1>Корзина</h1>
        <section className='Cart__mainContainer'>

          <div className='Cart__itemContainer'>
            {this.props.cart.length === 0 ? "Корзина пуста" :
              this.newArr().map((item) => {
                const index = this.props.cart.findIndex((cartItem) => cartItem.itemId === item.id);
                const isFavorites = this.props.favorites.includes(item.id);
                return this.props.cart[index] !== undefined && <CartItem item={item}
                                                                         classStyle={'Cart__item'}
                                                                         cart={this.props.cart}
                                                                         isFavorite={isFavorites}
                                                                         count={this.props.cart[index].count}
                                                                         addedToFavorits={() => this.props.addedToFavorits(item.id)}
                                                                         addedToCart={() => {
                                                                           this.props.addedToCart(item.id)
                                                                         }}
                                                                         itemRemovedFromCart={() => {
                                                                           this.props.itemRemovedFromCart(item.id)
                                                                         }}
                                                                         allItemRemovedFromCart={() => {
                                                                           this.props.allItemRemovedFromCart(item.id)
                                                                         }}
                                                                         key={item.id}
                />
              })
            }
          </div>

          <BlockWrapper classStyle='Cart__pricePanel'>
            <div className='Cart__resultPrice'>Итого: {this.props.cart.length} товара на сумму {sum} ₽
            </div>
            <div className='Cart__retail'>
              <p>Забрать из аптеки:</p>
              <span>г. {dataCart[this.indexActiveRetail()].retail.city} {dataCart[this.indexActiveRetail()].retail.street} {dataCart[this.indexActiveRetail()].retail.buildNumber}</span>
            </div>
            <button className='Cart__button Cart__buttonToCart' onClick={() => {
              this.setState(prevState => {
                return {
                  active: !prevState.active,
                }
              })
            }}>
              {this.state.active ? <SvgCheck style={{color: 'white'}}/> : 'Купить'}
            </button>
          </BlockWrapper>
        </section>

        <section className='Cart__choiceRetail'>
          <div className='Cart__blockTitle'>
            <h2 className='Cart__titleChoice'>Дешевле всего: </h2>
            <button className='Cart__button Cart__buttonMap' onClick={() => {
              this.setState({popupMap: true})
              document.body.style.overflow = 'hidden'
            }}>Выбрать аптеку на КАРТЕ
            </button>
          </div>
          <RetailCheckPanel item={this.fullRetailItemState[0]}
                            isChecked={this.isChecked(this.fullRetailItemState[0].retail.guid)}
                            onCheck={() => {
                              this.onCheck(this.fullRetailItemState[0].retail.guid)
                            }}
          />

          <h2 className='Cart__titleChoice'>В других аптеках: </h2>
          <BlockWrapper classStyle='Cart__blockMoreItems'>
            {
              this.fullRetailItemState.map((item, index) => {
                if (index === 0) return null;
                return <RetailCheckPanel key={item.retail.guid}
                                         item={item}
                                         list='list'
                                         isChecked={this.isChecked(item.retail.guid)}
                                         onCheck={() => {
                                           this.onCheck(item.retail.guid)
                                         }}/>
              })
            }
          </BlockWrapper>

          <h2 className='Cart__titleChoice'>В этих аптеках не полное наличие: </h2>
          <BlockWrapper classStyle='Cart__blockMoreItems'>
            {
              this.incompleteRetailItemState.map((item) => {
                return <RetailCheckPanel key={item.retail.guid}
                                         item={item}
                                         list='incomplete'
                                         isChecked={this.isChecked(item.retail.guid)}
                                         onCheck={() => {
                                           this.onCheck(item.retail.guid)
                                         }}/>
              })
            }
          </BlockWrapper>
        </section>
        <PopupMapCart active={this.state.popupMap}
                      retails={this.retailItems().reverse()}
                      activeRetail={this.state.checked}
                      onClick={() => {
                        this.setState({popupMap: false})
                        document.body.style.overflow = 'auto'
                      }}
                      onSelectItem={(item) => {
                        this.onCheck(item)
                      }}
        />

      </div>
    )
  }


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