import React, {useEffect, useState} from "react";
import './CartItem.scss'
import pillsIcon from "../../img/pills.svg";
import BlockWrapper from "../BlockWrapper";

const CartItem = (props) => {
  const {allItemRemovedFromCart, itemRemovedFromCart, addedToCart, addedToFavorits, isFavorite, count, classStyle = ''} = props;
  const {id, img, title, maker, minPrice} = props.item;


  const [like, setLike] = useState(false)

  // useEffect(() => updateCart())

  return (
    <BlockWrapper classStyle={'CartItem ' + `${classStyle}`}>
      <div className='CartItem__container'>
        <div className='CartItem__imageContainer'>
          {img !== undefined ? <img className='CartItem__image' src={img} alt=""/> :
            <img src={pillsIcon} alt="pills icon" className='CartItem__image'/>}
        </div>

        <div className='CartItem__descriptionContainer'>
          <h3>{title}</h3>
          <p className='CartItem__maker'>{maker}</p>
          <div className='CartItem__buttonToDescription'>
            <button
              onClick={() => {
                setLike(like => !like)
                addedToFavorits()
              }}
            >{isFavorite ? 'Удалить из избранного' : 'В избранное'}
            </button>
            <button onClick={allItemRemovedFromCart}>Удалить
            </button>
          </div>
        </div>

        <div className='CartItem__itemPrice'>
          <p className='CartItem__price'>{count * minPrice} ₽</p>
          <div className='CartItem__countButtons'>
            <button className='CartItem__countButtonMinus CartItem__countButton'
                    onClick={itemRemovedFromCart}
            >-
            </button>
            <input className='CartItem__countInput' type="text" value={count} readOnly/>
            <button className='CartItem__countButtonPlus CartItem__countButton'
                    onClick={addedToCart}
            >+
            </button>
          </div>
        </div>
      </div>
      <p className='CartItem__caption'>Внешний вид товара может отличаться от изображения на сайте</p>
    </BlockWrapper>
  )
}

export default CartItem