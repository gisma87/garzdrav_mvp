import React from "react";
import './ArticlesBlock.scss'
import SwiperCore, {Navigation, Pagination} from "swiper";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import ArticleCard from "../ArticleCard";
import SvgArrowLightRight from "../../img/SVGcomponents/SvgArrowLightRight";
import {useMediaQuery} from "react-responsive";
import {Link} from "react-router-dom";


const articleCardData = [
  {
    title: 'Вегетарианство: польза или вред?',
    description: 'Более миллиарда людей по всему миру выбирают для себя путь вегетарианства, и с каждым днём таких людей становится всё больше.',
    image: 'https://xn--n1aalg.xn--80ae2aeeogi5fxc.xn--p1ai/article/2efae72b6523169bca5c91d237363e3a.jpg'
  },
  {
    title: 'Как правильно ухаживать за кожей лица?',
    description: 'Пришло время позаботиться о коже!',
    image: 'https://xn--n1aalg.xn--80ae2aeeogi5fxc.xn--p1ai/article/b0855ca6f18d9187a5567aad203f4c45.jpg'
  },
  {
    title: 'Приятный запах в доме: 8 советов',
    description: 'Мы собрали для вас несколько советов, которые помогут вам устранить возможные источники неприятных запахов и добавить свежести в свой дом.',
    image: 'https://xn--n1aalg.xn--80ae2aeeogi5fxc.xn--p1ai/article/4554b91c015f4ee8c439ceee307e034f.jpg'
  },
  {
    title: 'Очки с поляризацией: кому и зачем нужны?',
    description: 'Чем поляризационные очки отличаются от других и действительно ли они необходимы?',
    image: 'https://xn--n1aalg.xn--80ae2aeeogi5fxc.xn--p1ai/article/84fa33cede7d34e0567978778f8aa0b6.jpg'
  }
]

const ArticlesBlock = props => {
  const isMobile = useMediaQuery({query: '(max-width: 650px)'})
  const isTablet = useMediaQuery({query: '(max-width: 800px)'})


  SwiperCore.use([Navigation, Pagination])

  return (
    <section className="ArticlesBlock">
      <div className={isMobile ? '' : 'wrapper'}>
        <div className="prev slideButton">
          <SvgArrowLightRight/>
        </div>

        <div className="next slideButton">
          <SvgArrowLightRight/>
        </div>

        <h3 className='ArticlesBlock__title'>Быть здоровым легко</h3>
        <div style={!isMobile ? {padding: '0 30px'} : {}}>
          <Swiper
            style={{padding: '10px 0'}}
            spaceBetween={5}
            slidesPerView={isMobile ? 1 : (isTablet ? 2 : 'auto')}
            tag="section" wrapperTag="ul"
            loop={'false'}
            navigation={
              {
                nextEl: '.next',
                prevEl: '.prev'
              }
            }
          >
            {
              articleCardData.map((card, index) => {
                return <ArticleCard key={index} item={card}/>
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
        {
          !isMobile &&
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: '0 0 15px'
          }}>
            <Link to='/articles/' className='ArticlesBlock__button'>
              все полезные советы
            </Link>
          </div>
        }
      </div>
    </section>

  )
}

export default ArticlesBlock