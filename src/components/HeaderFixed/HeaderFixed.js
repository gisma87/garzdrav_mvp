import React, {useEffect, useState} from "react"
import './HeaderFixed.scss'
import {NavLink, withRouter} from "react-router-dom";
import SearchPanel from "../SearchPanel";
import iconCart from '../../img/cartmin.png'
import ButtonTopScroll from "../UI/ButtonTopScroll";
import {addedToCart, fetchCities} from "../../actions";
import {compose} from "../../utils";
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {connect} from "react-redux";

const HeaderFixed = (props) => {
  const count = props.cart.length;
  const [isLogin, setIsLogin] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0)


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
          <button className='HeaderFixed__logIn' onClick={() => localStorage.clear()}>Войти</button>
        </div>
      </div>
      {lastScrollY > 400 && <ButtonTopScroll/>}
    </div>
  )
}

const mapStateToProps = ({cart}) => {
  return {cart}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const {storeService} = ownProps;
  return {
    fetchCities: fetchCities(storeService, dispatch),
    addedToCart: (item) => dispatch(addedToCart(item))
  }
}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(HeaderFixed))

