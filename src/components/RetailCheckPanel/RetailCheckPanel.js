import React from "react";
import './RetailCheckPanel.scss'
import SvgCheck from "../UI/icons/SvgCheck";
import BlockWrapper from "../BlockWrapper";

const RetailCheckPanel = () => {
  return (
    <BlockWrapper style='RetailCheckPanel'>
      <div className='RetailCheckPanel__checkbox RetailCheckPanel__block'><SvgCheck style={{color: 'green'}}/></div>
      <div className='RetailCheckPanel__content RetailCheckPanel__block'>
        <p className='RetailCheckPanel__name'>Адрес: г. Красноярск, ул. Дмитрия Мартынова, 24</p>
        <p className='RetailCheckPanel__openHours'>Часы работы: 8:00 - 22:00</p>
        <p className='RetailCheckPanel__tel'>Контактный телефон: (391) 218-18-90</p>
      </div>
      <div className='RetailCheckPanel__price'>
        <p>Сумма: 580 ₽</p>

        <div className='RetailCheckPanel__check'><SvgCheck style={{color: 'green'}}/></div>
      </div>
    </BlockWrapper>
  )
}

export default RetailCheckPanel