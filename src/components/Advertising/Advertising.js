import React from "react"
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {Navigation, Pagination, Autoplay} from "swiper";
import 'swiper/swiper-bundle.css';
import './Advertising.scss'
import {useMediaQuery} from 'react-responsive'
import test1 from '../../img/slider/test1.jpg'
import test2 from '../../img/slider/test2.jpg'
import test3 from '../../img/slider/test3.jpg'
import test4 from '../../img/slider/test4.jpg'
import testPromo from '../../img/test/testPromojpg.jpg'

const imgData = [
  {src: test1, color: '#f1adba'},
  {src: test2, color: '#0068b9'},
  {src: test3, color: '#fbdad5'},
  {src: test4, color: '#a2ddfb'}
]

const Advertising = () => {
  const isMobile = useMediaQuery({query: '(max-width: 900px)'})
  SwiperCore.use([Navigation, Pagination, Autoplay])
  return (
    <section className={'Advertising' + (isMobile ? '' : ' wrapper')}>
      <div className='Advertising__slider'>
        <Swiper
          spaceBetween={isMobile ? 5 : 0}
          slidesPerView={1}
          tag="section" wrapperTag="ul"
          // navigation
          loop={true}
          pagination={!isMobile && {clickable: true}}
          autoplay={{delay: 5000}}
          style={{width: '100%'}}
        >
          {imgData.map((item, index) => {
            return (
              <SwiperSlide tag="li" key={index} style={{display: 'flex', justifyContent: 'center'}}>
                <img className='Advertising__slide' src={item.src} alt={index + ' slide'}/>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      {
        !isMobile &&
        <div className='Advertising__promo'>
          <img src={testPromo} alt="testPromo"/>
        </div>
      }
    </section>

  )
}

export default Advertising