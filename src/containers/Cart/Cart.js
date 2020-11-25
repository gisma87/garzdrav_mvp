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
  onSelectRetail, clearCart,
} from "../../actions";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import PopupMapCart from "../../components/PopupMapCart/PopupMapCart";
import PopupOrder from "../../components/PopupOrder";
import RetailItem from "../../components/RetailItem";
import PopupMapCartMobile from "../../components/PopupMapCartMobile/PopupMapCartMobile";
import Error from "../../components/Error/Error";

class Cart extends React.Component {

  state = {
    active: false,
    popupMap: false,
    popupOrder: false,
    view: false,
    telephone: '',
    error: <Error/>
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

  // соответствует ли id элемента выбранное аптеке
  isChecked = (id) => this.props.selectedRetail === id;

  // возвращает элемент выбранной аптеки
  checkRetailItem = () => {
    return this.props.retailsArr.find(item => item.guid === this.props.selectedRetail)
  }

  // возвращает массив аптек с полным наличием товара или null
  getFullRetailItemState = () => {
    const itemArr = this.props.retailsArr.filter(item => item.product.length >= this.props.cart.length)
    if (itemArr.length > 0) {
      return itemArr
    }
    return null
  }

  // возвращает массив id товара - сумма этого товара в выбранной аптеке
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

  // возвращает подпись в сколько товаров из списка есть в данной аптеке на вход принимает массив товаров в аптеке
  calcQuantityProduct = (obj) => {
    const styleErr = {
      color: 'red',
      fontSize: 14,
      display: 'inline',
      borderBottom: '1px dashed #000',
      cursor: 'pointer'
    }
    const a = obj.length
    const b = this.props.cart.length

    if (a === b) {
      return <p style={{
        fontSize: 14,
        color: 'green',
        display: 'inline',
        borderBottom: '1px dashed #000',
        cursor: 'pointer'
      }}>все товары</p>
    }

    return <p style={styleErr}>{a} из {b} товаров</p>
  }

  // проверяет имеет ли активная Аптека полный набор товаров
  isFullActiveRetail = () => {
    return this.checkRetailItem().product.length === this.props.cart.length
  }

  // возвращает сумму всех товаров в выбранной аптеке
  getSum = () => {
    const sum = this.calculateAmountArray().reduce((accumulator, currentValue) => {
      if (currentValue.sum === null) return accumulator;
      return currentValue.sum + accumulator
    }, 0)
    return +sum.toFixed(2)
  }

  postBuyOrder = () => {
    const {guid, product, sum} = this.checkRetailItem()
    const send = {guid, telephone: this.state.telephone, product, sum}
    console.log(send);

  }

  clearCartError = () => {
    setTimeout(this.props.clearCart, 8000)
    setTimeout(() => {
      this.setState({
        error: <p style={{fontSize: 24}}>Запрос вернул ошибку, из-за смены регионов. Корзина будет очищена.</p>
      })
    }, 2000)
    return this.state.error
  }


  render() {
    const sum = this.getSum()
    let incompleteRetailItemState = []
    incompleteRetailItemState = this.props.retailsArr.filter(item => item.product.length < this.props.cart.length)

    return (
      <div className='Cart wrapper'>
        <h1>Корзина</h1>
        {this.props.error ? this.clearCartError()
          : <>
            {(this.props.retailsArr.length < 1) && (this.props.cart.length > 0) && !this.props.error
              ? <p>Загрузка ...</p>
              : <>
                {!this.props.isRetailAllProduct &&
                <p>К сожалению нет аптек с полным ассортиментом выбранного товара</p>}

                <section className='Cart__mainContainer'>
                  <div className='Cart__itemContainer'>
                    {this.props.cart.length === 0 ? "Корзина пуста" :
                      this.props.cartItems.map((item) => {
                        const index = this.props.cart.findIndex((cartItem) => cartItem.itemId === item.guid);
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

                  {this.props.cart.length > 0 && <div className='Cart__rightPanel'>
                    <BlockWrapper classStyle='Cart__pricePanel'>
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
                        {!(this.checkRetailItem().product.length === this.props.cart.length) &&
                        <span style={{color: 'red', margin: 0}}>товар доступен частично</span>}
                      </div>
                      <button className='Cart__button Cart__buttonToCart'
                              onClick={() => this.setState({popupOrder: true})}
                      >
                        Купить
                      </button>
                    </BlockWrapper>
                    <button onClick={this.props.clearCart}
                            className='Cart__button Cart__buttonMap Cart__clearBtn'
                    >Очистить корзину
                    </button>
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
                                           quantity={this.calcQuantityProduct(this.getFullRetailItemState()[0].product)}
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
                                                     quantity={this.calcQuantityProduct(item.product)}
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
                                                   quantity={this.calcQuantityProduct(item.product)}
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
                                 onChangeInput={(e) => this.setState({telephone: e.target.value})}
                                 retails={this.props.retailsArr}
                                 isFullActiveRetail={this.isFullActiveRetail()}
                                 cart={this.props.cart}
                                 product={this.checkRetailItem().product}
                                 onSubmit={this.postBuyOrder}
                  />
                }
              </>
            }</>}
      </div>
    )
  }
}

const mapStateToProps = (
  {
    error,
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
    error,
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
    onSelectRetail: (id) => dispatch(onSelectRetail(id)),
    clearCart: () => dispatch(clearCart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Cart))