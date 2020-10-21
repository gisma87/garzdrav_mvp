import React from "react";
import './CartItem.scss'
import pillsIcon from "../../img/pills.svg";
import BlockWrapper from "../BlockWrapper";

const CartItem = (props) => {
  const {img, title, maker, minPrice} = props.item
  return (
    <BlockWrapper style={'CartItem ' + `${props.style}`}>
      <div className='CartItem__container'>
        <div className='CartItem__imageContainer'>
          {img !== undefined ? <img className='CartItem__image' src={img} alt=""/> :
            <img src={pillsIcon} alt="pills icon" className='CartItem__image'/>}
        </div>

        <div className='CartItem__descriptionContainer'>
          <h3>{title}</h3>
          <p className='CartItem__maker'>{maker}</p>
          <div className='CartItem__buttonToDescription'>
            <button>В избранное</button>
            <button>Удалить</button>
          </div>
        </div>

        <div className='CartItem__itemPrice'>
          <p className='CartItem__price'>от {minPrice} ₽</p>
          <div className='CartItem__countButtons'>
            <button className='CartItem__countButtonMinus CartItem__countButton'>-</button>
            <input className='CartItem__countInput' type="text" defaultValue='1'/>
            <button className='CartItem__countButtonPlus CartItem__countButton'>+</button>
          </div>
        </div>
      </div>
      <p className='CartItem__caption'>Внешний вид товара может отличаться от изображения на сайте</p>
    </BlockWrapper>
  )
}

export default CartItem