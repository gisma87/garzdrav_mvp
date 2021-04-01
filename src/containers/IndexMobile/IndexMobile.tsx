import React, {useState} from 'react';
import './IndexMobile.scss'
import SearchPanel from "../../components/SearchPanel";
import Advertising from "../../components/Advertising";
import PromoBlockMobile from "../../components/PromoBlockMobile/PromoBlockMobile";
import ArticlesBlock from "../../components/ArticlesBlock";
import FooterDesktop from "../../components/FooterDesktop";
import Logo from "../../components/UI/Logo/Logo";
import Burger from "../../components/UI/Burger/Burger";
import {NavLink, useHistory} from "react-router-dom";
import LegkoBlock from "../../components/LegkoBlock/LegkoBlock";
import PopupLocation from "../../components/PopupLocation/PopupLocation";
import {onPopupLocation, openPopupLogin} from "../../actions";
import {connect} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {StateType} from "../../store";
import {CartItemType, TypeisCity} from "../../types";
import ButtonLogIn from "../../components/UI/ButtonLogIn/ButtonLogIn";
import iconCart from "../../img/icon/cartIconSmall.png";

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

const IndexMobile: React.FC<Props> = (props) => {

    let history = useHistory();
    const [isShowBurgerMenu, setIsShowBurgerMenu] = useState(false)

    const count = props.cart.reduce((sum, item) => {
        return item.count + sum
    }, 0)

    return (
        <div className='indexMobile'>

            <div className='indexMobile__logoPanel'>
                <div className='indexMobile__LogoPanelLeftBlock'>
                    <Burger isActive={isShowBurgerMenu} onClick={() => setIsShowBurgerMenu((prev => !prev))}/>
                    <Logo/>
                </div>

                <div className='indexMobile__rightblock'>

                    <ButtonLogIn
                        onClick={() => {
                            if (props.TOKEN) {
                                history.push('/profile/')
                                window.scroll(0, 0)
                            } else props.openPopupLogin()
                        }}
                    />

                    <NavLink to="/cart/" className='indexMobile__cart'>
                        <div className='indexMobile__cartImgBox'>
                            <img src={iconCart} alt="корзина" className='indexMobile__cartImg'/>
                        </div>
                        <span className='indexMobile__cartCount'>{count}</span>
                    </NavLink>
                </div>

                {props.isPopupLocation && <PopupLocation active={props.isPopupLocation}
                                                         city={props.isCity.title}
                                                         openPopupCities={() => history.push('/cities/')}
                                                         closeThisPopup={props.onPopupLocation}
                />}
            </div>

            <section className='indexMobile__searchPanel'>
                <SearchPanel/>
            </section>
            {/*<p className='test'>Тестирование</p>*/}
            <Advertising/>
            <PromoBlockMobile sizeTitle='16px'/>
            <LegkoBlock/>
            <ArticlesBlock/>
            <FooterDesktop/>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(IndexMobile)