import React from 'react';
import './IndexMobile.scss'
import SearchPanel from "../../components/SearchPanel";
import Advertising from "../../components/Advertising";
import PromoBlockMobile from "../../components/PromoBlockMobile/PromoBlockMobile";
import ArticlesBlock from "../../components/ArticlesBlock";
import FooterDesktop from "../../components/FooterDesktop";
import Logo from "../../components/UI/Logo/Logo";
import Burger from "../../components/UI/Burger/Burger";
import {Link} from "react-router-dom";

const indexMobile = () => {
  return (
    <div className='indexMobile'>

      <div className='indexMobile__logoPanel'>
        <Logo/>
        <Link to={'/catalog'}>Каталог <Burger/></Link>
      </div>

      <section className='indexMobile__searchPanel'>
        <SearchPanel/>
      </section>
      <Advertising/>
      <PromoBlockMobile sizeTitle='16px'/>
      <ArticlesBlock sizeTitle='16px'/>
      <FooterDesktop/>
    </div>
  )
}

export default indexMobile