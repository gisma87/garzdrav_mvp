import React from "react";
import SwiperCore, {Navigation, Pagination, Autoplay} from "swiper";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/autoplay'
// import 'swiper/swiper-bundle.css';
import './PromoBlock.scss'
import CardItem from "../CardItem";
import dataCatds from "../../testData/dataCards";
import {NavLink} from "react-router-dom";

const PromoBlock = () => {

  const onItemSelected = (itemId, event) => {
    console.log('Нажали на: ', itemId, event.target)
  }

  SwiperCore.use([Navigation, Pagination, Autoplay])

  return (
    <div className="PromoBlock wrapper">
      <NavLink className='PromoBlock__title' to="/news/">
        Наши акции
        <i className="PromoBlock__more fas fa-angle-right"/>
      </NavLink>
      <Swiper
        style={{padding: '10px 0'}}
        spaceBetween={5}
        slidesPerView={'auto'}
        tag="section" wrapperTag="ul"
        loop={'false'}
        // autoplay={{delay: 5000}}
        navigation={
          {
            nextEl: '.nextcat',
            prevEl: '.prevcat'
          }
        }
      >
        {
          dataCatds.map(({id, title, maker, img, minPrice}) => {
            return <CardItem onItemSelected={onItemSelected}
                             key={id}
                             id={id}
                             title={title}
                             maker={maker}
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

        <div className="PromoBlock__knopi">
          <a href="#">посмотреть все популярные <i className="fas fa-arrow-right"/></a>
          <div className="PromoBlock__btnslide">
            <div className="prevcat">
              <i className="fas fa-chevron-left"/>
            </div>

            <div className="nextcat">
              <i className="fas fa-chevron-right"/>
            </div>
          </div>
        </div>
      </Swiper>
    </div>
  )
}

export default PromoBlock