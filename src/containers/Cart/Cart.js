import React from "react"
import './Cart.scss'
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import MediaQuery from 'react-responsive'
import CartItem from "../../components/CartItem";
import BlockWrapper from "../../components/BlockWrapper";
import Error from "../../components/Error/Error";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/UI/Loader";
import num_word from "../../utils/numWord";
import {
  addedToCart,
  allItemRemovedFromCart, authorizedByPassOrSMS, authorizedBySMSorPassword,
  clearCart,
  fetchCartItems, getPromoItem,
  itemRemovedFromCart,
  loadingFalse,
  loadingTrue,
  onSelectRetail, refreshAuthentication,
  rewriteCart,
  setCartItems,
  setCountItemCart,
  setError,
} from "../../actions";
import {
  calcQuantityProduct,
  calculateAmountArray, checkRetailItem, clearCartError,
  getCountLast, getFullCountProductsRetails,
  getFullRetailItemState, getSum, indexActiveRetail, isChecked, isFullActiveRetail, newCartItems, onLoading,
  postBuyOrder, sortProductThisRetail
} from './cartUtils'
import SvgArrowLongRight from "../../components/UI/icons/SvgArrowLongRight";
import CardItem from "../../components/CardItem";
import apiService from "../../service/ApiService";
import CartOrderPage from "./CartOrderPage/CartOrderPage";
import CartItemMobile from "../../components/CartItemMobile/CartItemMobile";
import CartPageChoiceRetail from "./CartPageChoiceRetail/CartPageChoiceRetail";
import FnComponentCurrentQuantity from "./FnComponentCurrentQuantity";

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
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
    this.getFullCountProductsRetails = getFullCountProductsRetails.bind(this)

    this.startTimer = this.startTimer.bind(this)
    this.clearTimer = this.clearTimer.bind(this)

  }

  state = {
    pageStage: 1,
    popupMap: false,
    view: false,
    showListAndMapRetail: true,
    telephone: '',
    error: <Error/>,
    loadingText: <Loader classStyle='Loader_is-opened'/>,
    OrderNumber: '',
    isShowTimer: false,
    seconds: 60,
    thisTime: {date: Date.now(), iteration: 0}
  }

  componentDidMount() {
    this.props.fetchCartItems()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    // запрашиваем данные для promoItem.
    if (this.props.cart.length && ((prevProps.cart.length !== this.props.cart.length) || (this.state.thisTime.iteration < 1))) {
      const time = Date.now();
      if (((time - 8000) > this.state.thisTime.date) || this.state.thisTime.iteration < 1) {
        this.props.getPromoItem(this.props.cart[0]?.itemId)
        this.setState({thisTime: {date: time, iteration: this.state.thisTime.iteration + 1}})
      }
    }


    // Если cart изменилась, берём её данные с LocalStorage и на основании этих данных пересобираем массивы cartItems и retailsArr
    if (prevProps.cart !== this.props.cart) {
      let oldCart = [...this.props.cart]

      // если в корзину добавился новый товар - делаем по нему запрос и обновляем cartItems и retailsArr
      if (this.props.cartItems.length < this.props.cart.length) {
        const productId = this.props.cart[this.props.cart.length - 1].itemId
        this.props.loadingTrue('getProductInfo for promoBlock in Cart')
        apiService.getProductInfo(productId, this.props.isCity.guid)
          .then(response => {
            const newCartItems = [...this.props.cartItems]
            newCartItems.push(response)
            this.props.setCartItems(newCartItems)
          })
      } else {
        // товар удалили из корзины, удаляем его из cartItems и пересобираем cartItems и retailsArr
        const newCartItems = this.props.cartItems.filter(item => oldCart.some(i => i.itemId === item.guid))
        this.props.setCartItems(newCartItems)
      }
    }
  }

  componentWillUnmount() {
    if (this.timer) this.clearTimer();
  }

  getDataForPromoItem() {
    if (this.props.promoItems instanceof Object && (this.props.promoItems?.promoItems.length > 0)) {
      const promoItem = this.props.promoItems?.promoItems[0]
      const result = {}
      const itemIndex = this.props.cart.findIndex((item) => item.itemId === promoItem.guid);
      result.isBuy = itemIndex >= 0;
      result.count = result.isBuy ? this.props.cart[itemIndex].count : 0
      // countLast не возвращает данный запрос - решили ограничить кол. одной штукой - чтобы можно было в корзину добавить
      // result.countLast = promoItem.retails.sort((a, b) => a.countLast < b.countLast ? 1 : -1)[0].countLast
      result.countLast = 1
      result.key = promoItem.guid
      result.id = promoItem.guid
      result.title = promoItem.product
      result.maker = promoItem.manufacturer
      result.img = promoItem.img
      result.minPrice = promoItem.minPrice
      result.onIncrement = () => this.props.addedToCart(promoItem.guid)
      result.onDecrement = () => this.props.itemRemovedFromCart(promoItem.guid)

      return result
    }
    return null
  }

  // роутинг по страницам Cart
  goToPageStageThree = (retailId = null) => {
    if (retailId) {
      this.props.onSelectRetail(retailId);
      this.setState({pageStage: 3})
    } else if (this.props.selectedRetail) {
      this.setState({pageStage: 3})
    } else {
      this.setState({pageStage: 2})
    }
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }

  goToPage(n) {
    this.setState({pageStage: n})
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }

  startTimer() {
    if (!this.timer) {
      this.timer = setInterval(() => {
        const count = this.state.seconds - 1
        this.setState({seconds: count})
        this.setState({isShowTimer: true})
        if (this.state.seconds < 1) {
          this.clearTimer()
        }
      }, 1000)
    }
  }

  clearTimer() {
    clearInterval(this.timer)
    this.setState({isShowTimer: false})
    this.timer = null;
    this.setState({seconds: 60})
  }

  getMinSum = () => {
    const minPrice = (product) => product.retails.sort((a, b) => a.priceRetail > b.priceRetail ? 1 : -1)[0].priceRetail
    const count = (product) => this.props.cart.find(item => item.itemId === product.guid)?.count
    return this.props.cartItems.reduce((acc, product) => {
      return acc = acc + (minPrice(product) * count(product))
    }, 0)
  }

  render() {
    const stopCount = (product) => product.retails.sort((a, b) => a.countLast < b.countLast ? 1 : -1)[0].countLast
    const minSum = this.getMinSum().toFixed(2)

    // список аптек с неполным наличием товара
    let incompleteRetailItemState = this.props.retailsArr
      .filter(item => item.product.length < this.props.cart.length)
      .sort((a, b) => ((a.product.length < b.product.length) || ((a.product.length === b.product.length) && (a.sum > b.sum))) ? 1 : -1)

    // общее количество товаров в корзине
    const countProducts = this.props.cart.reduce((sum, item) => {
      return item.count + sum
    }, 0)

    const {allCountFullProductRetails, notCompleteCountProductsRetails} = this.getFullCountProductsRetails()

    const retailsForMap = () => [...this.props.retailsArr].sort((a, b) => {
      const aCount = a.product.reduce((acc, val) => {
        return acc + val.count
      }, 0)
      const bCount = b.product.reduce((acc, val) => {
        return acc + val.count
      }, 0)
      const isResult = (a.product.length < b.product.length) || ((a.product.length === b.product.length) && (aCount < bCount)) || ((aCount === bCount) && (a.sum > b.sum))
      return isResult ? 1 : -1
    })

    return (
      <div className='Cart wrapper'>
        <MediaQuery minWidth={901}>
          <div className='Cart__topPanel'>

            <div className="Cart__pageTitle" onClick={() => this.goToPage(1)}>
              <p className={'Cart__pageNumber' + (this.state.pageStage === 1 ? ' Cart__pageNumber_active' : '')}>1</p>
              <p className="Cart__pageName">Корзина</p>
            </div>
            <SvgArrowLongRight className="Cart__pageArrow"/>
            <div className="Cart__pageTitle" onClick={() => this.goToPage(2)}>
              <p className={'Cart__pageNumber' + (this.state.pageStage === 2 ? ' Cart__pageNumber_active' : '')}>2</p>
              <p className="Cart__pageName">Выбор аптеки</p>
            </div>
            <SvgArrowLongRight className="Cart__pageArrow"/>
            <div className="Cart__pageTitle" onClick={() => this.goToPageStageThree(null)}>
              <p className={'Cart__pageNumber' + (this.state.pageStage === 3 ? ' Cart__pageNumber_active' : '')}>3</p>
              <p className="Cart__pageName">Подтверждение заказа</p>
            </div>

          </div>
        </MediaQuery>
        <MediaQuery maxWidth={900}>
          <div className='Cart__topPanel'>

            <div className="Cart__pageTitle" onClick={() => this.goToPage(1)}>
              <p className={'Cart__pageNumber' + (this.state.pageStage === 1 ? ' Cart__pageNumber_active' : '')}>1</p>
            </div>
            <SvgArrowLongRight className="Cart__pageArrow"/>
            <div className="Cart__pageTitle" onClick={() => this.goToPage(2)}>
              <p className={'Cart__pageNumber' + (this.state.pageStage === 2 ? ' Cart__pageNumber_active' : '')}>2</p>
            </div>
            <SvgArrowLongRight className="Cart__pageArrow"/>
            <div className="Cart__pageTitle" onClick={() => this.goToPageStageThree(null)}>
              <p className={'Cart__pageNumber' + (this.state.pageStage === 3 ? ' Cart__pageNumber_active' : '')}>3</p>
            </div>

          </div>
        </MediaQuery>
        {
          // компонент удаляет элементы из cart, который нет в cartItems после запроса.
          (this.props.cartItems.length && (this.props.cartItems.length < this.props.cart.length))
            ? <FnComponentCurrentQuantity cart={this.props.cart}
                                          cartItems={this.props.cartItems}
                                          allItemRemovedFromCart={this.props.allItemRemovedFromCart}
            />
            : <></>
        }


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
                  {
                    this.state.pageStage === 1
                    && <section className='Cart__containerProductsPage'>
                      <div className='Cart__mainContainer'>
                        <div className="Cart__productsContainer" style={!this.props.cart.length ? {width: '100%'} : {}}>
                          <p className="Cart__titlePanel">
                            В корзине {countProducts} {num_word(countProducts, ['товар', 'товара', 'товаров'])}
                          </p>
                          <div className='Cart__itemContainer'>
                            {this.props.cart.length === 0
                              ? <p style={{padding: 40, fontSize: '2rem'}}>Корзина пуста</p>
                              : this.props.cartItems.map((item, i) => {
                                const index = this.props.cart.findIndex((cartItem) => cartItem.itemId === item.guid);
                                const count = index > -1 ? this.props.cart[index].count : null
                                const maxCountProduct = stopCount(item)
                                if (maxCountProduct && count && count > maxCountProduct) {
                                  const delta = count - maxCountProduct
                                  // ставим в cart[index].count значение maxCountProduct
                                  this.props.setCountItemCart(item.guid, delta)
                                }
                                const priceIndex = item.retails.findIndex(retail => retail.guid === this.props.selectedRetail)
                                const price = priceIndex >= 0 ? item.retails[priceIndex].priceRetail : null
                                return this.props.cart[index] !== undefined
                                  && <div key={(item.guid + i + 134).toString()}>
                                    <MediaQuery minWidth={901}>
                                      <CartItem key={(item.guid + i + 30).toString()}
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
                                                addedToCart={() => this.props.addedToCart(item.guid)}
                                                itemRemovedFromCart={() => {
                                                  if (count > 1) this.props.itemRemovedFromCart(item.guid);
                                                }}
                                                allItemRemovedFromCart={() => this.props.allItemRemovedFromCart(item.guid)}
                                      />
                                    </MediaQuery>
                                    <MediaQuery maxWidth={900}>
                                      <CartItemMobile item={{
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
                                                      addedToCart={() => this.props.addedToCart(item.guid)}
                                                      itemRemovedFromCart={() => {
                                                        if (count > 1) this.props.itemRemovedFromCart(item.guid);
                                                      }}
                                                      allItemRemovedFromCart={() => this.props.allItemRemovedFromCart(item.guid)}
                                      />
                                    </MediaQuery>
                                  </div>
                              })
                            }
                          </div>
                          {
                            this.props.cart.length > 0 &&
                            <BlockWrapper classStyle='Cart__containerInfo'>
                              <h3 className='Cart__infoBlock-title'>Почему указана цена "ОТ" ?</h3>
                              <p className='Cart__infoBlock-text'>Цены в разных аптеках отличаются.</p>
                              <p className='Cart__infoBlock-text'>Мы показываем минимальную стоимость товара в вашем
                                городе.</p>
                              <p className='Cart__infoBlock-info'>Вот список товаров из вашей корзины по минимальным
                                ценам:</p>

                              {
                                this.props.cartItems.map((product, index) => {
                                  const minPriceRetail = product.retails.sort((a, b) => a.priceRetail > b.priceRetail ? 1 : -1)[0];
                                  return <div className='Cart__infoBlock-minPriceProducts'
                                              key={(product.guid + index + 31).toString()}>
                                    <div>
                                      <p className='Cart__infoBlock-productTitle'>{product.product}</p>
                                      <div className='Cart__infoBlock-streetRetail'>
                                        <p className='Cart__infoBlock-brand'>{minPriceRetail.brand}</p>
                                        <p
                                          className='Cart__infoBlock-streetText'>ул. {minPriceRetail.street} {minPriceRetail.buildNumber}</p>
                                      </div>

                                    </div>
                                    <p className='Cart__infoBlock-price'><b>{minPriceRetail.priceRetail} ₽</b></p>
                                  </div>
                                })
                              }

                            </BlockWrapper>
                          }
                        </div>

                        {
                          this.props.cart.length > 0
                          && <>
                            <MediaQuery maxWidth={1200}>

                              <div className='Cart__rightPanel'>
                                <div className='Cart__promoContainer'>

                                  {/*================== Рекламный блок ===================================*/}
                                  {
                                    this.getDataForPromoItem() !== null
                                    && <div>
                                      <p className="Cart__titlePanel">Вам пригодится</p>
                                      <CardItem onItemSelected={(itemId, event) => {
                                        if (!event.target.closest('button')) this.props.history.push(`/Card/${itemId}`);
                                      }}
                                                classStyle='Cart__promoBlock'
                                                itemProps={this.getDataForPromoItem()}
                                      />
                                    </div>
                                  }

                                </div>
                                <div>
                                  <p className="Cart__titlePanel">Ваш заказ</p>
                                  <div className='Cart__pricePanel'>
                                    <div className="Cart__pricePanelContent">
                                      <div className='Cart__resultPrice'>
                                        <span>{countProducts} {num_word(countProducts, ['товар', 'товара', 'товаров'])} на сумму от {minSum} ₽</span>
                                      </div>
                                      <button className='Cart__buttonToCart' onClick={() => this.goToPage(2)}>
                                        выбрать аптеку
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </MediaQuery>

                            <MediaQuery minWidth={1201}>
                              <div className='Cart__rightPanel'>
                                <p className="Cart__titlePanel">Ваш заказ</p>
                                <div className='Cart__pricePanel'>
                                  <div className="Cart__pricePanelContent">
                                    <div className='Cart__resultPrice'>
                                      <span>{countProducts} {num_word(countProducts, ['товар', 'товара', 'товаров'])} на сумму от {minSum} ₽</span>
                                    </div>
                                    <button className='Cart__buttonToCart' onClick={() => this.goToPage(2)}>
                                      выбрать аптеку
                                    </button>
                                  </div>
                                </div>
                                <div className='Cart__promoContainer'>

                                  {/*================== Рекламный блок ===================================*/}
                                  {
                                    (this.getDataForPromoItem() !== null)
                                    &&
                                    <div>
                                      <p className="Cart__titlePanel">Вам пригодится</p>
                                      <CardItem onItemSelected={(itemId, event) => {
                                        if (!event.target.closest('button')) this.props.history.push(`/Card/${itemId}`);
                                      }}
                                                classStyle='Cart__promoBlock'
                                                itemProps={this.getDataForPromoItem()}
                                      />
                                    </div>

                                  }

                                </div>
                              </div>
                            </MediaQuery>
                          </>
                        }
                      </div>
                    </section>
                  }

                  {
                    (this.state.pageStage === 2 && this.props.cart.length !== 0)
                    && <CartPageChoiceRetail data={{
                      allCountFullProductRetails,
                      notCompleteCountProductsRetails,
                      incompleteRetailItemState,
                      calcQuantityProduct: this.calcQuantityProduct,
                      isChecked: this.isChecked,
                      goToPageStageThree: this.goToPageStageThree,
                      showMap: this.state.popupMap,
                      showDesktopPopupMap: (boolean) => this.setState({popupMap: boolean}),
                      cartItems: this.props.cartItems,
                      cart: this.props.cart,
                      onSelectRetail: (retailGuid) => this.props.onSelectRetail(retailGuid),
                      retailsForMap,
                      selectedRetail: this.props.selectedRetail,
                      city: this.props.isCity.title
                    }}/>
                  }

                  {
                    this.state.pageStage === 3 && (this.props.selectedRetail || this.state.OrderNumber)
                    && <CartOrderPage retail={this.checkRetailItem()}
                                      errorAuth={this.props.errorAuth}
                                      isAuth={Boolean(this.props.TOKEN)}
                                      authorizedBySMSorPassword={this.props.authorizedBySMSorPassword}
                                      onSubmit={this.postBuyOrder}
                                      OrderNumber={this.state.OrderNumber}
                                      delOrderNumber={() => this.setState({OrderNumber: ''})}
                                      offSelectRetail={() => this.props.onSelectRetail(null)}
                                      refreshToken={this.props.refreshAuthentication}
                                      timer={{
                                        isShowTimer: this.state.isShowTimer,
                                        seconds: this.state.seconds,
                                        startTimer: this.startTimer
                                      }}
                    />
                  }
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
    errorAuth: state.errorAuth,
    error: state.error,
    cart: state.cart,
    favorites: state.favorites,
    isCity: state.isCity,
    cartItems: state.cartItems,
    retailsArr: state.retailsArr,
    loading: state.loading,
    selectedRetail: state.selectedRetail,
    TOKEN: state.TOKEN,
    promoItems: state.promoItems
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPromoItem: (productGuid) => dispatch(getPromoItem(productGuid)),
    refreshAuthentication: () => dispatch(refreshAuthentication()),
    authorizedByPassOrSMS: (phone, smsOrPass, callback) => dispatch(authorizedByPassOrSMS(phone, smsOrPass, callback)),
    authorizedBySMSorPassword: (phone, smsOrPass, callback) => dispatch(authorizedBySMSorPassword(phone, smsOrPass, callback)),
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item)),
    rewriteCart: (item) => dispatch(rewriteCart(item)),
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