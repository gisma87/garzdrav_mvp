import React, {useEffect, useState} from "react";
import SwiperCore, {Navigation, Pagination, Autoplay} from "swiper";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/autoplay'
import './PromoBlockMobile.scss'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addedToCart, allItemRemovedFromCart, itemRemovedFromCart} from "../../actions";
import CardItemMobile from "../CardItemMobile";
import {useMediaQuery} from "react-responsive";
import ButtonSectionForSlider from "../PromoBlock/ButtonSectionForSlider/ButtonSectionForSlider";
// import CardItem from "../CardItem";

const PromoBlockMobile = props => {

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(props.cart))
  })

  const [activeButton, setActiveButton] = useState(0)

  const onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) props.history.push(`Card/${itemId}`);
  }

  const isMobile = useMediaQuery({query: '(max-width: 650px)'})
  SwiperCore.use([Navigation, Pagination, Autoplay])

  const data = () => {
    const resultArr = [];
    [props.itemsForPromoBlock1, props.seasonItemsForPromoBlock2, props.popularItemsForPromoBlock3].forEach(arr => {
      if (arr.length) resultArr.push(arr);
    })
    if (resultArr.length) {
      return resultArr
    }
    return null
  }

  const onButtonSelected = (num) => {
    const arrData = data()
    if (arrData && (num < arrData.length && arrData[num]?.length > 0)) {
      setActiveButton(num)
    }
  }

  return (
    <section className="PromoBlockMobile">
      <div>
        {/*<TitleSection size={props.sizeTitle} title='Акции' link='/articles/'/>*/}

        <ButtonSectionForSlider
          items={[{title: 'Акции'}, {title: 'Сезонное предложение'}, {title: 'Популярные товары'}]}
          onButtonSelected={onButtonSelected}
        />

        {props.itemsForPromoBlock1 &&
        <Swiper
          style={{padding: '5px 0 10px'}}
          spaceBetween={5}
          slidesPerView={isMobile ? 1 : 2}
          tag="section" wrapperTag="ul"
          loop={'false'}
        >
          {data() &&
          data()?.[activeButton].map((item) => {
            const {guid, product, manufacturer, img, minPrice} = item;
            const itemIndex = props.cart.findIndex((item) => item.itemId === guid);
            const isActive = itemIndex >= 0;
            return <CardItemMobile key={guid}
                                   onItemSelected={onItemSelected}
                                   updateToCart={() => {
                                     !isActive ? props.addedToCart(guid) : props.itemRemovedFromCart(guid)
                                   }}
                                   active={isActive}
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

const mapStateToProps = ({cart, itemsForPromoBlock1, seasonItemsForPromoBlock2, popularItemsForPromoBlock3}) => {
  return {cart, itemsForPromoBlock1, seasonItemsForPromoBlock2, popularItemsForPromoBlock3}
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PromoBlockMobile))