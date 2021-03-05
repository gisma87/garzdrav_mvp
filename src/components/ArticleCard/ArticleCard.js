import React from "react";
import './ArticleCard.scss'
import calendarIcon from "../../img/calendar-alt-regular.svg";


const ArticleCard = (props) => {
  const {image, title, description, id, date} = props.item
  return (
    <div className='ArticleCard' onClick={(event) => props.onItemSelected(id, event)}>
      <img src={image} className="ArticleCard__image" alt={title}/>
      <div className="ArticleCard__content">
        <h3 className="ArticleCard__title">{title}</h3>

        <p className="ArticleCard__description">
          {description}
        </p>
      </div>
      <div className="ArticleCard__date">
        <img src={calendarIcon} alt="calendar icon"/>
        <span>{date}</span>
      </div>
    </div>
  )
}

export default ArticleCard