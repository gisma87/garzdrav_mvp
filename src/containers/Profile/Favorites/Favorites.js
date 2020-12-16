import React from "react";
import './Favorites.scss'
import {useMediaQuery} from "react-responsive";
import BlockWrapper from "../../../components/BlockWrapper";
import FavoriteItem from "../../../components/FavoriteItem";
import dataCatds from "../../../testData/dataCards";
import CardItemMobile from "../../../components/CardItemMobile";
import devMessage from "../../../img/devtMessage.svg";

const Favorites = ({item}) => {
  const isMobile = useMediaQuery({query: '(max-width: 800px)'})
  const {addedToCart, itemRemovedFromCart, cart, history, favorites} = item;
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

          return <FavoriteItem key={item + Math.random()}
                               itemId={item}
                               item={{addedToCart, itemRemovedFromCart, cart, handlerToCards}}/>
        })
        }

        {isMobile && favorites.map((itemId) => {
          const itemIndex = cart.findIndex((item) => +item.itemId === +itemId);
          const isActive = itemIndex >= 0;
          const {img, title, maker, minPrice, id} = dataCatds[itemId - 1];
          return <CardItemMobile onItemSelected={handlerToCards}
                                 updateToCart={() => {
                                   !isActive ? addedToCart(id) : itemRemovedFromCart(id);
                                 }}
                                 active={isActive}
                                 key={itemId}
                                 id={itemId}
                                 title={title}
                                 maker={maker}
                                 img={img}
                                 minPrice={minPrice}
                                 favoriteButton={true}

          />
        })}

      </div>
      <img src={devMessage} alt="В разработке"/>
    </BlockWrapper>
  )
}

export default Favorites