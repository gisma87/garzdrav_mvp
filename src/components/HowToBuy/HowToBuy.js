import React from "react"
import classes from "./HowToBuy.module.css"
import imgPills from "../../img/pills.png"
import imgStack from "../../img/Stack.png"
import imgRoad from "../../img/road.png"
import imgMan from "../../img/man.png"
import SvgArrowRightSolid from "../../img/SVGcomponents/SvgArrowRightSolid";
import arrowRightIcon from "../../img/arrow-right-solid.svg"

class HowToBuy extends React.Component {
  render() {
    return (
      <div className={classes.howtobuy}>
        <div className='wrapper'>
          <h2>как купить нужные лекарства на сайте</h2>
          <div className={classes.blockbuy}>
            <div className={classes.item}>
              <div className={classes.icon}>
                <img src={imgPills}/>
              </div>
              <div className={classes.text}>
                выберите лекарство
              </div>
            </div>

            <img className={classes.arrowRight} src={arrowRightIcon} alt=""/>

            <div className={classes.item}>
              <div className={classes.icon}>
                <img src={imgStack}/>
              </div>
              <div className={classes.text}>
                добавьте в корзину
              </div>
            </div>

            <img className={classes.arrowRight} src={arrowRightIcon} alt=""/>

            <div className={classes.item}>
              <div className={classes.icon}>
                <img src={imgRoad}/>
              </div>
              <div className={classes.text}>
                выберите аптеку
              </div>
            </div>

            <img className={classes.arrowRight} src={arrowRightIcon} alt=""/>

            <div className={classes.item}>
              <div className={classes.icon}>
                <img src={imgMan}/>
              </div>
              <div className={classes.text}>
                получите лекарство
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HowToBuy