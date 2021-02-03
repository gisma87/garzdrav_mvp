import React from "react";
import './FavoriteItemMobile.scss'
import SvgPillsIcon from "../../img/SVGcomponents/SvgPillsIcon";
import SvgCheck from "../UI/icons/SvgCheck";

const FavoriteItemMobile = props => {
  const {addedToCart, itemRemovedFromCart, cart, handlerToCards, delFavorites} = props.functions;
  const {item} = props;
  const itemIndex = cart.findIndex((el) => el.itemId === item.guid);
  const isActive = itemIndex >= 0;
  return (
    <div className='FavoriteItemMobile'>

      <div className='FavoriteItemMobile__container-img-price'>
        <div className='FavoriteItemMobile__imgContainer' onClick={() => handlerToCards(item.guid)}>
          {
            item.img
              ? <img className='FavoriteItemMobile__image' src={item.img} alt="icon"/>
              : <SvgPillsIcon className='FavoriteItemMobile__notImage'/>
          }
        </div>
        <span className='FavoriteItemMobile__price'>от {props.minPrice} ₽</span>
      </div>
      <div className='FavoriteItemMobile__content'>
        <div className='FavoriteItemMobile__topBlock'>
          <p className='FavoriteItemMobile__titleBlock'>
            <span className='FavoriteItemMobile__title' onClick={() => handlerToCards(item.guid)}>{item.product}</span>

          </p>
          <p className='FavoriteItemMobile__maker'>{item.manufacturer}</p>
        </div>
        <div className='FavoriteItemMobile__buttonContainer'>
          <p className='FavoriteItemMobile__buttonDel' onClick={() => delFavorites(item.guid)}>Удалить из избранного</p>
          <button className='FavoriteItemMobile__buttonToCart' onClick={() => {
            !isActive ? addedToCart(item.guid) : itemRemovedFromCart(item.guid)
          }}>
            {isActive ? <SvgCheck style={{color: 'white'}}/> : 'Добавить в корзину'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default FavoriteItemMobile