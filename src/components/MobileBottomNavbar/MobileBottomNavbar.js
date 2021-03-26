import React from "react";
import {NavLink, withRouter} from "react-router-dom";
import './MobileBottomNavbar.scss'
import SvgIconCart from "../UI/icons/SvgIconCart";
import SvgIconHome from "../UI/icons/SvgIconHome";
import SvgIconLocation from "../UI/icons/SvgIconLocation";
import SvgIconSearch from "../UI/icons/SvgIconSearch";
import SvgIconUser from "../UI/icons/SvgIconUser";
import {openPopupLogin, rewriteCart} from "../../actions";
import {connect} from "react-redux";
import PopupLogin from "../PopupLogin";

const MobileBottomNavbar = (props) => {

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

      <button className={'MobileBottomNavbar__btn' + (props.TOKEN ? ' MobileBottomNavbar__btn-active' : '')}
              onClick={() => {
                if (props.TOKEN) {
                  props.history.push('/profile/')
                  window.scroll(0, 0)
                } else props.openPopupLogin()
              }}><SvgIconUser className='MobileBottomNavbar__icon MobileBottomNavbar__iconProfile'/></button>

      <PopupLogin />

    </div>
  )
}

const mapStateToProps = ({cart, TOKEN}) => {
  return {cart, TOKEN}
}

const mapDispatchToProps = (dispatch) => {
  return {
    openPopupLogin: () => dispatch(openPopupLogin()),
    rewriteCart: (item) => dispatch(rewriteCart(item))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MobileBottomNavbar))