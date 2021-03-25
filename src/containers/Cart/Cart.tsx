import React from "react"
import './Cart.scss'
import {connect} from "react-redux";
import {withRouter, RouteComponentProps} from "react-router-dom";
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
} from "../../actions";
import {
    calcQuantityProduct,
    calculateAmountArray, checkRetailItem, clearCartError,
    getCountLast, getDataForPromoItem, getFullCountProductsRetails,
    getFullRetailItemState, getSum, indexActiveRetail, isChecked, isFullActiveRetail, newCartItems, onLoading,
    postBuyOrder, sortProductThisRetail
} from './cartUtils'
import SvgArrowLongRight from "../../components/UI/icons/SvgArrowLongRight";
import CardItem from "../../components/CardItem";
import CartOrderPage from "./CartOrderPage/CartOrderPage";
import CartPageChoiceRetail from "./CartPageChoiceRetail/CartPageChoiceRetail";
import CartItems from "./CartItems";
import {CartItemType, TypeProductInfo, TypeisCity, TypeRetailItem, TypePromoItems} from "../../types";
import {StateType} from "../../store";
import {ThunkDispatch} from "redux-thunk";

type MapStatePropsType = {
    errorAuth: null | string,
    error: null | string,
    cart: CartItemType[],
    favorites: { guid: string, [key: string]: string | number | null }[],
    isCity: TypeisCity,
    cartItems: TypeProductInfo[],
    retailsArr: TypeRetailItem[],
    loading: number,
    selectedRetail: null | string,
    TOKEN: null | { accessToken: string, refreshToken: string },
    promoItems: null | TypePromoItems
}

type MapDispatchPropsType = {
    getPromoItem(productGuid: string[]): void,
    refreshAuthentication(): void,
    authorizedByPassOrSMS(phone: string, smsOrPass: string, callback: null | (() => void)): void,
    authorizedBySMSorPassword(phone: string, smsOrPass: string, callback: null | (() => void)): void,
    addedToCart(item: string): void,
    itemRemovedFromCart: (item: string) => void,
    allItemRemovedFromCart: (item: string) => void,
    rewriteCart: (cart: CartItemType[]) => void,
    fetchCartItems: () => void,
    onSelectRetail: (id: string | null) => void,
    clearCart: () => void,
    setCartItems: (cartItems: TypeProductInfo[]) => void,
    loadingTrue: () => void,
    loadingFalse: () => void,
    setCountItemCart: (idProduct: string, delta: number) => void
}

type Props = RouteComponentProps & MapStatePropsType & MapDispatchPropsType;

type State = {
    pageStage: number,
    popupMap: boolean,
    view: boolean,
    showListAndMapRetail: boolean,
    telephone: string,
    error: JSX.Element,
    loadingText: JSX.Element,
    OrderNumber: string,
    isShowTimer: boolean,
    seconds: number | null,
    thisTime: { date: string | number, iteration: number },
}

class Cart extends React.Component<Props, State> {
    timer: number | null;
    calculateAmountArray = calculateAmountArray.bind(this)
    getCountLast = getCountLast.bind(this)
    getFullRetailItemState = getFullRetailItemState.bind(this)
    calcQuantityProduct = calcQuantityProduct.bind(this)
    postBuyOrder = postBuyOrder.bind(this)
    clearCartError = clearCartError.bind(this)
    isFullActiveRetail = isFullActiveRetail.bind(this)
    checkRetailItem = checkRetailItem.bind(this)
    getSum = getSum.bind(this)
    onLoading = onLoading.bind(this)
    sortProductThisRetail = sortProductThisRetail.bind(this)
    newCartItems = newCartItems.bind(this)
    isChecked = isChecked.bind(this)
    indexActiveRetail = indexActiveRetail.bind(this)
    getFullCountProductsRetails = getFullCountProductsRetails.bind(this)
    getDataForPromoItem = () => getDataForPromoItem(this.props, this.props.cartItems)

    constructor(props: Props) {
        super(props);
        this.timer = null;
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
        // подгружаем все товары для корзины
        this.props.fetchCartItems()

        // подгружаем доп.продажи - complexes
        const cartFromLocalStorage: CartItemType[] = JSON.parse(localStorage.getItem("cart") as string)
        const arrItemId = cartFromLocalStorage.map(item => item.itemId)
        this.props.getPromoItem(arrItemId)
    }

