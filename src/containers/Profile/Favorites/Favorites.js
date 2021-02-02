import React, {useEffect} from "react";
import './Favorites.scss'
import {useMediaQuery} from "react-responsive";
import BlockWrapper from "../../../components/BlockWrapper";
import FavoriteItem from "../../../components/FavoriteItem";
// import CardItemMobile from "../../../components/CardItemMobile";
import apiService from "../../../service/ApiService";

const Favorites = (props) => {
  const isMobile = useMediaQuery({query: '(max-width: 800px)'})
  const {addedToCart, itemRemovedFromCart, cart, history, favorites, delFavorites} = props.data;
  const handlerToCards = (itemId) => {
    history.push(`/Cards/${itemId}`)
    window.scroll(0, 0)
  }

  useEffect(() => {
    const arrFetchFromFavorites = favorites.map(item => {
      return apiService.getProductInfo(item.guid, props.isCity.guid)
    })
    props.loadingTrue('arrFetchFromFavorites')
    Promise.all([...arrFetchFromFavorites])
      .then(allResponses => {
        const responseArray = allResponses.filter(item => Boolean(item.length !== 0))
        props.setFavoritesProductInfo(responseArray)
      })
// eslint-disable-next-line
  }, [])

  return (
    <BlockWrapper classStyle='Favorites'>
      <h4>Избранное</h4>
      <div className='Favorites__container'>
        {!isMobile &&
        props.favoritesProductInfo.map((item) => {
          const minPrice = item?.retails.sort((a, b) => a.priceRetail > b.priceRetail ? 1 : -1)[0].priceRetail.toFixed(2)
          return <FavoriteItem key={item.guid + Math.random()}
                               item={item}
                               minPrice={minPrice}
                               functions={{addedToCart, itemRemovedFromCart, cart, handlerToCards, delFavorites}}/>
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