import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import './MobileBottomNavbar.scss'
import SvgIconCart from "../UI/icons/SvgIconCart";
import SvgIconHome from "../UI/icons/SvgIconHome";
import SvgIconLocation from "../UI/icons/SvgIconLocation";
import SvgIconSearch from "../UI/icons/SvgIconSearch";
import SvgIconUser from "../UI/icons/SvgIconUser";


const MobileBottomNavbar = () => {

  return (
    <div className="MobileBottomNavbar">
      <NavLink exact to='/' className="MobileBottomNavbar__btn" activeClassName="MobileBottomNavbar__btn-active">
        <SvgIconHome className='MobileBottomNavbar__icon'/>
      </NavLink>

      <NavLink to='/location' className="MobileBottomNavbar__btn" activeClassName="MobileBottomNavbar__btn-active">
        <SvgIconLocation className='MobileBottomNavbar__icon'/>
      </NavLink>

      <NavLink to='/searchMobile' className="MobileBottomNavbar__btn" activeClassName="MobileBottomNavbar__btn-active">
        <SvgIconSearch className='MobileBottomNavbar__icon'/>
      </NavLink>

      <NavLink to='/cart' className="MobileBottomNavbar__btn" activeClassName="MobileBottomNavbar__btn-active">
        <SvgIconCart className='MobileBottomNavbar__icon'/>
      </NavLink>

      <NavLink to='/profile' className="MobileBottomNavbar__btn" activeClassName="MobileBottomNavbar__btn-active">
        <SvgIconUser className='MobileBottomNavbar__icon'/>
      </NavLink>

    </div>
  )
}

export default MobileBottomNavbar