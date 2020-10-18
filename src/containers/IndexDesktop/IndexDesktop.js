import React from "react"
import classes from './IndexDesktop.module.css'
import Advertising from "../../components/Advertising/Advertising";
import Popular from "../../components/Popular/Popular";
import HowToBuy from "../../components/HowToBuy/HowToBuy";
import BlockNews from "../../components/BlockNews/BlockNews";
import PromoBlock from "../../components/PromoBlock";

class IndexDesktop extends React.Component {
  render() {
    return (
      <div className={classes.mainPage}>
        <Advertising/>
        {/*<Popular/>*/}
        <PromoBlock/>
        <HowToBuy/>
        <BlockNews/>
      </div>
    )
  }
}

export default IndexDesktop