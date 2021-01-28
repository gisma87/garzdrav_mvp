import React, {useEffect, useRef} from "react"
import classes from './IndexDesktop.module.css'
import Advertising from "../../components/Advertising/Advertising";
import HowToBuy from "../../components/HowToBuy/HowToBuy";
import PromoBlock from "../../components/PromoBlock";
import ArticlesBlock from "../../components/ArticlesBlock";
import PromoBlock2 from "../../components/PromoBlock2/PromoBlock2";
import BrandsBlock from "../../components/BrandsBlock/BrandsBlock";
import LegkoBlock from "../../components/LegkoBlock/LegkoBlock";

const IndexDesktop = props => {
  const howToBuyElement = useRef(null)
  useEffect(() => {
    if (props.tag) {
      window.scrollTo({
        top: howToBuyElement.current.offsetTop - 100,
        left: 0,
        behavior: 'smooth'
      })
      props.offScroll()
    }
  })
  return (
    <div className={classes.mainPage}>
      <Advertising/>
      <PromoBlock/>
      <div ref={howToBuyElement} style={{width: '100%'}}><HowToBuy/></div>
      <PromoBlock2/>
      <BrandsBlock/>
      <LegkoBlock/>
      <ArticlesBlock/>
    </div>
  )
}

export default IndexDesktop