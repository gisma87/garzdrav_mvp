import React from "react";
import './PromoItem.scss'
import calendarIcon from "../../img/calendar-alt-regular.svg";
import BlockWrapper from "../BlockWrapper";

const PromoItem = (props) => {
  const {title, description, image, date} = props.item
  console.log(props.item)
  return (
    <BlockWrapper style='PromoItem__item'>
      <img src={image} alt={title} className='PromoItem__image'/>
      <div className="PromoItem__content">
        <h3 className="PromoItem__itle">{title}</h3>

        <p className="PromoItem__description">
          {description}
        </p>
      </div>
      <div className="PromoItem__date">
        <img src={calendarIcon} alt="calendar icon"/>
        <span>{date}</span>
      </div>
    </BlockWrapper>
  )
}

export default PromoItem