import React from 'react';
import './HeaderDesktop.scss'
import HeaderTop from "../HeaderTop";
import HeaderFixed from "../HeaderFixed";

const HeaderDesktop = (props) => {
  return (
    <header className='HeaderDesktop'>
      <HeaderTop onScroll={props.onScroll}/>
      <HeaderFixed/>
    </header>
  )
}

export default HeaderDesktop