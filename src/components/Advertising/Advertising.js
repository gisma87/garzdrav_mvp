import React from "react"
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {Navigation, Pagination, Autoplay} from "swiper";
import 'swiper/swiper-bundle.css';
import './Advertising.scss'
import test1 from '../../img/slider/test1.jpg'
import test2 from '../../img/slider/test2.jpg'
import test3 from '../../img/slider/test3.jpg'
import test4 from '../../img/slider/test4.jpg'

const Advertising = () => {
  SwiperCore.use([Navigation, Pagination, Autoplay])
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      tag="section" wrapperTag="ul"
      // navigation
      loop={true}
      pagination={{clickable: true}}
      autoplay={{delay: 5000}}
      style={{width: '100%'}}
    >
      {[test1, test2, test3, test4].map((item, index) => {
        return (
          <SwiperSlide tag="li" key={index} style={{display: 'flex', justifyContent: 'center'}}>
            <img className='Advertising' src={item} alt={index + ' slide'}/>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}

export default Advertising