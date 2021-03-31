import React from "react"
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {Navigation, Pagination, Autoplay} from "swiper";
import 'swiper/swiper-bundle.css';
import './Advertising.scss'
import {useMediaQuery} from 'react-responsive'
import smallBaner from '../../img/baners/smallBaner.jpg'
import img1 from '../../img/forMainSlidr/gifts.jpg'
import img2 from '../../img/forMainSlidr/seasonalProducts.jpg'
import img3 from '../../img/forMainSlidr/april/april01.jpg'
import img4 from '../../img/forMainSlidr/april/april02.jpg'
import img5 from '../../img/forMainSlidr/april/april03.jpg'
import img6 from '../../img/forMainSlidr/april/april04.jpg'
import {useHistory} from "react-router-dom";


const imgData = [
  {img: img1, link: '/articles/1'},
  {img: img2, link: '/articles/3'},
  {img: img3, link: '/articles/'},
  {img: img4, link: '/articles/'},
  {img: img5, link: '/articles/'},
  {img: img6, link: '/articles/'}
]


const Advertising: React.FC = () => {
  let history = useHistory();

  function handleClick(path: string) {
    history.push(path);
  }

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
                <img onClick={() => handleClick(item.link)} className='Advertising__slide' src={item.img}
                     alt={index + ' slide'}/>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      {
        !isMobile &&
        <div className='Advertising__promo'>
          <img className='Advertising__promo-img' src={smallBaner} alt="promo"/>
        </div>
      }
    </section>

  )
}

export default Advertising