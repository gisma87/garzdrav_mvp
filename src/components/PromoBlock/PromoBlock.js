import React from "react";
import SwiperCore, {Navigation, Pagination, Autoplay} from "swiper";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/autoplay'
import SvgAngleRightSolid from '../../img/SVGcomponents/SvgAngleRightSolid'
import SvgAngleLeftSolid from "../../img/SVGcomponents/SvgAngleLeftSolid";
import TitleSection from "../UI/TitleSection";
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
    <div className="PromoBlock">

      <div className="prev slideButton">
        <SvgAngleLeftSolid/>
      </div>

      <div className="next slideButton">
        <SvgAngleRightSolid/>
      </div>

      <div className='wrapper'>
        <TitleSection title='Акции' link='/promo/'/>
        <Swiper
          style={{padding: '10px 0'}}
          spaceBetween={5}
          slidesPerView={'auto'}
          tag="section" wrapperTag="ul"
          loop={'false'}
          // autoplay={{delay: 5000}}
          navigation={
            {
              nextEl: '.next',
              prevEl: '.prev'
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

        </Swiper>
      </div>
    </div>
  )
}

export default PromoBlock