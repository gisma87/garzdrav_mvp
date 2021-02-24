import React from "react"
import './Articles.scss'
// import ArticleCard from "../../components/ArticleCard";
// import data from "../../testData/articlesANDpromo";
import {useMediaQuery} from 'react-responsive'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import CardItemMobile from "../../components/CardItemMobile";
import CardItem from "../../components/CardItem";
import {
  addedToCart,
  allItemRemovedFromCart,
  getProductsFromSearchLimit,
  itemRemovedFromCart,
  offRequestFromSearchPanel
} from "../../actions";


const Articles = props => {
  const isMobile = useMediaQuery({query: '(max-width: 900px)'})
  // const onItemSelected = (itemId, event) => {
  //   props.history.push(`${itemId}`);
  // }

  const onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) props.history.push(`/Card/${itemId}`);
  }

  return (
    <div className='Articles wrapper'>
      <h1 className='Articles__title'>Акционные товары</h1>
      <div className='Articles__container'>
        {/*{*/}
        {/*  data.map((item, id) => {*/}
        {/*    return <ArticleCard key={id} item={item} onItemSelected={onItemSelected}/>*/}
        {/*  })*/}
        {/*}*/}
        {
          props.itemsForPromoBlock1 &&
          props.itemsForPromoBlock1.map(item => {
            const {guid, product, manufacturer, img = null, minPrice, countLast} = item;
            const itemIndex = props.cart.findIndex((item) => item.itemId === guid);
            const isBuy = itemIndex >= 0;
            const count = isBuy ? props.cart[itemIndex].count : 0
            return (
              isMobile
                ? <CardItemMobile onItemSelected={onItemSelected}
                                  updateToCart={() => {
                                    !isBuy ? props.addedToCart(guid) : props.itemRemovedFromCart(guid);
                                  }}
                                  active={isBuy}
                                  key={guid}
                                  id={guid}
                                  title={product}
                                  maker={manufacturer}
                                  img={img}
                                  minPrice={minPrice}/>
                : <CardItem onItemSelected={onItemSelected}
                            onIncrement={() => props.addedToCart(guid)}
                            onDecrement={() => props.itemRemovedFromCart(guid)}
                            isBuy={isBuy}
                            count={count}
                            countLast={countLast}
                            key={guid}
                            id={guid}
                            title={product}
                            maker={manufacturer}
                            img={img}
                            minPrice={minPrice}/>
            )
          })
        }

      </div>
    </div>
  )
}

const mapStateToProps = ({itemsForPromoBlock1, cart}) => {
  return {itemsForPromoBlock1, cart}
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item)),
    getProductsFromSearchLimit: (options) => dispatch(getProductsFromSearchLimit(options)),
    offRequestFromSearchPanel: () => dispatch(offRequestFromSearchPanel())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Articles))