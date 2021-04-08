import React from "react"
import classes from './IndexDesktop.module.css'
import Advertising from "../../components/Advertising/Advertising";
import HowToBuy from "../../components/HowToBuy/HowToBuy";
import PromoBlock from "../../components/PromoBlock";
import ArticlesBlock from "../../components/ArticlesBlock";
import PromoBlock2 from "../../components/PromoBlock2/PromoBlock2";
import BrandsBlock from "../../components/BrandsBlock/BrandsBlock";
import LegkoBlock from "../../components/LegkoBlock/LegkoBlock";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";

const IndexDesktop = () => {
  return (
    <ErrorBoundary>
      <div className={classes.mainPage}>
        <Advertising/>
        <PromoBlock/>
        <HowToBuy/>
        <PromoBlock2/>
        <BrandsBlock/>
        <LegkoBlock/>
        <ArticlesBlock/>
      </div>
    </ErrorBoundary>
  )
}

export default IndexDesktop