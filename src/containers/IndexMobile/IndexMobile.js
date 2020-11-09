import React from 'react';
import './IndexMobile.scss'
import SearchPanel from "../../components/SearchPanel";
import Advertising from "../../components/Advertising";
import logo from '../../img/evalar.png'
import PromoBlockMobile from "../../components/PromoBlockMobile/PromoBlockMobile";
import ArticlesBlock from "../../components/ArticlesBlock";
import FooterDesktop from "../../components/FooterDesktop";


const indexMobile = () => {
  return (
    <div className='indexMobile'>
      <div className='indexMobile__logoPanel'>
        <img src={logo} className='indexMobile__logo' alt='logo'/>
        <p>Плашка под красивое Лого</p>
      </div>
      <div className='indexMobile__searchPanel'>
        <SearchPanel/>
      </div>
      <Advertising/>
      <PromoBlockMobile sizeTitle='16px'/>
      <ArticlesBlock sizeTitle='16px'/>
      <FooterDesktop/>
    </div>
  )
}

export default indexMobile