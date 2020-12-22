import React, {useEffect, useState} from "react"
import './HeaderFixed.scss'
import {NavLink, withRouter} from "react-router-dom";
import SearchPanel from "../SearchPanel";
import iconCart from '../../img/icon/cartIconSmall.png'
import ButtonTopScroll from "../UI/ButtonTopScroll";
import {rewriteCart} from "../../actions";
import {connect} from "react-redux";
import PopupLogin from "../PopupLogin";
import Burger from "../UI/Burger/Burger";
import Catalog from "../Catalog/Catalog";
import Logo from "../UI/Logo/Logo";
import ButtonLogIn from "../UI/ButtonLogIn/ButtonLogIn";

const HeaderFixed = (props) => {
  const count = props.cart.reduce((sum, item) => {
    return item.count + sum
  }, 0)

  const [lastScrollY, setLastScrollY] = useState(0)
  const [popup, setPopup] = useState(false)
  const [burgerActive, setBurgerActive] = useState(false)
  // const isLogin = () => {
  //   console.log('JSON.parse(localStorage.getItem("TOKEN")', JSON.parse(localStorage.getItem("TOKEN")))
  //   return localStorage.getItem('isLogin') === 'true'
  // }

  useEffect(() => {
    const handleScroll = () => {
      setLastScrollY(window.scrollY)
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  })

  return (
    <>
      <div className={'HeaderFixed ' + (lastScrollY > 33 ? 'HeaderFixed--active' : '')}>
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

          {/*<SearchPanel/>*/}

          <div className='HeaderFixed__rightblock'>

            <ButtonLogIn
              onClick={() => {
                if (props.TOKEN) {
                  props.history.push('/profile/')
                  window.scroll(0, 0)
                } else setPopup(true)
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
        <PopupLogin active={popup}
                    onClick={() => setPopup(false)}
        />
      </div>
      <div style={{width: '100%', height: 64, display: lastScrollY > 33 ? 'flex' : 'none'}}> </div>
    </>
  )
}

const mapStateToProps = ({cart, TOKEN, catalog}) => {
  return {cart, TOKEN, catalog}
}

const mapDispatchToProps = (dispatch) => {
  return {
    rewriteCart: (item) => dispatch(rewriteCart(item)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderFixed))

