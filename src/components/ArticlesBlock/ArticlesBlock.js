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
import {Link, withRouter} from "react-router-dom";
import img1 from '../../img/img_articles/Image_1.jpg'
import img2 from '../../img/img_articles/Image_2.jpg'
import img3 from '../../img/img_articles/Image_3.jpg'
import img4 from '../../img/img_articles/Image_4.jpg'


const articleCardData = [
  {
    id: 1,
    title: 'За подарками – в аптеку!',
    description: 'ТОП 10 полезных подарков на 8 марта для прекрасных дам. ',
    image: img1,
    date: '09 марта 2021'
  },
  {
    id: 2,
    title: 'Держим курс на весну!',
    description: 'Календарная весна уже наступила, а значит, совсем скоро природа начнет просыпаться от зимней спячки и придет долгожданное тепло. ',
    image: img2,
    date: '09 марта 2021'
  },
  {
    id: 3,
    title: 'Простуда: что делать и какие препараты добавить в аптечку?',
    description: 'Чаще всего простуда настигает нас в самый неподходящий момент. \n' +
      'Мы собрали для вас 5 простых шагов, что делать при первых симптомах простуды, а также список необходимых препаратов от простуды и гриппа.',
    image: img3,
    date: '09 марта 2021'
  },
  {
    id: 4,
    title: 'Получить выгоду – Легко!',
    description: 'И это не просто слоган!\n' +
      'Легко – это единая бонусная карта. \n' +
      'Отличительной особенностью данной карты является её универсальность',
    image: img4,
    date: '09 марта 2021'
  }
]

const ArticlesBlock = props => {
  const isMobile = useMediaQuery({query: '(max-width: 650px)'})
  const isTablet = useMediaQuery({query: '(max-width: 800px)'})

  const onItemSelected = (itemId, event) => {
    props.history.push(`/articles/${itemId}`);
  }


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
                return <ArticleCard key={index} item={card} onItemSelected={onItemSelected}/>
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

export default withRouter(ArticlesBlock)