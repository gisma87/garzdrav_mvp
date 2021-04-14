import React, {useEffect, useState} from "react"
import './HeaderFixed.scss'
import {NavLink, RouteComponentProps, withRouter} from "react-router-dom";
import iconCart from '../../img/icon/cartIconSmall.png'
import ButtonTopScroll from "../UI/ButtonTopScroll";
import {openPopupLogin, rewriteCart} from "../../actions";
import {connect} from "react-redux";
import Burger from "../UI/Burger/Burger";
import Catalog from "../Catalog/Catalog";
import Logo from "../UI/Logo/Logo";
import ButtonLogIn from "../UI/ButtonLogIn/ButtonLogIn";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import {CartItemType, CategoryElement} from "../../types";
import {StateType} from "../../store";
import {ThunkDispatch} from "redux-thunk";

type MapDispatchPropsType = {
  openPopupLogin(): void,
  rewriteCart(cart: CartItemType[]): void
}

type MapStatePropsType = {
  cart: CartItemType[],
  catalog: null | CategoryElement,
  TOKEN: null | { accessToken: string, refreshToken: string }
}

type Props = RouteComponentProps & MapStatePropsType & MapDispatchPropsType;

const HeaderFixed: React.FC<Props> = (props) => {
  const count = props.cart.reduce((sum, item) => {
    return item.count + sum
  }, 0)

  const [lastScrollY, setLastScrollY] = useState(0)
  const [burgerActive, setBurgerActive] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setLastScrollY(window.scrollY)
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  })

  useEffect(() => {
    if (burgerActive) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [burgerActive])

  return (
    <ErrorBoundary>
      <div className='HeaderFixed'>
        <div className='wrapper HeaderFixed__wrapper'>
          <div className='HeaderFixed__leftBlock'>
            <div className='HeaderFixed__catalog'>
              <Burger isActive={burgerActive} onClick={() => setBurgerActive(!burgerActive)}/>
              {props.catalog && <Catalog isActive={burgerActive}
                                         onClick={() => setBurgerActive(!burgerActive)}
                                         data={props.catalog.child}
              />}
            </div>
            <Logo/>
          </div>

          <p className='test'>Тестирование</p>

          <div className='HeaderFixed__rightblock'>

            <ButtonLogIn
              onClick={() => {
                if (props.TOKEN) {
                  props.history.push('/profile/')
                  window.scroll(0, 0)
                } else props.openPopupLogin()
              }}
            >{props.TOKEN ? 'личный кабинет' : 'войти'}
            </ButtonLogIn>

            <NavLink to="/cart/" className='HeaderFixed__cart'>
              <div className='HeaderFixed__cartImgBox'>
                <img src={iconCart} alt="корзина" className='HeaderFixed__cartImg'/>
              </div>
              <span className='HeaderFixed__cartCount'>{count}</span>
            </NavLink>
          </div>
        </div>
        {lastScrollY > 400 && <ButtonTopScroll/>}
      </div>
    </ErrorBoundary>
  )
}

const mapStateToProps = ({cart, TOKEN, catalog}: StateType) => {
  return {cart, TOKEN, catalog}
}

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, {}, any>) => {
  return {
    openPopupLogin: () => dispatch(openPopupLogin()),
    rewriteCart: (cart: CartItemType[]) => dispatch(rewriteCart(cart)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderFixed))

