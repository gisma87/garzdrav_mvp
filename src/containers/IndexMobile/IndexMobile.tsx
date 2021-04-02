import React from 'react';
import Advertising from "../../components/Advertising";
import PromoBlockMobile from "../../components/PromoBlockMobile/PromoBlockMobile";
import ArticlesBlock from "../../components/ArticlesBlock";
import LegkoBlock from "../../components/LegkoBlock/LegkoBlock";
import HowToBuy from '../../components/HowToBuy/HowToBuy';

const IndexMobile: React.FC = () => {

    return (
        <>
            <p className='test'>Тестирование</p>
            <Advertising/>
            <PromoBlockMobile sizeTitle='16px'/>
            <HowToBuy/>
            <LegkoBlock/>
            <ArticlesBlock/>
        </>
    )
}

export default IndexMobile