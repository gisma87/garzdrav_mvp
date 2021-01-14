import React from "react";
import './Favorites.scss'
import {useMediaQuery} from "react-responsive";
import BlockWrapper from "../../../components/BlockWrapper";
import FavoriteItem from "../../../components/FavoriteItem";
import CardItemMobile from "../../../components/CardItemMobile";

const Favorites = ({data}) => {
  const isMobile = useMediaQuery({query: '(max-width: 800px)'})
  const {addedToCart, itemRemovedFromCart, cart, history, favorites, delToFavorites} = data;
  const handlerToCards = (itemId) => {
    history.push(`/Cards/${itemId}`)
    window.scroll(0, 0)
  }
  return (
    <BlockWrapper classStyle='Favorites'>
      <h4>Избранное</h4>
      <div className='Favorites__container'>
        {!isMobile &&
        favorites.map((item) => {

          return <FavoriteItem key={item.guid + Math.random()}
                               item={item}
                               functions={{addedToCart, itemRemovedFromCart, cart, handlerToCards, delToFavorites}}/>
        })
        }

        {/*{isMobile && favorites.map((item) => {*/}
        {/*  const itemIndex = cart.findIndex((item) => +item.itemId === +itemId);*/}
        {/*  const isActive = itemIndex >= 0;*/}
        {/*  const {img, title, maker, minPrice, id} = item;*/}
        {/*  return <CardItemMobile onItemSelected={handlerToCards}*/}
        {/*                         updateToCart={() => {*/}
        {/*                           !isActive ? addedToCart(id) : itemRemovedFromCart(id);*/}
        {/*                         }}*/}
        {/*                         active={isActive}*/}
        {/*                         key={item.guid}*/}
        {/*                         id={item.guid}*/}
        {/*                         title={title}*/}
        {/*                         maker={maker}*/}
        {/*                         img={img}*/}
        {/*                         minPrice={minPrice}*/}
        {/*                         favoriteButton={true}*/}

        {/*  />*/}
        {/*})}*/}
      </div>
    </BlockWrapper>
  )
}

export default Favorites