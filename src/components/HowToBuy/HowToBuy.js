import React from "react"
import './HowToBuy.scss'
import {Link} from "react-router-dom";
import SvgArrowLightRight from "../../img/SVGcomponents/SvgArrowLightRight";

const HowToBuy = () => {
  return (
    <div className='HowToBuy'>
      <div className='HowToBuy__wrapper'>
        <div className='HowToBuy__item'>
          <p className='HowToBuy__number'>1</p>
          <div className='HowToBuy__text'>
            <p>Выберите</p>
            <p>товар в поиске</p>
            <p>или <Link className='HowToBuy__link' to='/'>каталоге</Link></p>
          </div>
        </div>
        <SvgArrowLightRight  className='HowToBuy__arrow'/>
        <div className='HowToBuy__item'>
          <p className='HowToBuy__number'>2</p>
          <div className='HowToBuy__text'>
            <p>Оформите</p>
            <p>заказ в</p>
            <p><Link className='HowToBuy__link' to='/'>удобную аптеку</Link></p>
          </div>
        </div>
        <SvgArrowLightRight  className='HowToBuy__arrow'/>
        <div className='HowToBuy__item'>
          <p className='HowToBuy__number'>3</p>
          <div className='HowToBuy__text'>
            <p>Заберите</p>
            <p>ваш заказ</p>
            <p>через 30 минут</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowToBuy