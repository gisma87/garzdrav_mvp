import React from "react"
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {Navigation, Pagination, Autoplay} from "swiper";
import 'swiper/swiper-bundle.css';
import './Advertising.scss'
import {useMediaQuery} from 'react-responsive'
import smallBaner from '../../img/baners/smallBaner.jpg'
import img1 from '../../img/forMainSlidr/gifts.jpg'
import img2 from '../../img/forMainSlidr/seasonalProducts.jpg'
import img3 from '../../img/forMainSlidr/may/май1.jpg'
import img4 from '../../img/forMainSlidr/may/май2.jpg'
import img5 from '../../img/forMainSlidr/may/май3.jpg'
import img6 from '../../img/forMainSlidr/may/май4.jpg'
import img7 from '../../img/forMainSlidr/may/май5.jpg'
import img8 from '../../img/forMainSlidr/may/май6.jpg'

import {useHistory} from "react-router-dom";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import {ThunkDispatch} from "redux-thunk";
import {StateType} from "../../store";
import {getProductsFromSearchLimit} from "../../actions";
import {connect} from "react-redux";


type MapDispatchPropsType = {
    getProductsFromSearchLimit(data: { productName: string }): void
}

const imgData = [
    {img: img1, link: '/articles/1'},
    {img: img2, link: '/articles/3'},
    {img: img3, link: '/articles/'},
    {img: img4, link: '/articles/'},
    {img: img5, link: '/articles/'},
    {img: img6, link: '/articles/'},
    {img: img7, link: '/articles/'},
    {img: img8, link: '/articles/'}
]

const smallBanerObj = {
    img: smallBaner,
    title: 'Листата'
}


const Advertising: React.FC<MapDispatchPropsType> = props => {
    let history = useHistory();

    function handleClick(path: string) {
        history.push(path);
    }

    // автопоиск по слову
    const goToCardsPage = (wordSearch: string) => {
        props.getProductsFromSearchLimit({productName: wordSearch})
        history.push('/Cards/')
    }

    const isMobile = useMediaQuery({query: '(max-width: 685px)'})
    SwiperCore.use([Navigation, Pagination, Autoplay])
    return (
        <ErrorBoundary>
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
                                    <img onClick={() => handleClick(item.link)} className='Advertising__slide'
                                         src={item.img}
                                         alt={index + ' slide'}/>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>

                {
                    !isMobile &&
                    <div className='Advertising__promo' onClick={() => goToCardsPage(smallBanerObj.title)}>
                      <img className='Advertising__promo-img' src={smallBanerObj.img} alt="promo"/>
                    </div>
                }
            </section>
        </ErrorBoundary>
    )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, {}, any>) => {
    return {
        getProductsFromSearchLimit: (data: { productName: string }) => dispatch(getProductsFromSearchLimit(data))
    }
}

export default connect(null, mapDispatchToProps)(Advertising)