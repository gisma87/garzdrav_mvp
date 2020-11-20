import React from "react"
import './Cart.scss'
import MediaQuery from 'react-responsive'
import CartItem from "../../components/CartItem";
import RetailCheckPanel from "../../components/RetailCheckPanel";
import BlockWrapper from "../../components/BlockWrapper";
import {
  addedToCart,
  addedToFavorits,
  allItemRemovedFromCart,
  fetchProductInfo,
  itemRemovedFromCart,
  rewriteCart,
  fetchCartItems,
  onSelectRetail,
} from "../../actions";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import PopupMapCart from "../../components/PopupMapCart/PopupMapCart";
import PopupOrder from "../../components/PopupOrder";
import RetailItem from "../../components/RetailItem";
import PopupMapCartMobile from "../../components/PopupMapCartMobile/PopupMapCartMobile";

class Cart extends React.Component {

  state = {
    active: false,
    popupMap: false,
    popupOrder: false,
    view: false,
  }

  indexActiveRetail = () => this.props.retailsArr.findIndex((item) => item.guid === this.state.checked);

  componentDidMount() {
    this.props.fetchCartItems()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.cart !== this.props.cart) {
      this.props.fetchCartItems()
    }

  }

  isChecked = (id) => this.props.selectedRetail === id;

  checkRetailItem = () => {
    return this.props.retailsArr.find(item => item.guid === this.props.selectedRetail)
  }

  getFullRetailItemState = () => {
    const itemArr = this.props.retailsArr.filter(item => item.product.length >= this.props.cart.length)
    if (itemArr.length > 0) {
      return itemArr
    }
    return null
  }

  calculateAmountArray = () => {
    const cartItems = []
    this.props.cartItems.forEach(item => {
      const index = this.props.cart.findIndex(cartItem => cartItem.itemId === item.guid)
      if (index < 0) return;
      const count = this.props.cart[index].count
      const retailIndex = item.retails.findIndex(retail => retail.guid === this.props.selectedRetail)
      const sum = retailIndex >= 0 ? item.retails[retailIndex].priceRetail * count : null
      cartItems.push({guid: item.guid, sum})
    })
    return cartItems
  }

  getSum = () => {
    const sum = this.calculateAmountArray().reduce((accumulator, currentValue) => {
      if (currentValue.sum === null) return accumulator;
      return currentValue.sum + accumulator
    }, 0)
    return +sum.toFixed(2)
  }

  render() {
    const sum = this.getSum()
    let incompleteRetailItemState = []
    incompleteRetailItemState = this.props.retailsArr.filter(item => item.product.length < this.props.cart.length)
    console.log('ВЫБРАННАЯ АПТЕКА: ', this.checkRetailItem());

    return (
      <div className='Cart wrapper'>
        <h1>Корзина</h1>
        {(this.props.retailsArr.length < 1) && (this.props.cart.length > 0)
          ? <p>Загрузка ...</p>
          : <>
            {!this.props.isRetailAllProduct && <p>К сожалению нет аптек с полным ассортиментом выбранного товара</p>}
            <section className='Cart__mainContainer'>
              <div className='Cart__itemContainer'>
                {this.props.cart.length === 0 ? "Корзина пуста" :
                  this.props.cartItems.length === this.props.cart.length
                  && this.props.cartItems.map((item) => {
                    const index = this.props.cart.findIndex((cartItem) => cartItem.itemId === item.guid);
                    const isFavorites = this.props.favorites.includes(item.guid);
                    const priceIndex = item.retails.findIndex(retail => retail.guid === this.props.selectedRetail)
                    const price = priceIndex >= 0 ? item.retails[priceIndex].priceRetail : null
                    const sum = this.calculateAmountArray().find(itemArr => itemArr.guid === item.guid).sum
                    return this.props.cart[index] !== undefined
                      && <CartItem item={{
                        id: item.guid,
                        img: null,
                        title: item.product,
                        maker: item.manufacturer,
                        minPrice: item.retails.sort((a, b) => a.priceRetail > b.priceRetail ? 1 : -1)[0].priceRetail,
                        price,
                        sum
                      }}
                                   classStyle={'Cart__item'}
                                   isFavorite={isFavorites}
                                   count={this.props.cart[index].count}
                                   addedToFavorits={() => this.props.addedToFavorits(item.guid)}
                                   addedToCart={() => {
                                     this.props.addedToCart(item.guid)
                                   }}
                                   itemRemovedFromCart={() => {
                                     this.props.itemRemovedFromCart(item.guid)
                                   }}
                                   allItemRemovedFromCart={() => {
                                     this.props.allItemRemovedFromCart(item.guid)
                                   }}
                                   key={item.guid}
                      />
                  })
                }
              </div>

              {this.props.cart.length > 0 && <BlockWrapper classStyle='Cart__pricePanel'>
                <div className='Cart__resultPrice'>
                  <span>Общая сумма:</span> <span>{sum} ₽</span>
                </div>
                <div className='Cart__retail'>
                  <p>Забрать из аптеки:</p>
                  <span>г.&nbsp;
                    {this.checkRetailItem()?.city},&nbsp;
                    {this.checkRetailItem()?.street},&nbsp;
                    {this.checkRetailItem()?.buildNumber}
              </span>
                </div>
                <button className='Cart__button Cart__buttonToCart'
                        onClick={() => this.setState({popupOrder: true})}
                >
                  Купить
                </button>
              </BlockWrapper>}
            </section>

            {this.props.cart.length !== 0 && <section className='Cart__choiceRetail'>

              <MediaQuery maxWidth={800}>
                <div className='CitiesMobile__menu Cart__menu'>
                  <p onClick={() => this.setState({view: false})}
                     className={'CitiesMobile__btn ' + (!this.state.view ? 'CitiesMobile__btn_active' : '')}
                  >
                    Список
                  </p>
                  <p onClick={() => this.setState({popupMap: true})}
                     className={'CitiesMobile__btn ' + (this.state.view ? 'CitiesMobile__btn_active' : '')}
                  >
                    Карта
                  </p>
                </div>

                <PopupMapCartMobile active={this.state.popupMap}
                                    retails={this.props.retailsArr.reverse()}
                                    activeRetail={this.props.selectedRetail}
                                    cartLength={this.props.cart.length}
                                    point={this.checkRetailItem()?.coordinates}
                                    onClick={() => this.setState({popupMap: false})}
                                    onSelectItem={idSelectRetail => this.props.onSelectRetail(idSelectRetail)}
                />
              </MediaQuery>

              <MediaQuery minWidth={801}>
                <div className='Cart__blockTitle'>
                  <h2 className='Cart__titleChoice'>Дешевле всего: </h2>
                  <button className='Cart__button Cart__buttonMap'
                          onClick={() => this.setState({popupMap: true})}>
                    Выбрать аптеку на КАРТЕ
                  </button>
                </div>

                <PopupMapCart active={this.state.popupMap}
                              retails={this.props.retailsArr.reverse()}
                              activeRetail={this.props.selectedRetail}
                              cartLength={this.props.cart.length}
                              onClick={() => {
                                this.setState({popupMap: false})
                              }}
                              onSelectItem={(item) => this.props.onSelectRetail(item)}
                />
              </MediaQuery>

              <MediaQuery maxWidth={800}>
                {
                  this.getFullRetailItemState()
                  && <RetailItem
                    retailItem={this.getFullRetailItemState()[0]}
                    notFullItems={false}
                    active={this.isChecked(this.getFullRetailItemState()[0]?.guid)}
                    buttonActive={this.isChecked(this.getFullRetailItemState()[0]?.guid)}
                    onSelectItem={() => this.props.onSelectRetail(this.getFullRetailItemState()[0]?.guid)}
                    setMapSetting={() => {
                      // setPoint(retail.coordinates)
                      // setZoom(17)
                      // setActiveMarker(null)
                    }}
                  />
                }

                <BlockWrapper classStyle='Cart__blockMoreItems'>
                  {
                    this.getFullRetailItemState() === null
                      ? <p style={{padding: 20}}>Товара нет в наличии</p>
                      : this.getFullRetailItemState().map((item, index) => {
                        if (index === 0) return null;
                        return <RetailItem
                          key={item.guid}
                          retailItem={item}
                          notFullItems={false}
                          active={this.isChecked(item.guid)}
                          buttonActive={this.isChecked(item.guid)}
                          onSelectItem={() => this.props.onSelectRetail(item.guid)}
                          setMapSetting={() => {
                          }}
                        />
                      })
                  }
                </BlockWrapper>
              </MediaQuery>

              {this.getFullRetailItemState() !== null
              && <MediaQuery minWidth={801}>
                {
                  this.getFullRetailItemState()[0]
                  && <RetailCheckPanel item={this.getFullRetailItemState()[0]}
                                       isChecked={this.isChecked(this.getFullRetailItemState()[0]?.guid)}
                                       onCheck={() => this.props.onSelectRetail(this.getFullRetailItemState()[0]?.guid)}
                  />
                }
                <h2 className='Cart__titleChoice'>В других аптеках: </h2>
                <BlockWrapper classStyle='Cart__blockMoreItems'>
                  {
                    this.getFullRetailItemState().length === 1
                      ? <p style={{padding: 20}}>Товара нет в наличии</p>
                      : this.getFullRetailItemState().map((item, index) => {
                        if (index === 0) return null;
                        return <RetailCheckPanel key={item.guid}
                                                 item={item}
                                                 list='list'
                                                 isChecked={this.isChecked(item.guid)}
                                                 onCheck={() => this.props.onSelectRetail(item.guid)}
                        />
                      })
                  }
                </BlockWrapper>
              </MediaQuery>}

              <h2 className='Cart__titleChoice'>В этих аптеках не полное наличие: </h2>

              <MediaQuery maxWidth={800}>
                <BlockWrapper classStyle='Cart__blockMoreItems'>
                  {
                    incompleteRetailItemState.length > 0
                    && incompleteRetailItemState.map((item) => {
                      return <RetailItem
                        key={item.guid}
                        retailItem={item}
                        notFullItems={true}
                        active={this.isChecked(item.guid)}
                        buttonActive={this.isChecked(item.guid)}
                        onSelectItem={() => this.props.onSelectRetail(item.guid)}
                        setMapSetting={() => {
                        }}
                      />
                    })
                  }
                </BlockWrapper>
              </MediaQuery>

              <MediaQuery minWidth={801}>
                <BlockWrapper classStyle='Cart__blockMoreItems'>
                  {
                    incompleteRetailItemState.map((item) => {
                      return <RetailCheckPanel key={item.guid}
                                               item={item}
                                               list='incomplete'
                                               isChecked={this.isChecked(item.guid)}
                                               onCheck={() => this.props.onSelectRetail(item.guid)}
                      />
                    })
                  }
                </BlockWrapper>
              </MediaQuery>

            </section>}

            {
              this.props.retailsArr.length > 0
              && <PopupOrder active={this.state.popupOrder}
                             checked={this.props.selectedRetail}
                             onClick={() => this.setState({popupOrder: false})}
                             onChange={(e) => this.props.onSelectRetail(e.target.value)}
                             retails={this.props.retailsArr}
              />
            }
          </>
        }
      </div>
    )
  }
}

const mapStateToProps = (
  {
    cart,
    favorites,
    isCity,
    cartItems,
    retailsArr,
    loading,
    selectedRetail,
    isRetailAllProduct
  }) => {
  return {
    cart,
    favorites,
    isCity,
    cartItems,
    retailsArr,
    loading,
    selectedRetail,
    isRetailAllProduct
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item)),
    rewriteCart: (item) => dispatch(rewriteCart(item)),
    addedToFavorits: (itemId) => dispatch(addedToFavorits(itemId)),
    fetchProductInfo: (productId, cityId) => dispatch(fetchProductInfo(productId, cityId)),
    fetchCartItems: () => dispatch(fetchCartItems()),
    onSelectRetail: (id) => dispatch(onSelectRetail(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Cart))