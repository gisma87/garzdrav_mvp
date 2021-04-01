import React from 'react';
import Advertising from "../../components/Advertising";
import PromoBlockMobile from "../../components/PromoBlockMobile/PromoBlockMobile";
import ArticlesBlock from "../../components/ArticlesBlock";
import LegkoBlock from "../../components/LegkoBlock/LegkoBlock";

const IndexMobile: React.FC = () => {

    return (
        <>
            <p className='test'>Тестирование</p>
            <Advertising/>
            <PromoBlockMobile sizeTitle='16px'/>
            <LegkoBlock/>
            <ArticlesBlock/>
        </>
    )
}

export default IndexMobile