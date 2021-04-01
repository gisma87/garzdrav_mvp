import React from 'react';
import Advertising from "../../components/Advertising";
import PromoBlockMobile from "../../components/PromoBlockMobile/PromoBlockMobile";
import ArticlesBlock from "../../components/ArticlesBlock";
import FooterDesktop from "../../components/FooterDesktop";
import LegkoBlock from "../../components/LegkoBlock/LegkoBlock";
import MobileHeader from '../../components/MobileHeader/MobileHeader';

const IndexMobile: React.FC = () => {

    return (
        <>
            <MobileHeader/>
            <p className='test'>Тестирование</p>
            <Advertising/>
            <PromoBlockMobile sizeTitle='16px'/>
            <LegkoBlock/>
            <ArticlesBlock/>
            <FooterDesktop/>
        </>
    )
}

export default IndexMobile