import React from "react"
import './Cart.scss'
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import MediaQuery from 'react-responsive'
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
import CartPageChoiceRetail from "./CartPageChoiceRetail/CartPageChoiceRetail";
import CartItems from "./CartItems";

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
    this.delItemCart = this.delItemCart.bind(this)
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
    thisTime: {date: Date.now(), iteration: 0},
  }

  componentDidMount() {
    this.props.fetchCartItems()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    // запрашиваем данные для promoItem.
    if (this.props.cart.length && ((prevProps.cart.length !== this.props.cart.length) || (this.state.thisTime.iteration < 1))) {
      const time = Date.now();
      // если с предыдущего изменения прошло меньше 8сек - не будем плодить запросы.
      if (((time - 8000) > this.state.thisTime.date) || this.state.thisTime.iteration < 1) {
        const arrItemId = this.props.cart.map(item => item.itemId)
        this.props.getPromoItem(arrItemId)
        this.setState({thisTime: {date: time, iteration: this.state.thisTime.iteration + 1}})
      }
    }

    // Если cart изменилась, берём её данные с LocalStorage и на основании этих данных пересобираем массивы cartItems и retailsArr
    if (prevProps.cart !== this.props.cart) {
      let oldCart = [...this.props.cart]

      // если в корзину добавился новый товар - делаем по нему запрос и обновляем cartItems и retailsArr
      if (!this.props.loading && (this.props.cartItems.length < this.props.cart.length)) {
        // ищем недостающие элементы
        const productIdArr = this.props.cart.filter(itemCart => !this.props.cartItems.some(item => item.guid === itemCart.itemId));
        // если их много, то проходим по массиву, и запрашиваем каждый
        if (productIdArr.length > 1) {
          this.props.loadingTrue('getProductInfo в cart componentDidUpdate - внешний loader - ВКЛ')
          productIdArr.forEach(product => {
            const productId = product.itemId
            this.props.loadingTrue('подгружаем новые карточки, добавленные в корзину - getProductInfo в cart componentDidUpdate')
            apiService.getProductInfo(productId, this.props.isCity.guid)
              .then(response => {
                if (this.isEmpty(response)) {
                  if (!this.props.loading && (this.props.cartItems.length < this.props.cart.length)) {
                    this.delItemCart()
                  }
                } else {
                  const newCartItems = [...this.props.cartItems]
                  newCartItems.push(response)
                  this.props.setCartItems(newCartItems)
                }
              })
          })
          this.props.loadingFalse('getProductInfo в cart componentDidUpdate - внешний loader - ВЫКЛ')
        } else if (productIdArr.length === 1) {
          // если новый элемент один - запрашиваем его
          const productId = productIdArr[0].itemId
          this.props.loadingTrue('подгружаем новые карточки, добавленные в корзину - getProductInfo в cart componentDidUpdate')
          apiService.getProductInfo(productId, this.props.isCity.guid)
            .then(response => {
              if (this.isEmpty(response)) {
                if (!this.props.loading && (this.props.cartItems.length < this.props.cart.length)) {
                  this.delItemCart()
                }
              } else {
                const newCartItems = [...this.props.cartItems]
                newCartItems.push(response)
                this.props.setCartItems(newCartItems)
              }
            })
        }

      } else if (!this.props.loading && (this.props.cartItems.length > this.props.cart.length)) {
        // товар удалили из корзины, удаляем его из cartItems и пересобираем cartItems и retailsArr
        if (!this.props.loading) {
          const newCartItems = this.props.cartItems.filter(item => oldCart.some(i => i.itemId === item.guid))
          this.props.setCartItems(newCartItems)
        }
      }
    }
  }

  isEmpty(obj) {
    for (let key in obj) {
      return false;
    }
    return true;
  }


  delItemCart() {
    if (!this.props.loading && (this.props.cartItems.length < this.props.cart.length)) {
      const delItems = this.props.cart.filter(item => !this.props.cartItems.some((element => element.guid === item.itemId)))
      // тут нужно добавить вывод сообщения пользователю, чтобы кол.тов. просто не исчезало - а то было 8, перешёл в корзину - стало 5.
      console.log('По этим товарам сервер ответил ошибкой, они удалены из корзины: ', delItems)
      delItems.forEach(item => {
        this.props.allItemRemovedFromCart(item.itemId)
      })
    }
  }

  getDataForPromoItem() {
    if (this.props.promoItems instanceof Object && (this.props.promoItems?.promoItems.length > 0)) {
      const arrPromoItems = this.props.promoItems?.promoItems
      let index = 0
      let promoItem = arrPromoItems[index]
      // если первые 5 символов в названии схожи с названием карточек корзины, то в while берём следующий элемент массива
      const isEqualString = () => this.props.cartItems.some(item => item.product.slice(0, 5) === arrPromoItems[index].product.slice(0, 5))

      while (isEqualString() && index < arrPromoItems.length) {
        promoItem = arrPromoItems[Math.min(arrPromoItems.length - 1, index)]
        index++
      }
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
      result.promo = true;

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

                          <CartItems cart={this.props.cart}
                                     cartItems={this.props.cartItems}
                                     stopCount={stopCount}
                                     setCountItemCart={this.props.setCountItemCart}
                                     selectedRetail={this.props.selectedRetail}
                                     addedToCart={this.props.addedToCart}
                                     itemRemovedFromCart={this.props.itemRemovedFromCart}
                                     allItemRemovedFromCart={this.props.allItemRemovedFromCart}
                          />
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