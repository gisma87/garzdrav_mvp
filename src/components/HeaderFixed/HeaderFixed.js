import React, {useEffect, useState} from "react"
import './HeaderFixed.scss'
import {NavLink, withRouter} from "react-router-dom";
import SearchPanel from "../SearchPanel";
import iconCart from '../../img/cartmin.png'
import ButtonTopScroll from "../UI/ButtonTopScroll";
import {rewriteCart} from "../../actions";
import {compose} from "../../utils";
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {connect} from "react-redux";
import PopupLogin from "../PopupLogin";

const HeaderFixed = (props) => {
  const count = props.cart.length;
  // const [isLogin, setIsLogin] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0)
  const [popup, setPopup] = useState(false)
  const isLogin = () => {
    return localStorage.getItem('isLogin') === 'true'
  }

  // useEffect(() => {
  //   props.storeService.setCartFromLocalStorage(rewriteCart)
  // }, [])

  useEffect(() => {
    const handleScroll = () => {
      setLastScrollY(window.scrollY)
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  })

  return (
    <div className={'HeaderFixed ' + (lastScrollY > 40 ? 'HeaderFixed--active' : '')}>
      <div className='wrapper HeaderFixed__wrapper'>
        <NavLink to="/" className='HeaderFixed__logo'/>

        <SearchPanel/>

        <div className='HeaderFixed__rightblock'>
          <NavLink to="/cart/" className='HeaderFixed__cart'>
            <img src={iconCart} alt="корзина"/>
            {count !== 0 ? <span className='HeaderFixed__cartCount'>{count}</span> :
              <span className='HeaderFixed__cartText'>Корзина</span>}
          </NavLink>
          <button className='HeaderFixed__logIn' onClick={() => {
            if (isLogin()) {
              props.history.push('/profile/')
              window.scroll(0, 0)
            } else setPopup(true)
          }}>{isLogin() ? 'Личный кабинет' : 'Войти'}
          </button>
        </div>
      </div>
      {lastScrollY > 400 && <ButtonTopScroll/>}
      <PopupLogin active={popup}
                  onClick={() => setPopup(false)}
                  // isLogin={() => setIsLogin(true)}
      />
    </div>
  )
}

const mapStateToProps = ({cart}) => {
  return {cart}
}

const mapDispatchToProps = (dispatch) => {
  return {
    rewriteCart: (item) => dispatch(rewriteCart(item))
  }
}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(HeaderFixed))

