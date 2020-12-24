import React from "react";
import './LegkoBlock.scss'
import imgLegko from '../../img/legkoCardSmall.png'

const LegkoBlock = () => {
  return (
    <div className='LegkoBlock'>
      <div className='LegkoBlock__wrapper wrapper'>
        <div className='LegkoBlock__imageContainer'>
          <img src={imgLegko} alt="Карта Легко" className='LegkoBlock__img'/>
        </div>
        <div className='LegkoBlock__rightBlock'>
          <div className='LegkoBlock__textBlock'>
            <p>Покупайте</p>
            <p>за полцены</p>
            <p>с <a href="http://kartalegko.ru/" target="_blank"
                    className='LegkoBlock__linkLegko'
            >картой Легко</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LegkoBlock