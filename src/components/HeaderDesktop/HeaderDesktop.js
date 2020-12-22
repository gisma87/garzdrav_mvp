import React from 'react';
import './HeaderDesktop.scss'
import HeaderTop from "../HeaderTop";
import HeaderFixed from "../HeaderFixed";
import HeaderSearch from "../HeaderSearch/HeaderSearch";

const HeaderDesktop = (props) => {
  return (
    <header className='HeaderDesktop'>
      <HeaderTop onScroll={props.onScroll}/>
      <HeaderFixed/>
      <HeaderSearch/>
    </header>
  )
}

export default HeaderDesktop