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
import num_word from "../../utils/numWord";
import RetailCheckPanel from "../../components/RetailCheckPanel";
import {
  addedToCart,
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
  getCountLast, getFullCountProductsRetails,
  getFullRetailItemState, getSum, indexActiveRetail, isChecked, isFullActiveRetail, newCartItems, onLoading,
  postBuyOrder, sortProductThisRetail
} from './cartUtils'
import PopupLogin from "../../components/PopupLogin/PopupLogin";
import SvgArrowLongRight from "../../components/UI/icons/SvgArrowLongRight";
import CardItem from "../../components/CardItem";
import apiService from "../../service/ApiService";
import CartOrderPage from "./CartOrderPage/CartOrderPage";

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
    this.getFullCountProductsRetails = getFullCountProductsRetails.bind(this)

  }

  state = {
    pageStage: 1,
    active: false,
    popupMap: false,
    popupOrder: false,
    popupLogin: false,
    isHasBuy: false,
    view: false,
    telephone: '',
    error: <Error/>,
    loadingText: <Loader classStyle='Loader_is-opened'/>,
    OrderNumber: '',
    popupBuy: false,
    promoItem: null,
  }

  componentDidMount() {
    this.props.fetchCartItems()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    // запрашиваем данные для promoItem.
    if (!this.state.promoItem && this.props.cartItems.length) {
      apiService.getProductInfo(this.props.cartItems[0].guid, this.props.isCity.guid)
        .then(response => {
          const minPrice = response.retails.sort((a, b) => a.priceRetail > b.priceRetail ? 1 : -1)[0].priceRetail
          this.setState({promoItem: {...response, minPrice}})
        })
    }

    // Если корзина изменилась, берём её данные с LocalStorage и на основании этих данных пересобираем массивы cartItems и retailsArr
    if (prevProps.cart !== this.props.cart) {
      let oldCart = [...this.props.cart]
      // if (localStorage.getItem("cart")) {
      //   oldCart = JSON.parse(localStorage.getItem("cart"))
      // }
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

  getDataForPromoItem() {
    if (this.state.promoItem) {
      const result = {}
      const itemIndex = this.props.cart.findIndex((item) => item.itemId === this.state.promoItem.guid);
      result.isBuy = itemIndex >= 0;
      result.count = result.isBuy ? this.props.cart[itemIndex].count : 0
      result.key = this.state.promoItem.guid
      result.id = this.state.promoItem.guid
      result.title = this.state.promoItem.product
      result.maker = this.state.promoItem.manufacturer
      result.img = this.state.promoItem.img
      result.minPrice = this.state.promoItem.minPrice
      result.onIncrement = () => this.props.addedToCart(this.state.promoItem.guid)
      result.onDecrement = () => this.props.itemRemovedFromCart(this.state.promoItem.guid)

      return result
    }
    return null
  }

  goToPageStageThree = (retailId = null) => {
    if (retailId) {
      this.props.onSelectRetail(retailId);
      this.setState({pageStage: 3})
    } else if (this.props.selectedRetail) {
      this.setState({pageStage: 3})
    } else {
      this.setState({pageStage: 2})
    }
  }


  render() {
    // const sum = this.getSum()
    const stopCount = (product) => product.retails.sort((a, b) => a.countLast < b.countLast ? 1 : -1)[0].countLast
    const dataForPromoItem = this.getDataForPromoItem();
    const getMinSum = () => {
      const minPrice = (product) => product.retails.sort((a, b) => a.priceRetail > b.priceRetail ? 1 : -1)[0].priceRetail
      const count = (product) => this.props.cart.find(item => item.itemId === product.guid)?.count
      return this.props.cartItems.reduce((acc, product) => {
        return acc = acc + (minPrice(product) * count(product))
      }, 0)
    }
    const minSum = getMinSum()

    // список аптек с неполным наличием товара
    let incompleteRetailItemState = this.props.retailsArr
      .filter(item => item.product.length < this.props.cart.length)
      .sort((a, b) => ((a.product.length < b.product.length) || ((a.product.length === b.product.length) && (a.sum > b.sum))) ? 1 : -1)

    // общее количество товаров в корзине
    const countProducts = this.props.cart.reduce((sum, item) => {
      return item.count + sum
    }, 0)

    const {allCountFullProductRetails, notCompleteCountProductsRetails} = this.getFullCountProductsRetails()

    const retailsForMap = [...this.props.retailsArr].sort((a, b) => {
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
        <div className='Cart__topPanel'>

          <div className="Cart__pageTitle" onClick={() => this.setState({pageStage: 1})}>
            <p className={'Cart__pageNumber' + (this.state.pageStage === 1 ? ' Cart__pageNumber_active' : '')}>1</p>
            <p className="Cart__pageName">Корзина</p>
          </div>
          <SvgArrowLongRight className="Cart__pageArrow"/>
          <div className="Cart__pageTitle" onClick={() => this.setState({pageStage: 2})}>
            <p className={'Cart__pageNumber' + (this.state.pageStage === 2 ? ' Cart__pageNumber_active' : '')}>2</p>
            <p className="Cart__pageName">Выбор аптеки</p>
          </div>
          <SvgArrowLongRight className="Cart__pageArrow"/>
          <div className="Cart__pageTitle" onClick={() => this.goToPageStageThree(null)}>
            <p className={'Cart__pageNumber' + (this.state.pageStage === 3 ? ' Cart__pageNumber_active' : '')}>3</p>
            <p className="Cart__pageName">Подтверждение заказа</p>
          </div>

          {/*{*/}
          {/*  this.props.cart.length > 0 &&*/}
          {/*  <p className='Cart__clearBtn' onClick={this.props.clearCart}>Очистить корзину</p>*/}
          {/*}*/}

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
                  {/*{!this.props.isRetailAllProduct &&*/}
                  {/*<p style={{marginBottom: 10}}>К сожалению нет аптек с полным ассортиментом выбранного товара</p>}*/}

                  {/*<div className="Cart__titleContainer">*/}
                  {/*  <p className="Cart__countProducts">*/}
                  {/*    В корзине {countProducts} {num_word(countProducts, ['товар', 'товара', 'товаров'])}*/}
                  {/*  </p>*/}
                  {/*</div>*/}


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
                              ? <p style={{padding: 20, fontSize: '2rem'}}>Корзина пуста</p>
                              : this.props.cartItems.map((item, i) => {
                                // const countLast = this.getCountLast(item.guid)
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
                                // const sum = this.calculateAmountArray().find(itemArr => itemArr.guid === item.guid)?.sum
                                return this.props.cart[index] !== undefined
                                  && <CartItem key={item.guid + i}
                                               item={{
                                                 id: item.guid,
                                                 img: null,
                                                 title: item.product,
                                                 maker: item.manufacturer,
                                                 minPrice: item.retails.sort((a, b) => a.priceRetail > b.priceRetail ? 1 : -1)[0].priceRetail,
                                                 price,
                                                 // sum,
                                                 // countLast
                                               }}
                                               retails={item.retails}
                                               classStyle={'Cart__item'}
                                               count={count}
                                               addedToCart={() => {
                                                 this.props.addedToCart(item.guid)
                                               }}
                                               itemRemovedFromCart={() => {
                                                 if (count > 1) {
                                                   this.props.itemRemovedFromCart(item.guid)
                                                 }
                                               }}
                                               allItemRemovedFromCart={() => {
                                                 this.props.allItemRemovedFromCart(item.guid)
                                               }}
                                  />
                              })
                            }
                          </div>
                        </div>

                        {
                          this.props.cart.length > 0
                          && <>
                            <MediaQuery maxWidth={1200}>

                              <div className='Cart__rightPanel'>
                                <div className='Cart__promoContainer'>
                                  <p className="Cart__titlePanel">Вам пригодится</p>
                                  {this.state.promoItem
                                  && <CardItem onItemSelected={(itemId, event) => {
                                    if (!event.target.closest('button')) this.props.history.push(`/Cards/${itemId}`);
                                  }}
                                               classStyle='Cart__promoBlock'
                                               onIncrement={dataForPromoItem.onIncrement}
                                               onDecrement={dataForPromoItem.onDecrement}
                                               isBuy={dataForPromoItem.isBuy}
                                               count={dataForPromoItem.count}
                                               key={dataForPromoItem.key}
                                               id={dataForPromoItem.id}
                                               title={dataForPromoItem.title}
                                               maker={dataForPromoItem.maker}
                                               img={dataForPromoItem.img}
                                               minPrice={dataForPromoItem.minPrice}
                                  />
                                  }
                                </div>
                                <div>
                                  <p className="Cart__titlePanel">Ваш заказ</p>
                                  <div className='Cart__pricePanel'>
                                    <div className="Cart__pricePanelContent">
                                      <div className='Cart__resultPrice'>
                                        <span>{countProducts} {num_word(countProducts, ['товар', 'товара', 'товаров'])} на сумму от {minSum} ₽</span>
                                      </div>
                                      <button className='Cart__buttonToCart'
                                              onClick={() => this.setState({pageStage: 2})}
                                        // onClick={() => {
                                        //   if (!!this.props.TOKEN) {
                                        //     this.setState({popupOrder: true})
                                        //   } else {
                                        //     this.setState({popupLogin: true, isHasBuy: true})
                                        //   }
                                        // }}
                                      >
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
                                    <button className='Cart__buttonToCart'
                                            onClick={() => this.setState({pageStage: 2})}
                                      // onClick={() => {
                                      //   if (!!this.props.TOKEN) {
                                      //     this.setState({popupOrder: true})
                                      //   } else {
                                      //     this.setState({popupLogin: true, isHasBuy: true})
                                      //   }
                                      // }}
                                    >
                                      выбрать аптеку
                                    </button>
                                  </div>
                                </div>
                                <div className='Cart__promoContainer'>
                                  <p className="Cart__titlePanel">Вам пригодится</p>
                                  {this.state.promoItem
                                  && <CardItem onItemSelected={(itemId, event) => {
                                    if (!event.target.closest('button')) this.props.history.push(`/Cards/${itemId}`);
                                  }}
                                               classStyle='Cart__promoBlock'
                                               onIncrement={dataForPromoItem.onIncrement}
                                               onDecrement={dataForPromoItem.onDecrement}
                                               isBuy={dataForPromoItem.isBuy}
                                               count={dataForPromoItem.count}
                                               key={dataForPromoItem.key}
                                               id={dataForPromoItem.id}
                                               title={dataForPromoItem.title}
                                               maker={dataForPromoItem.maker}
                                               img={dataForPromoItem.img}
                                               minPrice={dataForPromoItem.minPrice}
                                  />
                                  }
                                </div>


                              </div>
                            </MediaQuery>
                          </>
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
                              return <div className='Cart__infoBlock-minPriceProducts' key={product.guid + index}>
                                <div>
                                  <p className='Cart__infoBlock-productTitle'>{product.product}</p>
                                  <div className='Cart__infoBlock-streetRetail'>
                                    <p className='Cart__infoBlock-brand'>{minPriceRetail.brand}</p>
                                    <p className='Cart__infoBlock-streetText'>ул. {minPriceRetail.street}</p>
                                    <p className='Cart__infoBlock-streetText'>{minPriceRetail.buildNumber}</p>
                                  </div>

                                </div>
                                <p><b>{minPriceRetail.priceRetail} ₽</b></p>
                              </div>
                            })
                          }

                        </BlockWrapper>
                      }
                    </section>
                  }

                  {
                    this.state.pageStage === 2
                    && <>
                      {
                        this.props.cart.length !== 0
                        && <section className='Cart__choiceRetail'>
                          <h3 className='Cart__choiceRetailTitle'>Выберите аптеку, в которой хотите забрать заказ</h3>

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
                                                retails={this.props.retailsArr}
                                                activeRetail={this.props.selectedRetail}
                                                cartLength={this.props.cart.length}
                                                point={this.checkRetailItem()?.coordinates}
                                                onClick={() => this.setState({popupMap: false})}
                                                onSelectItem={idSelectRetail => this.props.onSelectRetail(idSelectRetail)}
                            />
                          </MediaQuery>

                          <MediaQuery minWidth={801}>

                            <div className='Cart__buttonContainer'>
                              <button
                                className='Cart__menuButton Cart__menuButton_active'
                              >Показать списком
                              </button>
                              <button
                                className='Cart__menuButton'
                                onClick={() => this.setState({popupMap: true})}
                              >Показать на карте
                              </button>
                            </div>

                            <div className='Cart__blockTitle'>
                              {
                                allCountFullProductRetails.length > 0 &&
                                <h2 className='Cart__titleChoice'>Всё в наличии:</h2>
                              }
                            </div>

                            <PopupMapCart active={this.state.popupMap}
                                          retails={retailsForMap}
                                          activeRetail={this.props.selectedRetail}
                                          cartLength={this.props.cart.length}
                                          onClick={() => this.setState({popupMap: false})}
                                          onSelectItem={(retailId) => {
                                            this.setState({popupMap: false})
                                            this.goToPageStageThree(retailId)
                                          }}
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
                                  ?
                                  <p style={{padding: 20}}>не найдено аптек с полным ассортиментом выбранного товара</p>
                                  : this.getFullRetailItemState().map((item, index) => {
                                    if (index === 0) return null;
                                    return <RetailItem
                                      key={item.guid + index}
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
                                allCountFullProductRetails.length > 0
                                && <BlockWrapper classStyle='Cart__blockMoreItems'>
                                  {
                                    allCountFullProductRetails.map((product, index) => {
                                      // if (index === 0) return null;
                                      return <RetailCheckPanel key={product.guid + index}
                                                               quantity={this.calcQuantityProduct(product.product)}
                                                               item={product}
                                                               onCheck={() => {

                                                                 this.goToPageStageThree(product.guid)
                                                               }}
                                                               openPopupMap={() => {
                                                                 this.props.onSelectRetail(product.guid)
                                                                 this.setState({popupMap: true})
                                                               }}
                                      />
                                    })
                                  }
                                </BlockWrapper>
                              }

                              {
                                notCompleteCountProductsRetails.length > 0
                                && <>
                                  <h2 className='Cart__titleChoice'>Не полное количество:</h2>
                                  <BlockWrapper classStyle='Cart__blockMoreItems'>
                                    {
                                      notCompleteCountProductsRetails.map((product, index) => {
                                        // if (index === 0) return null;
                                        return <RetailCheckPanel key={product.guid + index}
                                                                 quantity={this.calcQuantityProduct(product.product)}
                                                                 item={product}
                                                                 onCheck={() => {
                                                                   this.goToPageStageThree(product.guid)
                                                                 }}
                                                                 openPopupMap={() => {
                                                                   this.props.onSelectRetail(product.guid)
                                                                   this.setState({popupMap: true})
                                                                 }}
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
                              <h2 className='Cart__titleChoice'>Нет части товаров: </h2>

                              <MediaQuery maxWidth={800}>
                                <BlockWrapper classStyle='Cart__blockMoreItems'>
                                  {incompleteRetailItemState.map((item, index) => {
                                    return <RetailItem
                                      key={item.guid + index}
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
                                    incompleteRetailItemState.map((product, index) => {
                                      return <RetailCheckPanel key={product.guid + index}
                                                               item={product}
                                                               quantity={this.calcQuantityProduct(product.product)}
                                                               onCheck={() => {
                                                                 this.goToPageStageThree(product.guid)
                                                               }}
                                                               openPopupMap={() => {
                                                                 this.props.onSelectRetail(product.guid)
                                                                 this.setState({popupMap: true})
                                                               }}
                                      />
                                    })
                                  }
                                </BlockWrapper>
                              </MediaQuery>
                            </>
                          }
                        </section>
                      }

                      {
                        this.state.popupLogin
                        && <PopupLogin active={this.state.popupLogin}
                                       onClick={() => {
                                         this.setState({popupLogin: false})
                                       }}
                        />
                      }

                      {
                        this.props.retailsArr.length > 0
                        && <PopupOrder active={this.state.popupOrder || (this.state.isHasBuy && !!this.props.TOKEN)}
                                       isLogin={!!this.props.TOKEN}
                                       checked={this.props.selectedRetail}
                                       onClick={() => this.setState({popupOrder: false, isHasBuy: false})}
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

                  {
                    this.state.pageStage === 3 && this.props.selectedRetail
                    && <CartOrderPage retail={this.checkRetailItem()}/>
                    // <div>
                    //   <p>Подтверждение заказа</p>
                    //   {
                    //     this.props.selectedRetail
                    //     && <div className='Cart__rightPanel'>
                    //       <div className='Cart__pricePanel'>
                    //         <div className='Cart__resultPrice'>
                    //           <span>Общая сумма:</span> <span>{sum} ₽</span>
                    //         </div>
                    //         <div className='Cart__retail'>
                    //           <p>Забрать из аптеки:</p>
                    //           <p className='Cart__address'>
                    //             г. {this.checkRetailItem()?.city}, {this.checkRetailItem()?.street}, {this.checkRetailItem()?.buildNumber}
                    //           </p>
                    //           {!(this.checkRetailItem()?.product?.length === this.props.cart.length) &&
                    //           <span className='Cart__warningMessage'>ТОВАР ДОСТУПЕН ЧАСТИЧНО</span>}
                    //         </div>
                    //         <button className='Cart__buttonToCart'
                    //                 onClick={() => {
                    //                   if (!!this.props.TOKEN) {
                    //                     this.setState({popupOrder: true})
                    //                   } else {
                    //                     this.setState({popupLogin: true, isHasBuy: true})
                    //                   }
                    //                 }}
                    //         >
                    //           Купить
                    //         </button>
                    //       </div>
                    //     </div>}
                    // </div>
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
    error: state.error,
    cart: state.cart,
    favorites: state.favorites,
    isCity: state.isCity,
    cartItems: state.cartItems,
    retailsArr: state.retailsArr,
    loading: state.loading,
    selectedRetail: state.selectedRetail,
    // isRetailAllProduct: state.isRetailAllProduct,
    TOKEN: state.TOKEN
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
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