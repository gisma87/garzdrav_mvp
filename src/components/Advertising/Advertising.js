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

// const ImageBlock = ({image, color}) => {
//   return (
//     <div className='Advertising__box' style={{backgroundColor: color}}>
//       <img className='Advertising' src={image} alt={'slide ' + Math.random()}/>
//     </div>
//   )
// }

const imgData = [
  {src: test1, color: '#f1adba'},
  {src: test2, color: '#0068b9'},
  {src: test3, color: '#fbdad5'},
  {src: test4, color: '#a2ddfb'}
]

const Advertising = () => {
  const isMobile = useMediaQuery({query: '(max-width: 800px)'})
  SwiperCore.use([Navigation, Pagination, Autoplay])
  return (
    <Swiper
      spaceBetween={0}
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
            {/*<ImageBlock image={item.src} color={item.color}/>*/}
            <img className='Advertising' src={item.src} alt={index + ' slide'}/>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}

export default Advertising