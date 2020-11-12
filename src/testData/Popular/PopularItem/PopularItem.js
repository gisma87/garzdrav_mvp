import React from "react";
import classes from './PopularItem.module.css'
import img from '../../../img/tov.jpg'

class PopularItem extends React.Component {
  render() {
    return (
      <div className={classes.item}>
        <div className={classes.img}>
          <a href="#"> <img src={img} alt=""/> </a>
        </div>

        <div className={classes.content}>
          <div className={classes.text}>
            <a href="#">Librederm Hyaluronic крем для тела увлажняющий 200 мл легкий</a>
          </div>
          <div className={classes.btnblock}>
            <div className={classes.price}>от <span>459 ₽</span></div>
            <a href="#">купить</a>
          </div>
        </div>
      </div>
    )
  }
}

export default PopularItem