import React from "react"
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {Navigation, Pagination, Autoplay} from "swiper";
import 'swiper/swiper-bundle.css';
import './Advertising.scss'
import {useMediaQuery} from 'react-responsive'
import testPromo from '../../img/test/promoPingy1.jpg'
import img1 from '../../img/forMainSlidr/gifts.jpg'
import img2 from '../../img/forMainSlidr/reducePrice.jpg'
import img3 from '../../img/forMainSlidr/seasonalProducts.jpg'


const imgData = [img1, img2, img3]


const Advertising = () => {
  const isMobile = useMediaQuery({query: '(max-width: 685px)'})
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
                <img className='Advertising__slide' src={item} alt={index + ' slide'}/>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      {
        !isMobile &&
        <div className='Advertising__promo'>
          <img className='Advertising__promo-img' src={testPromo} alt="testPromo"/>
        </div>
      }
    </section>

  )
}

export default Advertising