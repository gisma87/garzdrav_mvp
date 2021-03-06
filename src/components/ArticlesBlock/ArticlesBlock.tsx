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
import {NavLink, Link, RouteComponentProps, withRouter} from "react-router-dom";
import {articleCardData} from "../../data/articlesCardData";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

type Props = {} & RouteComponentProps

const ArticlesBlock: React.FC<Props> = props => {
    const isMobile = useMediaQuery({query: '(max-width: 650px)'})
    const isTablet = useMediaQuery({query: '(max-width: 800px)'})

    const onItemSelected = (itemId: string | number, event: React.MouseEvent) => {
        props.history.push(`/articles/${itemId}`);
    }


    SwiperCore.use([Navigation, Pagination])

    return (
        <ErrorBoundary>
            <section className="ArticlesBlock">
                <div className={isMobile ? '' : 'wrapper'}>
                    <div className="prev slideButton">
                        <SvgArrowLightRight/>
                    </div>

                    <div className="next slideButton">
                        <SvgArrowLightRight/>
                    </div>

                    <div className='ArticlesBlock__titleBlock'>
                        <h3 className='ArticlesBlock__title'>Быть здоровым легко</h3>
                        <NavLink to='/promotions/' className='ArticlesBlock__title ArticlesBlock__linkAll'>все
                            статьи</NavLink>
                    </div>
                    <div style={!isMobile ? {padding: '0 30px'} : {}}>
                        <Swiper
                            style={{padding: '10px 0'}}
                            spaceBetween={5}
                            slidesPerView={isMobile ? 1 : (isTablet ? 2 : 'auto')}
                            tag="section" wrapperTag="ul"
                            loop={true}
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
                          <Link to='/promotions/' className='ArticlesBlock__button'>
                            все полезные советы
                          </Link>
                        </div>
                    }
                </div>
            </section>
        </ErrorBoundary>
    )
}

export default withRouter(ArticlesBlock)