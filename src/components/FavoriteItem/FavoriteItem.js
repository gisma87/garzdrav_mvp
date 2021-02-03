import React from "react";
import './FavoriteItem.scss'
import BlockWrapper from "../BlockWrapper";
import SvgCheck from "../UI/icons/SvgCheck";
import SvgPillsIcon from "../../img/SVGcomponents/SvgPillsIcon";

const FavoriteItem = (props) => {
  const {addedToCart, itemRemovedFromCart, cart, handlerToCards, delFavorites} = props.functions;
  const {item} = props;
  const itemIndex = cart.findIndex((el) => el.itemId === item.guid);
  const isActive = itemIndex >= 0;
  return (
    <BlockWrapper classStyle='FavoriteItem'>
      <div className='FavoriteItem__imgContainer' onClick={() => handlerToCards(item.guid)}>
        {
          item.img
            ? <img className='CardItem__image' src={item.img} alt="icon"/>
            : <SvgPillsIcon className='CardItem__notImage'/>
        }
      </div>
      <div className='FavoriteItem__content'>
        <div className='FavoriteItem__topBlock'>
          <p className='FavoriteItem__titleBlock'>
            <span className='FavoriteItem__title' onClick={() => handlerToCards(item.guid)}>{item.product}</span>
            <span className='FavoriteItem__price'>от {item.minPrice} ₽</span>
          </p>
          <p className='FavoriteItem__maker'>{item.manufacturer}</p>
        </div>
        <div className='FavoriteItem__buttonContainer'>
          <p className='FavoriteItem__buttonDel' onClick={() => delFavorites(item.guid)}>Удалить из избранного</p>
          <button className='FavoriteItem__buttonToCart' onClick={() => {
            !isActive ? addedToCart(item.guid) : itemRemovedFromCart(item.guid)
          }}>
            {isActive ? <SvgCheck style={{color: 'white'}}/> : 'Добавить в корзину'}
          </button>
        </div>

      </div>
    </BlockWrapper>
  )
}

export default FavoriteItem