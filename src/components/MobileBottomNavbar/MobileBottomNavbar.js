import React from "react";
import {NavLink, withRouter} from "react-router-dom";
import './MobileBottomNavbar.scss'
import SvgIconCart from "../UI/icons/SvgIconCart";
import SvgIconHome from "../UI/icons/SvgIconHome";
import SvgIconLocation from "../UI/icons/SvgIconLocation";
import SvgIconSearch from "../UI/icons/SvgIconSearch";
import SvgIconUser from "../UI/icons/SvgIconUser";
import {rewriteCart} from "../../actions";
import {compose} from "../../utils";
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {connect} from "react-redux";


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

      <NavLink to='/profile' className="MobileBottomNavbar__btn" activeClassName="MobileBottomNavbar__btn-active">
        <SvgIconUser className='MobileBottomNavbar__icon'/>
      </NavLink>

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
)(withRouter(MobileBottomNavbar))