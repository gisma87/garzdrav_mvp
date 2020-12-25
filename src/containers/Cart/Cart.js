import React from "react"
import './Cart.scss'
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import MediaQuery from 'react-responsive'
import CartItem from "../../components/CartItem";
import BlockWrapper from "../../components/BlockWrapper";
import PopupMapCart from "../../components/PopupMapCart/PopupMapCart";
import PopupOrder from "../../components/PopupOrder";
import RetailItem from "../../components/RetailItem";
import PopupMapCartMobile from "../../components/PopupMapCartMobile/PopupMapCartMobile";
import Error from "../../components/Error/Error";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/UI/Loader";
import PopupAfterBuy from "../../components/PopupAfterBuy/PopupAfterBuy";
import {
  RetailCheckPanel,
  RetailCheckPanelListItem,
  RetailCheckPanelIncomplete
} from '../../components/RetailCheckPanel'
import {
  addedToCart,
  addedToFavorits,
  allItemRemovedFromCart,
  clearCart,
  fetchCartItems,
  itemRemovedFromCart,
  loadingFalse,
  loadingTrue,
  onSelectRetail,
  rewriteCart,
  setCartItems,
  setCountItemCart,
  setError,
} from "../../actions";
import {
  calcQuantityProduct,
  calculateAmountArray, checkRetailItem, clearCartError,
  getCountLast,
  getFullRetailItemState, getSum, indexActiveRetail, isChecked, isFullActiveRetail, newCartItems, onLoading,
  postBuyOrder, sortProductThisRetail
} from './cartUtils'

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.calculateAmountArray = calculateAmountArray.bind(this)
    this.getCountLast = getCountLast.bind(this)
    this.getFullRetailItemState = getFullRetailItemState.bind(this)
    this.calcQuantityProduct = calcQuantityProduct.bind(this)
    this.postBuyOrder = postBuyOrder.bind(this)
    this.clearCartError = clearCartError.bind(this)
    this.isFullActiveRetail = isFullActiveRetail.bind(this)
    this.checkRetailItem = checkRetailItem.bind(this)
    this.getSum = getSum.bind(this)
    this.onLoading = onLoading.bind(this)
    this.sortProductThisRetail = sortProductThisRetail.bind(this)
    this.newCartItems = newCartItems.bind(this)
    this.isChecked = isChecked.bind(this)
    this.indexActiveRetail = indexActiveRetail.bind(this)

  }

  state = {
    active: false,
    popupMap: false,
    popupOrder: false,
    view: false,
    telephone: '',
    error: <Error/>,
    loadingText: <Loader classStyle='Loader_is-opened'/>,
    OrderNumber: '',
    popupBuy: false
  }

  componentDidMount() {
    this.props.fetchCartItems()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Если корзина изменилась, берём её данные с LocalStorage и на основании этих данных пересобираем массивы cartItems и retailsArr
    if (prevProps.cart !== this.props.cart) {
      let oldCart = [...this.props.cart]
      if (localStorage.getItem("cart")) {
        oldCart = JSON.parse(localStorage.getItem("cart"))
      }
      const newCartItems = this.props.cartItems.filter(item => oldCart.some(i => i.itemId === item.guid))
      this.props.setCartItems(newCartItems)
    }
  }

  render() {
    const sum = this.getSum()

    // список аптек с неполным наличием товара
    let incompleteRetailItemState = this.props.retailsArr
      .filter(item => item.product.length < this.props.cart.length)
      .sort((a, b) => a.product.length < b.product.length ? 1 : -1)

    return (
      <div className='Cart wrapper'>
        <div className='Cart__topPanel'>
          <h1>Корзина</h1>
          {
            this.props.cart.length > 0 &&
            <p className='Cart__clearBtn' onClick={this.props.clearCart}>Очистить корзину</p>
          }
        </div>
        <ErrorBoundary>
          {this.props.error ? this.clearCartError()
            : <>
              {(this.props.retailsArr.length < 1) && (this.props.cart.length > 0)
                ? <>
                  {
                    this.props.loading
                      ? <p>Загрузка ...</p>
                      : this.onLoading()
                  }
                </>
                : <>
                  {!this.props.isRetailAllProduct &&
                  <p style={{marginBottom: 10}}>К сожалению нет аптек с полным ассортиментом выбранного товара</p>}

                  <section className='Cart__mainContainer'>
                    <div className='Cart__itemContainer'>
                      {this.props.cart.length === 0 ? <p style={{padding: 20, fontSize: '2rem'}}>Корзина пуста</p> :
                        this.sortProductThisRetail().map((item) => {
                          const countLast = this.getCountLast(item.guid)
                          const index = this.props.cart.findIndex((cartItem) => cartItem.itemId === item.guid);
                          const count = index > -1 ? this.props.cart[index].count : null
                          if (countLast && count && count > countLast) {
                            const delta = count - countLast
                            this.props.setCountItemCart(item.guid, delta)
                          }
                          const isFavorites = this.props.favorites.includes(item.guid);
                          const priceIndex = item.retails.findIndex(retail => retail.guid === this.props.selectedRetail)
                          const price = priceIndex >= 0 ? item.retails[priceIndex].priceRetail : null
                          const sum = this.calculateAmountArray().find(itemArr => itemArr.guid === item.guid)?.sum
                          return this.props.cart[index] !== undefined
                            && <CartItem item={{
                              id: item.guid,
                              img: null,
                              title: item.product,
                              maker: item.manufacturer,
                              minPrice: item.retails.sort((a, b) => a.priceRetail > b.priceRetail ? 1 : -1)[0].priceRetail,
                              price,
                              sum,
                              countLast
                            }}
                                         retails={item.retails}
                                         classStyle={'Cart__item'}
                                         isFavorite={isFavorites}
                                         count={count}
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

                    {this.props.cart.length > 0 && <div className='Cart__rightPanel'>
                      <div className='Cart__pricePanel'>
                        <div className='Cart__resultPrice'>
                          <span>Общая сумма:</span> <span>{sum} ₽</span>
                        </div>
                        <div className='Cart__retail'>
                          <p>Забрать из аптеки:</p>
                          <p className='Cart__address'>
                            г. {this.checkRetailItem()?.city}, {this.checkRetailItem()?.street}, {this.checkRetailItem()?.buildNumber}
                          </p>
                          {!(this.checkRetailItem()?.product?.length === this.props.cart.length) &&
                          <span className='Cart__warningMessage'>ТОВАР ДОСТУПЕН ЧАСТИЧНО</span>}
                        </div>
                        <button className='Cart__buttonToCart'
                                onClick={() => this.setState({popupOrder: true})}
                        >
                          Купить
                        </button>
                      </div>
                    </div>
                    }
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
                        {this.getFullRetailItemState()?.length > 1 &&
                        <h2 className='Cart__titleChoice'>Дешевле всего:</h2>}
                        {this.getFullRetailItemState()?.length === 1 &&
                        <h2 className='Cart__titleChoice'>В этой аптеке есть все выбранные товары:</h2>}

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

                    {this.props.cartItems.length < this.props.cart.length
                    && <p className='Cart__alert'>
                      Некоторых товаров нет в вашем городе. Чтобы искать более результативно
                      очистите корзину и осуществите ПОИСК заново по Вашему городу
                    </p>}

                    <MediaQuery maxWidth={800}>
                      {
                        this.getFullRetailItemState()
                        && <RetailItem
                          retailItem={this.getFullRetailItemState()[0]}
                          quantity={this.calcQuantityProduct(this.getFullRetailItemState()[0].product)}
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
                            ? <p style={{padding: 20}}>не найдено аптек с полным ассортиментом выбранного товара</p>
                            : this.getFullRetailItemState().map((item, index) => {
                              if (index === 0) return null;
                              return <RetailItem
                                key={item.guid}
                                retailItem={item}
                                quantity={this.calcQuantityProduct(item.product)}
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

                    {
                      this.getFullRetailItemState() !== null
                      && <MediaQuery minWidth={801}>
                        {
                          this.getFullRetailItemState()[0]
                          && <RetailCheckPanel item={this.getFullRetailItemState()[0]}
                                               quantity={this.calcQuantityProduct(this.getFullRetailItemState()[0].product)}
                                               isChecked={this.isChecked(this.getFullRetailItemState()[0]?.guid)}
                                               onCheck={() => this.props.onSelectRetail(this.getFullRetailItemState()[0]?.guid)}
                          />
                        }
                        {
                          this.getFullRetailItemState().length > 1
                          && <>
                            <h2 className='Cart__titleChoice'>В других аптеках: </h2>
                            <BlockWrapper classStyle='Cart__blockMoreItems'>
                              {
                                this.getFullRetailItemState().map((item, index) => {
                                  if (index === 0) return null;
                                  return <RetailCheckPanelListItem key={item.guid}
                                                                   quantity={this.calcQuantityProduct(item.product)}
                                                                   item={item}
                                                                   isChecked={this.isChecked(item.guid)}
                                                                   onCheck={() => this.props.onSelectRetail(item.guid)}
                                  />
                                })
                              }
                            </BlockWrapper>
                          </>
                        }
                      </MediaQuery>
                    }

                    {
                      incompleteRetailItemState.length > 0
                      && <>
                        <h2 className='Cart__titleChoice'>В этих аптеках не полное наличие: </h2>

                        <MediaQuery maxWidth={800}>
                          <BlockWrapper classStyle='Cart__blockMoreItems'>
                            {incompleteRetailItemState.map((item) => {
                              return <RetailItem
                                key={item.guid}
                                retailItem={item}
                                quantity={this.calcQuantityProduct(item.product)}
                                notFullItems={true}
                                active={this.isChecked(item.guid)}
                                buttonActive={this.isChecked(item.guid)}
                                onSelectItem={() => this.props.onSelectRetail(item.guid)}
                                setMapSetting={() => {
                                }}
                              />
                            })}
                          </BlockWrapper>
                        </MediaQuery>

                        <MediaQuery minWidth={801}>
                          <BlockWrapper classStyle='Cart__blockMoreItems'>
                            {
                              incompleteRetailItemState.map((item) => {
                                return <RetailCheckPanelIncomplete key={item.guid}
                                                                   item={item}
                                                                   quantity={this.calcQuantityProduct(item.product)}
                                                                   isChecked={this.isChecked(item.guid)}
                                                                   onCheck={() => this.props.onSelectRetail(item.guid)}
                                />
                              })
                            }
                          </BlockWrapper>
                        </MediaQuery>
                      </>
                    }
                  </section>}

                  {
                    this.props.retailsArr.length > 0
                    && <PopupOrder active={this.state.popupOrder}
                                   checked={this.props.selectedRetail}
                                   onClick={() => this.setState({popupOrder: false})}
                                   onChange={(e) => this.props.onSelectRetail(e.target.value)}
                                   onChangeInput={(e) => this.setState({telephone: e.target.value})}
                                   retails={this.props.retailsArr}
                                   isFullActiveRetail={this.isFullActiveRetail()}
                                   cart={this.props.cart}
                                   product={this.checkRetailItem()?.product}
                                   onSubmit={() => {
                                     this.postBuyOrder()
                                     this.setState({popupBuy: true})
                                   }}
                                   OrderNumber={this.state.OrderNumber}
                    />
                  }
                  <PopupAfterBuy
                    show={this.state.popupBuy}
                    OrderNumber={this.state.OrderNumber}
                    onClose={() => this.setState({popupBuy: false})}
                  />
                </>
              }
            </>
          }
        </ErrorBoundary>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.error,
    cart: state.cart,
    favorites: state.favorites,
    isCity: state.isCity,
    cartItems: state.cartItems,
    retailsArr: state.retailsArr,
    loading: state.loading,
    selectedRetail: state.selectedRetail,
    isRetailAllProduct: state.isRetailAllProduct,
    TOKEN: state.TOKEN
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item)),
    rewriteCart: (item) => dispatch(rewriteCart(item)),
    addedToFavorits: (itemId) => dispatch(addedToFavorits(itemId)),
    fetchCartItems: () => dispatch(fetchCartItems()),
    onSelectRetail: (id) => dispatch(onSelectRetail(id)),
    clearCart: () => dispatch(clearCart()),
    setCartItems: (cartItems) => dispatch(setCartItems(cartItems)),
    loadingTrue: (info) => dispatch(loadingTrue(info)),
    loadingFalse: (info) => dispatch(loadingFalse(info)),
    setError: (e) => dispatch(setError(e)),
    setCountItemCart: (idProduct, delta) => dispatch(setCountItemCart(idProduct, delta))

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Cart))