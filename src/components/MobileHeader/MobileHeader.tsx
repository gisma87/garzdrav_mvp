import React, {useState} from "react";
import './MobileHeader.scss'
import Backdrop from "../UI/Backdrop/Backdrop";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
import Burger from "../UI/Burger/Burger";
import Logo from "../UI/Logo/Logo";
import ButtonLogIn from "../UI/ButtonLogIn/ButtonLogIn";
import {NavLink, useHistory} from "react-router-dom";
import iconCart from "../../img/icon/cartIconSmall.png";
import PopupLocation from "../PopupLocation/PopupLocation";
import {StateType} from "../../store";
import {ThunkDispatch} from "redux-thunk";
import {clearCart, fetchCartItems, onPopupLocation, openPopupLogin, setIsCity} from "../../actions";
import {connect} from "react-redux";
import {CartItemType, TypeisCity} from "../../types";
import SearchPanel from "../SearchPanel";
import PopupCitiesMobile from "../PopupCitiesMobile/PopupCitiesMobile";

type MapStatePropsType = {
    isCity: TypeisCity,
    isPopupLocation: boolean,
    TOKEN: null | { accessToken: string, refreshToken: string },
    cart: CartItemType[],
    cities: TypeisCity[]
}

type MapDispatchPropsType = {
    onPopupLocation(): void,
    openPopupLogin(): void,
    clearCart(): void,
    setIsCity(item: TypeisCity): void,
    fetchCartItems(): void
}

type Props = MapStatePropsType & MapDispatchPropsType

const MobileHeader: React.FC<Props> = props => {

    const [isShowBurgerMenu, setIsShowBurgerMenu] = useState(false)
    const [popupCities, setPopupCities] = useState(false)
    let history = useHistory();

    const count = props.cart.reduce((sum, item) => {
        return item.count + sum
    }, 0)

    function goToPath(path: string) {
        setIsShowBurgerMenu(false)
        history.push(path)
    }

    const dropDownItems = [
        {
            title: props.isCity.title,
            callback: () => {
                setIsShowBurgerMenu(false)
                setPopupCities(true)
            }
        },
        {title: 'Каталог', callback: () => goToPath('/catalog/')},
        {title: 'Аптеки', callback: () => goToPath('/cities/')},
        {title: 'Оформление заказа', callback: () => goToPath('/how-to-buy/')},
        {title: 'Помощь', callback: () => goToPath('/faq/')}
    ]

    return (
        <>
            <header className='MobileHeader'>
                {isShowBurgerMenu && <Backdrop onClick={() => setIsShowBurgerMenu(false)}/>}
                <DropDownMenu isActive={isShowBurgerMenu} data={dropDownItems}/>
                <section className='MobileHeader__logoPanel' style={isShowBurgerMenu ? {zIndex: 10} : {}}>

                    <div className='MobileHeader__LogoPanelLeftBlock'>
                        <Burger isActive={isShowBurgerMenu} onClick={() => setIsShowBurgerMenu((prev => !prev))}/>
                        <Logo/>
                    </div>

                    <div className='MobileHeader__rightblock'>

                        <ButtonLogIn
                            onClick={() => {
                                setIsShowBurgerMenu(false)
                                if (props.TOKEN) {
                                    history.push('/profile/')
                                    window.scroll(0, 0)
                                } else props.openPopupLogin()
                            }}
                        />

                        <NavLink to="/cart/" className='MobileHeader__cart'>
                            <div className='MobileHeader__cartImgBox'>
                                <img src={iconCart} alt="корзина" className='MobileHeader__cartImg'/>
                            </div>
                            <span className='MobileHeader__cartCount'>{count}</span>
                        </NavLink>
                    </div>

                    {props.isPopupLocation && <PopupLocation active={props.isPopupLocation}
                                                             city={props.isCity.title}
                                                             openPopupCities={() => history.push('/cities/')}
                                                             closeThisPopup={props.onPopupLocation}
                    />}
                </section>
                <section className='MobileHeader__searchPanel'><SearchPanel/></section>
            </header>

            <PopupCitiesMobile active={popupCities}
                               isCity={props.isCity}
                               cities={props.cities}
                               onClick={() => setPopupCities(false)}
                               clearCart={props.clearCart}
                               onSelectCity={(idCity) => {
                                   document.body.style.overflow = 'auto'
                                   const item = props.cities.find(cityItem => cityItem.guid === idCity)
                                   if (item) props.setIsCity(item);
                                   setPopupCities(false);
                                   props.fetchCartItems()
                                   props.onPopupLocation()
                               }}
            />

            <div style={{paddingTop: 107}}/>
        </>
    )
}

const mapStateToProps = ({isCity, isPopupLocation, TOKEN, cart, cities}: StateType) => {
    return {isCity, isPopupLocation, TOKEN, cart, cities}
}

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, {}, any>) => {
    return {
        onPopupLocation: () => dispatch(onPopupLocation(false)),
        openPopupLogin: () => dispatch(openPopupLogin()),
        clearCart: () => dispatch(clearCart()),
        setIsCity: (item: TypeisCity) => dispatch(setIsCity(item)),
        fetchCartItems: () => dispatch(fetchCartItems())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileHeader)