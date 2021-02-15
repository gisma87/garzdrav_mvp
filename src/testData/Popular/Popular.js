import React from "react";
import PopularItem from "./PopularItem";
import SwiperCore, {Navigation, Pagination, Autoplay} from "swiper";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/autoplay'
// import 'swiper/swiper-bundle.css';
import './Popular.scss'

class Popular extends React.Component {

  render() {
    SwiperCore.use([Navigation, Pagination, Autoplay])

    return (
      <div className="Popular wrapper">

        <ul className="Popular__buttonCategories">
          <li><a href="#home">популярное</a></li>
          <li><a href="#menu1">категория 1</a></li>
          <li><a href="#menu2">категория 2</a></li>
        </ul>

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
            [<PopularItem/>, <PopularItem/>, <PopularItem/>, <PopularItem/>, <PopularItem/>, <PopularItem/>,
              <PopularItem/>, <PopularItem/>].map((item, index) => {
              return (
                <SwiperSlide tag="li" key={index} style={{listStyleType: 'none'}}>
                  {item}
                </SwiperSlide>
              )
            })
          }

          <div className="Popular__knopi">
            <a href="#">посмотреть все популярные <i className="fas fa-arrow-right"/></a>
            <div className="Popular__btnslide">
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
}

export default Popular