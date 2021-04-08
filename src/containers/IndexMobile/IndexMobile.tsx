import React from 'react';
import Advertising from "../../components/Advertising";
import PromoBlockMobile from "../../components/PromoBlockMobile/PromoBlockMobile";
import ArticlesBlock from "../../components/ArticlesBlock";
import LegkoBlock from "../../components/LegkoBlock/LegkoBlock";
import HowToBuy from '../../components/HowToBuy/HowToBuy';
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";

const IndexMobile: React.FC = () => {

    return (
        <ErrorBoundary>
            <p className='test'>Тестирование</p>
            <Advertising/>
            <PromoBlockMobile sizeTitle='16px'/>
            <HowToBuy/>
            <LegkoBlock/>
            <ArticlesBlock/>
        </ErrorBoundary>
    )
}

export default IndexMobile