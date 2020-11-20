import React from "react";
import SwiperCore, {Navigation, Pagination, Autoplay} from "swiper";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/autoplay'
import SvgAngleRightSolid from '../../img/SVGcomponents/SvgAngleRightSolid'
import SvgAngleLeftSolid from "../../img/SVGcomponents/SvgAngleLeftSolid";
import TitleSection from "../UI/TitleSection";
import './PromoBlock.scss'
import CardItem from "../CardItem";
import dataCatds from "../../testData/dataCards";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addedToCart, allItemRemovedFromCart, itemRemovedFromCart} from "../../actions";

class PromoBlock extends React.Component {

  componentDidUpdate(prevProps, prevState, snapshot) {
    localStorage.setItem('cart', JSON.stringify(this.props.cart));
  }

  onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) this.props.history.push(`Cards/${itemId}`);
  }


  render() {
    SwiperCore.use([Navigation, Pagination, Autoplay])
    return (
      <div className="PromoBlock">

        <div className="prev slideButton">
          <SvgAngleLeftSolid/>
        </div>

        <div className="next slideButton">
          <SvgAngleRightSolid/>
        </div>

        <div className='wrapper'>
          <TitleSection title='Акции' link='/promotions/'/>
          <Swiper
            style={{padding: '10px 0'}}
            spaceBetween={5}
            slidesPerView={'auto'}
            tag="section" wrapperTag="ul"
            loop={'false'}
            // autoplay={{delay: 5000}}
            navigation={
              {
                nextEl: '.next',
                prevEl: '.prev'
              }
            }
          >
            {
              dataCatds.map((item) => {
                const {id, title, maker, img, minPrice} = item;
                const itemIndex = this.props.cart.findIndex((item) => item.itemId === id);
                const isActive = itemIndex >= 0;
                return <CardItem onItemSelected={this.onItemSelected}
                                 updateToCart={() => {
                                   !isActive ? this.props.addedToCart(id) : this.props.itemRemovedFromCart(id)
                                 }}
                                 active={isActive}
                                 key={id}
                                 id={id}
                                 title={title}
                                 maker={maker}
                                 img={img}
                                 minPrice={minPrice}/>
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
      </div>
    )
  }
}

const mapStateToProps = ({cart}) => {
  return {cart}
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PromoBlock))