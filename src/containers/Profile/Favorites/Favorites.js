import React from "react";
import './Favorites.scss'
import {useMediaQuery} from "react-responsive";
import BlockWrapper from "../../../components/BlockWrapper";
import FavoriteItem from "../../../components/FavoriteItem";
import FavoriteItemMobile from "../../../components/FavoriteItemMobile";

const Favorites = (props) => {
  const isMobile = useMediaQuery({query: '(max-width: 900px)'})
  const {addedToCart, itemRemovedFromCart, cart, history, favorites, delFavorites} = props.data;
  const handlerToCards = (itemId) => {
    history.push(`/Cards/${itemId}`)
    window.scroll(0, 0)
  }

  return (
    <BlockWrapper classStyle='Favorites'>
      <h4>Избранное</h4>
      <div className='Favorites__container'>
        {
          !isMobile &&
          favorites.map((item) => {
            return <FavoriteItem key={item.guid + Math.random()}
                                 item={item}
                                 functions={{addedToCart, itemRemovedFromCart, cart, handlerToCards, delFavorites}}/>
          })
        }

        {
          isMobile &&
          favorites.map((item) => {
            return <FavoriteItemMobile key={item.guid + Math.random()}
                                       item={item}
                                       functions={{
                                         addedToCart,
                                         itemRemovedFromCart,
                                         cart,
                                         handlerToCards,
                                         delFavorites
                                       }}/>
          })
        }
      </div>
    </BlockWrapper>
  )
}

export default Favorites