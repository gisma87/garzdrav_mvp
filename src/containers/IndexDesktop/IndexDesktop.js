import React from "react"
import classes from './IndexDesktop.module.css'
import Advertising from "../../components/Advertising/Advertising";
import HowToBuy from "../../components/HowToBuy/HowToBuy";
import PromoBlock from "../../components/PromoBlock";
import ArticlesBlock from "../../components/ArticlesBlock";
import HowOrder from "../HowOrder";

class IndexDesktop extends React.Component {
  render() {
    return (
      <div className={classes.mainPage}>
        <Advertising/>
        <PromoBlock/>
        <HowToBuy/>
        <ArticlesBlock/>
      </div>
    )
  }
}

export default IndexDesktop