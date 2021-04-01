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
import {onPopupLocation, openPopupLogin} from "../../actions";
import {connect} from "react-redux";
import {CartItemType, TypeisCity} from "../../types";
import SearchPanel from "../SearchPanel";

type MapStatePropsType = {
    isCity: TypeisCity,
    isPopupLocation: boolean,
    TOKEN: null | { accessToken: string, refreshToken: string },
    cart: CartItemType[]
}

type MapDispatchPropsType = {
    onPopupLocation(): void,
    openPopupLogin(): void
}

type Props = MapStatePropsType & MapDispatchPropsType

const MobileHeader: React.FC<Props> = props => {

    const [isShowBurgerMenu, setIsShowBurgerMenu] = useState(false)
    let history = useHistory();

    const count = props.cart.reduce((sum, item) => {
        return item.count + sum
    }, 0)

    return (
        <header className='MobileHeader'>
            {isShowBurgerMenu && <Backdrop onClick={() => setIsShowBurgerMenu(false)}/>}
            <DropDownMenu isActive={isShowBurgerMenu} data={[
                {title: props.isCity.title, path: '/cities/'},
                {title: 'Каталог', path: '/catalog/'},
                {title: 'Аптеки', path: '/cities/'},
                {title: 'Оформление заказа', path: '/how-to-buy/'},
                {title: 'Помощь', path: '/faq/'}
            ]}/>
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
    )
}

const mapStateToProps = ({isCity, isPopupLocation, TOKEN, cart}: StateType) => {
    return {isCity, isPopupLocation, TOKEN, cart}
}

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, {}, any>) => {
    return {
        onPopupLocation: () => dispatch(onPopupLocation(false)),
        openPopupLogin: () => dispatch(openPopupLogin())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileHeader)