import React from 'react';
import './HeaderDesktop.scss'
import HeaderTop from "../HeaderTop";
import HeaderFixed from "../HeaderFixed";

const HeaderDesktop = () => {
  return (
    <header className='HeaderDesktop'>
      <HeaderTop/>
      <HeaderFixed/>
    </header>
  )
}

export default HeaderDesktop