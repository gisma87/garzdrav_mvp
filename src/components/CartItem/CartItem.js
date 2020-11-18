import React from "react";
import './CartItem.scss'
import BlockWrapper from "../BlockWrapper";
import notPhoto from "../../img/notPhoto.svg";

const CartItem = (props) => {
  const {allItemRemovedFromCart, itemRemovedFromCart, addedToCart, addedToFavorits, count, isFavorite, classStyle = ''} = props;
  const {id, img, title, maker, price, sum} = props.item;

  return (
    <BlockWrapper classStyle={'CartItem ' + `${classStyle}`}>
      <div className='CartItem__container'>
        <div className='CartItem__imageContainer'>
          {img
            ? <img className='CartItem__image' src={img} alt=""/>
            : <img src={notPhoto} alt="pills icon" className='CartItem__image'/>
          }
        </div>

        <div className='CartItem__descriptionContainer'>
          <h3>{title}</h3>
          <p className='CartItem__maker'>{maker}</p>
          <div className='CartItem__buttonToDescription'>
            <button
              onClick={() => {
                addedToFavorits()
              }}
            >{isFavorite ? 'Удалить из избранного' : 'В избранное'}
            </button>
            <button onClick={allItemRemovedFromCart}>Удалить
            </button>
          </div>
        </div>

        <div className='CartItem__itemPrice'>
          <p className='CartItem__price'>{sum} ₽</p>
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