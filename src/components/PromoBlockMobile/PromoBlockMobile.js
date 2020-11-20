import React from "react";
import SwiperCore, {Navigation, Pagination, Autoplay} from "swiper";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/autoplay'
import TitleSection from "../UI/TitleSection";
import './PromoBlockMobile.scss'
import dataCatds from "../../testData/dataCards";
import {withRouter} from "react-router-dom";
import {compose} from "../../utils";
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {connect} from "react-redux";
import {addedToCart, allItemRemovedFromCart, itemRemovedFromCart} from "../../actions";
import CardItemMobile from "../CardItemMobile";

class PromoBlockMobile extends React.Component {

  componentDidUpdate(prevProps, prevState, snapshot) {
    localStorage.setItem('cart', JSON.stringify(this.props.cart))
  }

  onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) this.props.history.push(`Cards/${itemId}`);
  }

  render() {
    SwiperCore.use([Navigation, Pagination, Autoplay])
    return (
      <div className="PromoBlockMobile">

        <div>
          <TitleSection size={this.props.sizeTitle} title='Акции' link='/promotions/'/>
          <Swiper
            style={{padding: '5px 0 10px'}}
            spaceBetween={5}
            slidesPerView={'auto'}
            tag="section" wrapperTag="ul"
            loop={'false'}
          >
            {
              dataCatds.map((item) => {
                const {id, title, maker, img, minPrice} = item;
                const itemIndex = this.props.cart.findIndex((item) => item.itemId === id);
                const isActive = itemIndex >= 0;
                return <CardItemMobile onItemSelected={this.onItemSelected}
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
  return {
    cart
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item))
  }
}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(PromoBlockMobile))