import React, {useEffect, useState} from "react";
import {YMInitializer} from 'react-yandex-metrika';
import {useMediaQuery} from 'react-responsive'
import App from "./App";
import AppMobile from "./AppMobile/AppMobile";
import {CartItemType, TypeProductInfo} from "./types";
import {
    fetchCartItems,
    fetchCities,
    loadingReset,
    refreshAuthentication,
    rewriteCart, setActivePromoGroup,
    setCatalog,
    setFalseIsDelCartItems,
    setItemsForPromoBlock1, setPopularItemsForPromoBlock3, setSeasonItemsForPromoBlock2,
} from "./actions";
import {connect} from "react-redux";
import Alert from "./components/UI/Alert/Alert";
import {StateType} from "./store";
import {ThunkDispatch} from "redux-thunk";
import PopupLogin from "./components/PopupLogin";
import ReactGA from 'react-ga';

type MapStatePropsType = {
    loading: number,
    cart: CartItemType[],
    isDelCartItem: boolean,
    itemsForPromoBlock1: TypeProductInfo[]
}

type MapDispatchPropsType = {
    loadingReset: () => Object,
    setFalseIsDelCartItems: () => Object,
    fetchCartItems(): void,
    fetchCities(): void,
    refreshAuthentication(): void,
    rewriteCart(cart: CartItemType[]): { type: string, payload: any },
    setActivePromoGroup(promo: { name: string, arrPromo: { [key: string]: any }[] }): { type: string, payload: any },
    setCatalog(): void,
    setItemsForPromoBlock1(): void,
    setPopularItemsForPromoBlock3(): void,
    setSeasonItemsForPromoBlock2(): void
}

type OwnProps = {}

type Props = MapStatePropsType & MapDispatchPropsType & OwnProps;

const MobileOrDesktop: React.FC<Props> = (props) => {

    // если Лоадер висит больше 30сек - удаляем его.
    useEffect(() => {
        let timer: number | null = null;
        if (props.loading) {
            const fn = () => {
                if (props.loading) {
                    props.loadingReset()
                }
                timer = null;
            }
            timer = window.setTimeout(fn, 30000)
        }
        return () => {
            if (timer) {
                clearTimeout(timer)
            }
        }
        // eslint-disable-next-line
    }, [props.loading])

    useEffect(() => {
        props.fetchCities();
        props.setCatalog()
        props.setItemsForPromoBlock1()
        props.setSeasonItemsForPromoBlock2()
        props.setPopularItemsForPromoBlock3()

        if (localStorage.getItem("TOKEN")) {
            props.refreshAuthentication()
        }

        if (localStorage.getItem("cart")) {
            const cartFromLocalStorage: CartItemType[] = JSON.parse(localStorage.getItem("cart") as string)
            // проверяем cart на дубликаты и записываем из localStorage в Redux.store
            const cartSetID = new Set()
            cartFromLocalStorage.forEach(item => cartSetID.add(item.itemId))
            const resultCart: CartItemType[] = []
            cartSetID.forEach(itemID => resultCart.push(cartFromLocalStorage.find(itemCart => itemCart.itemId === itemID) as CartItemType))
            props.rewriteCart(resultCart)

            // серия запросов - формируется массив элементов корзины
            props.fetchCartItems()
        }
// включаем google analytics
        ReactGA.initialize('UA-139848378-2');
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, [])// eslint-disable-line

    useEffect(() => {
        if (props.itemsForPromoBlock1.length) {
            props.setActivePromoGroup({
                name: 'Акционные товары',
                arrPromo: props.itemsForPromoBlock1
            })
        }// eslint-disable-next-line
    }, [props.itemsForPromoBlock1])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(props.cart));
    }, [props.cart])

    useEffect(() => {
        if (props.isDelCartItem) {
            props.setFalseIsDelCartItems()
            setAlertShow(true)
        }// eslint-disable-next-line
    }, [props.isDelCartItem])

    const [alertShow, setAlertShow] = useState(false)

    const isMobile = useMediaQuery({query: '(max-width: 900px)'})

    return (
        <>
            <YMInitializer accounts={[74874832]} options={{defer: true}}/>
            {isMobile ? <AppMobile/> : <App/>}
            <Alert show={alertShow} onClose={() => setAlertShow(false)} title='Информируем: '>
                <p>Часть товаров из корзины была удалена, т.к. их нет в наличии в вашем городе.</p>
            </Alert>
            <PopupLogin/>
        </>
    )

}

const mapStateToProps = ({cart, loading, isDelCartItem, itemsForPromoBlock1}: StateType) => {
    return {cart, loading, isDelCartItem, itemsForPromoBlock1}
}

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, {}, any>) => {
    return {
        loadingReset: () => dispatch(loadingReset()),
        setFalseIsDelCartItems: () => dispatch(setFalseIsDelCartItems()),
        fetchCities: () => dispatch(fetchCities()),
        rewriteCart: (cart: CartItemType[]) => dispatch(rewriteCart(cart)),
        fetchCartItems: () => dispatch(fetchCartItems()),
        refreshAuthentication: () => dispatch(refreshAuthentication()),
        setCatalog: () => dispatch(setCatalog()),
        setItemsForPromoBlock1: () => dispatch(setItemsForPromoBlock1()),
        setSeasonItemsForPromoBlock2: () => dispatch(setSeasonItemsForPromoBlock2()),
        setPopularItemsForPromoBlock3: () => dispatch(setPopularItemsForPromoBlock3()),
        setActivePromoGroup: (promo: { name: string, arrPromo: { [key: string]: any }[] }) => dispatch(setActivePromoGroup(promo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileOrDesktop)