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
import {addedToCart, allItemRemovedFromCart, itemRemovedFromCart, setActivePromoGroup} from "../../actions";
import CardItemMobile from "../CardItemMobile";
import {useMediaQuery} from "react-responsive";
import ButtonSectionForSlider from "../PromoBlock/ButtonSectionForSlider/ButtonSectionForSlider";

const PromoBlockMobile = props => {

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(props.cart))
  })

  const [activeButton, setActiveButton] = useState(0)

  const onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) props.history.push(`Card/${itemId}`);
  }
  const arrNameGroup = ['Акционные товары', 'Сезонные товары', 'Популярные товары']
  const arrButtonPromoGroup = ['все акционные товары', 'все сезонные товары', 'все популярные товары']

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
            const {guid, product, manufacturer, img, minPrice, countLast} = item;
            const itemIndex = props.cart.findIndex((item) => item.itemId === guid);
            const isBuy = itemIndex >= 0;
            const count = isBuy ? props.cart[itemIndex].count : 0

            return <CardItemMobile key={guid}
                                   onItemSelected={onItemSelected}
                                   itemProps={{
                                     onIncrement: () => props.addedToCart(guid),
                                     onDecrement: () => props.itemRemovedFromCart(guid),
                                     isBuy,
                                     count,
                                     countLast,
                                     id: guid,
                                     title: product,
                                     maker: manufacturer,
                                     img,
                                     minPrice,
                                   }}
            />
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


      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '0 0 15px'
      }}>

        {
          <button onClick={() => {
            props.setActivePromoGroup({
              name: arrNameGroup[activeButton],
              arrPromo: data()?.[activeButton]
            })
            props.history.push('/articles/')
          }}
                  className='PromoBlockMobile__button'>{arrButtonPromoGroup[activeButton]}</button>
        }

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
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item)),
    setActivePromoGroup: (promo) => dispatch(setActivePromoGroup(promo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PromoBlockMobile))