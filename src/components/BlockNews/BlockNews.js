import React from "react"
import SwiperCore, {Navigation} from "swiper";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import imgNews from "./../../img/news.jpg"
import './BlockNews.scss'

class BlockNews extends React.Component {

  item = <div className='BlockNews__item'>
    <a href="/" className='BlockNews__image'><img src={imgNews}/></a>
    <div className='BlockNews__text'>
      <h3>
        <a href="#">
          В Железногорске открывается новая аптека «Гармония здоровья»
        </a>
      </h3>
      <div className='BlockNews__date'>27 декабря 2018</div>
    </div>
  </div>

  render() {
    SwiperCore.use([Navigation])
    return (
      <div className='BlockNews'>
        <div className='wrapper'>

          <div className='BlockNews__newsBlock'>
            <h2><a href="#">новости</a></h2>
            <Swiper
              style={{padding: '10px 0'}}
              spaceBetween={10}
              slidesPerView={'auto'}
              loop={'false'}
              tag="section" wrapperTag="ul"
              navigation={
                {
                  nextEl: '.nextcat',
                  prevEl: '.prevcat'
                }
              }
              // breakpoints={{
              //   771: {
              //     slidesPerView: 2,
              //     spaceBetween: 20
              //   },
              //   940: {
              //     slidesPerView: 3,
              //     spaceBetween: 20
              //   },
              //   1200: {
              //     slidesPerView: 4,
              //     spaceBetween: 20
              //   },
              //   1431: {
              //     slidesPerView: 2,
              //     spaceBetween: 20
              //   }
              // }
              // }
            >
              {
                [this.item, this.item, this.item, this.item].map((item, index) => {
                  return (
                    <SwiperSlide tag="li" key={index} style={{listStyleType: 'none'}}>
                      {item}
                    </SwiperSlide>
                  )
                })
              }

              <div className="BlockNews__knopi">
                <a href="#">Подробнее <i className="fas fa-arrow-right"/></a>
                <div className="BlockNews__btnslide">
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
          <div className='BlockNews__newsBlock'>
            <h2><a href="#">статьи</a></h2>
            <Swiper
              style={{padding: '10px 0'}}
              spaceBetween={5}
              slidesPerView={'auto'}
              loop={'false'}
              tag="section" wrapperTag="ul"
              navigation={
                {
                  nextEl: '.nextcat',
                  prevEl: '.prevcat'
                }
              }
              // breakpoints={{
              //   771: {
              //     slidesPerView: 2,
              //     spaceBetween: 20
              //   },
              //   940: {
              //     slidesPerView: 3,
              //     spaceBetween: 20
              //   },
              //   1200: {
              //     slidesPerView: 4,
              //     spaceBetween: 20
              //   },
              //   1431: {
              //     slidesPerView: 2,
              //     spaceBetween: 20
              //   }
              // }
              // }
            >
              {
                [this.item, this.item, this.item, this.item].map((item, index) => {
                  return (
                    <SwiperSlide tag="li" key={index} style={{listStyleType: 'none'}}>
                      {item}
                    </SwiperSlide>
                  )
                })
              }

              <div className="BlockNews__knopi">
                <a href="#">Подробнее <i className="fas fa-arrow-right"/></a>
                <div className="BlockNews__btnslide">
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
        </div>
      </div>
    )
  }
}

export default BlockNews