import React, {useEffect} from "react";
import SwiperCore, {Navigation, Pagination, Autoplay} from "swiper";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/autoplay'
import TitleSection from "../UI/TitleSection";
import './PromoBlockMobile.scss'
// import {dataCards0} from "../../testData/dataCards";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addedToCart, allItemRemovedFromCart, itemRemovedFromCart} from "../../actions";
import CardItemMobile from "../CardItemMobile";
import {useMediaQuery} from "react-responsive";
// import CardItem from "../CardItem";

const PromoBlockMobile = props => {

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(props.cart))
  })

  const onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) props.history.push(`Card/${itemId}`);
  }

  const isMobile = useMediaQuery({query: '(max-width: 650px)'})
  SwiperCore.use([Navigation, Pagination, Autoplay])

  return (
    <section className="PromoBlockMobile">
      <div>
        <TitleSection size={props.sizeTitle} title='Акции' link='/articles/'/>
        {props.itemsForPromoBlock1 &&
        <Swiper
          style={{padding: '5px 0 10px'}}
          spaceBetween={5}
          slidesPerView={isMobile ? 1 : 2}
          tag="section" wrapperTag="ul"
          loop={'false'}
        >
          {
            props.itemsForPromoBlock1.map((item) => {
              const {guid, product, manufacturer, img, minPrice} = item;
              const itemIndex = props.cart.findIndex((item) => item.itemId === guid);
              const isActive = itemIndex >= 0;
              return <CardItemMobile onItemSelected={onItemSelected}
                                     updateToCart={() => {
                                       !isActive ? props.addedToCart(guid) : props.itemRemovedFromCart(guid)
                                     }}
                                     active={isActive}
                                     key={guid}
                                     id={guid}
                                     title={product}
                                     maker={manufacturer}
                                     img={img}
                                     minPrice={minPrice}/>
            }).map((item, index) => {
              return (
                <SwiperSlide tag="li" key={index} style={{listStyleType: 'none'}}>
                  {item}
                </SwiperSlide>
              )
            })
          }

        </Swiper>}
      </div>
    </section>
  )
}

const mapStateToProps = ({cart, itemsForPromoBlock1}) => {
  return {cart, itemsForPromoBlock1}
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PromoBlockMobile))