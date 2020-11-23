import React from "react";
import './FavoriteItem.scss'
import BlockWrapper from "../BlockWrapper";
import SvgCheck from "../UI/icons/SvgCheck";
import dataCatds from "../../testData/dataCards";

const FavoriteItem = (props) => {
  const {addedToCart, itemRemovedFromCart, cart, handlerToCards} = props.item;
  const {itemId} = props;
  const {img, title, maker, minPrice} = dataCatds[itemId - 1];
  const itemIndex = cart.findIndex((item) => item.itemId === itemId);
  const isActive = itemIndex >= 0;
  return (
    <BlockWrapper classStyle='FavoriteItem'>
      <img src={img} alt={title} onClick={() => handlerToCards(itemId)}/>
      <div className='FavoriteItem__content'>
        <p className='FavoriteItem__title'
           onClick={() => handlerToCards(itemId)}>
          {title}
          <span className='FavoriteItem__price'>от {minPrice} ₽</span>
        </p>
        <p className='FavoriteItem__maker'>{maker}</p>
        <div className='FavoriteItem__buttonContainer'>
          <p className='FavoriteItem__buttonDel'>Удалить из избранного</p>
          <button className='FavoriteItem__buttonToCart' onClick={() => {
            !isActive ? addedToCart(itemId) : itemRemovedFromCart(itemId)
          }}>
            {isActive ? <SvgCheck style={{color: 'white'}}/> : 'Добавить в корзину'}
          </button>
        </div>

      </div>
    </BlockWrapper>
  )
}

export default FavoriteItem