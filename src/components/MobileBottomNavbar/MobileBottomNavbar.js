import React, {useState} from "react";
import {NavLink, withRouter} from "react-router-dom";
import './MobileBottomNavbar.scss'
import SvgIconCart from "../UI/icons/SvgIconCart";
import SvgIconHome from "../UI/icons/SvgIconHome";
import SvgIconLocation from "../UI/icons/SvgIconLocation";
import SvgIconSearch from "../UI/icons/SvgIconSearch";
import SvgIconUser from "../UI/icons/SvgIconUser";
import {rewriteCart} from "../../actions";
import {connect} from "react-redux";
import PopupLogin from "../PopupLogin";

const MobileBottomNavbar = (props) => {

  const [popup, setPopup] = useState(false)

  const isLogin = () => {
    return localStorage.getItem('isLogin') === 'true'
  }

  const count = props.cart.reduce((sum, item) => {
    return item.count + sum
  }, 0)

  return (
    <div className="MobileBottomNavbar">
      <NavLink exact to='/' className="MobileBottomNavbar__btn" activeClassName="MobileBottomNavbar__btn-active">
        <SvgIconHome className='MobileBottomNavbar__icon'/>
      </NavLink>

      <NavLink to='/cities/' className="MobileBottomNavbar__btn" activeClassName="MobileBottomNavbar__btn-active">
        <SvgIconLocation className='MobileBottomNavbar__icon'/>
      </NavLink>

      <NavLink to='/Cards/' className="MobileBottomNavbar__btn" activeClassName="MobileBottomNavbar__btn-active">
        <SvgIconSearch className='MobileBottomNavbar__icon'/>
      </NavLink>

      <NavLink to='/cart' className="MobileBottomNavbar__btn" activeClassName="MobileBottomNavbar__btn-active">
        {count > 0 && <p className='MobileBottomNavbar__cartCount'>{count}</p>}
        <SvgIconCart className='MobileBottomNavbar__icon'/>
      </NavLink>

      <button className={'MobileBottomNavbar__btn' + (isLogin() ? ' MobileBottomNavbar__btn-active' : '')}
              onClick={() => {
                if (isLogin()) {
                  props.history.push('/profile/')
                  window.scroll(0, 0)
                } else setPopup(true)
              }}><SvgIconUser className='MobileBottomNavbar__icon MobileBottomNavbar__iconProfile'/></button>

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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MobileBottomNavbar))