    componentDidUpdate(prevProps: Props, prevState: any, snapshot: any) {
        // если в корзину добавился новый товар - пересобираем корзину
        if (!this.props.loading && (this.props.cartItems.length < this.props.cart.length)) {
            this.props.fetchCartItems()
        } else if (this.props.cartItems.length > this.props.cart.length) {
            // товар удалили из корзины, удаляем его из cartItems и пересобираем cartItems и retailsArr
            const newCartItems = this.props.cartItems.filter(item => this.props.cart.some(i => i.itemId === item.guid))
            this.props.setCartItems(newCartItems)
        }
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

    goToPage(n: number) {
        this.setState({pageStage: n})
        window.scrollTo({
            top: 0,
            left: 0,
        });
    }

    startTimer() {
        if (!this.timer) {
            this.timer = window.setInterval(() => {
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
        if (this.timer) {
            window.clearInterval(this.timer)
        }
        this.setState({isShowTimer: false})
        this.timer = null;
        this.setState({seconds: 60})
    }

    getMinSum() {
        const minPrice = (product: TypeProductInfo) => product.retails.sort((a, b) => a.priceRetail > b.priceRetail ? 1 : -1)[0].priceRetail
        const countInCart = (product: TypeProductInfo): number => this.props.cart.find(item => item.itemId === product.guid)!?.count
        return this.props.cartItems.reduce((acc, product) => {
            return acc = acc + (minPrice(product) * countInCart(product))
        }, 0)
    }

    render() {
        const stopCount = (product: TypeProductInfo) => product.retails.sort((a, b) => a.countLast < b.countLast ? 1 : -1)[0].countLast
        const minSum = this.getMinSum().toFixed(2)

        // список аптек с неполным наличием товара
        let incompleteRetailItemState = this.props.retailsArr
            .filter(item => item.product.length < this.props.cart.length)
            .sort((a, b) => ((a.product.length < b.product.length) || ((a.product.length === b.product.length) && ((a.sum ?? 0) > (b.sum ?? 0)))) ? 1 : -1)

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
            const isResult = (a.product.length < b.product.length) || ((a.product.length === b.product.length) && (aCount < bCount)) || ((aCount === bCount) && ((a.sum ?? 0) > (b.sum ?? 0)))
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
                                            <div className="Cart__productsContainer"
                                                 style={!this.props.cart.length ? {width: '100%'} : {}}>
                                              <p className="Cart__titlePanel">
                                                В
                                                корзине {countProducts} {num_word(countProducts, ['товар', 'товара', 'товаров'])}
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
                                                      <h3 className='Cart__infoBlock-title'>Почему указана цена "ОТ"
                                                        ?</h3>
                                                      <p className='Cart__infoBlock-text'>Цены в разных аптеках
                                                        отличаются.</p>
                                                      <p className='Cart__infoBlock-text'>Мы показываем минимальную
                                                        стоимость товара в вашем
                                                        городе.</p>
                                                      <p className='Cart__infoBlock-info'>Вот список товаров из вашей
                                                        корзины по минимальным
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
                                                                    <p className='Cart__infoBlock-price'>
                                                                        <b>{minPriceRetail.priceRetail} ₽</b></p>
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
                                                                this.props.promoItems !== null
                                                                && <div>
                                                                  <p className="Cart__titlePanel">Вам пригодится</p>
                                                                  <CardItem
                                                                    onItemSelected={(itemId: string, event: React.MouseEvent<HTMLDivElement>) => {
                                                                        if (!event.currentTarget.closest('button')) this.props.history.push(`/Card/${itemId}`);
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
                                                              <button className='Cart__buttonToCart'
                                                                      onClick={() => this.goToPage(2)}>
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
                                                                    onClick={() => this.goToPage(2)}>
                                                              выбрать аптеку
                                                            </button>
                                                          </div>
                                                        </div>
                                                        <div className='Cart__promoContainer'>

                                                            {/*================== Рекламный блок ===================================*/}
                                                            {
                                                                (this.props.promoItems !== null)
                                                                &&
                                                                <div>
                                                                  <p className="Cart__titlePanel">Вам пригодится</p>
                                                                  <CardItem
                                                                    onItemSelected={(itemId: string, event: React.MouseEvent) => {
                                                                        if (!event.currentTarget.closest('button')) this.props.history.push(`/Card/${itemId}`);
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
                                            showDesktopPopupMap: (boolean: boolean) => this.setState({popupMap: boolean}),
                                            cartItems: this.props.cartItems,
                                            cart: this.props.cart,
                                            onSelectRetail: (retailGuid: string) => this.props.onSelectRetail(retailGuid),
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

const mapStateToProps = (state: StateType): MapStatePropsType => {
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

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, {}, any>): MapDispatchPropsType => {
    return {
        getPromoItem: (productGuid: string[]) => dispatch(getPromoItem(productGuid)),
        refreshAuthentication: () => dispatch(refreshAuthentication()),
        authorizedByPassOrSMS: (phone: string, smsOrPass: string, callback: null | (() => void)) => dispatch(authorizedByPassOrSMS(phone, smsOrPass, callback)),
        authorizedBySMSorPassword: (phone: string, smsOrPass: string, callback: null | (() => void)) => dispatch(authorizedBySMSorPassword(phone, smsOrPass, callback)),
        addedToCart: (item: string) => dispatch(addedToCart(item)),
        itemRemovedFromCart: (item: string) => dispatch(itemRemovedFromCart(item)),
        allItemRemovedFromCart: (item: string) => dispatch(allItemRemovedFromCart(item)),
        rewriteCart: (cart: CartItemType[]) => dispatch(rewriteCart(cart)),
        fetchCartItems: () => dispatch(fetchCartItems()),
        onSelectRetail: (id: string | null) => dispatch(onSelectRetail(id)),
        clearCart: () => dispatch(clearCart()),
        setCartItems: (cartItems: TypeProductInfo[]) => dispatch(setCartItems(cartItems)),
        loadingTrue: () => dispatch(loadingTrue()),
        loadingFalse: () => dispatch(loadingFalse()),
        setCountItemCart: (idProduct: string, delta: number) => dispatch(setCountItemCart(idProduct, delta))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Cart))