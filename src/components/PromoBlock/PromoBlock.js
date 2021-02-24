import React from "react";
import SwiperCore, {Navigation, Pagination, Autoplay} from "swiper";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/autoplay'
import SvgAngleRightSolid from '../../img/SVGcomponents/SvgAngleRightSolid'
import SvgAngleLeftSolid from "../../img/SVGcomponents/SvgAngleLeftSolid";
import './PromoBlock.scss'
import CardItem from "../CardItem";
import {dataCards1, dataCards2} from "../../testData/dataCards";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addedToCart, allItemRemovedFromCart, itemRemovedFromCart} from "../../actions";
import ButtonSectionForSlider from "./ButtonSectionForSlider/ButtonSectionForSlider";
import {promoItemsData} from "../../testData/promoItemsData";

class PromoBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {activeButton: 0}
    this.data = [promoItemsData, dataCards1, dataCards2]
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    localStorage.setItem('cart', JSON.stringify(this.props.cart));
    if (this.props.itemsForPromoBlock1) {
      console.log('this.props.itemsForPromoBlock1: ', this.props.itemsForPromoBlock1)
    }

  }

  onItemSelected = (itemId, event) => {
    if (!event.target.closest('.CardItem__button')) this.props.history.push(`Card/${itemId}`);
  }

  onButtonSelected = (num) => {
    this.setState({activeButton: num})
    this.props.history.push('/articles/')
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
          <ButtonSectionForSlider
            // items={[{title: 'Акции'}, {title: 'Сезонное предложение'}, {title: 'Популярные товары'}]}
            items={[{title: 'Акции'}]}
            onButtonSelected={this.onButtonSelected}
          />
          {
            this.props.itemsForPromoBlock1 &&
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
                this.props.itemsForPromoBlock1.map((item) => {
                  const {guid, product, manufacturer, img, minPrice, countLast} = item;
                  const itemIndex = this.props.cart.findIndex((item) => item.itemId === guid);
                  const isBuy = itemIndex >= 0;
                  const count = isBuy ? this.props.cart[itemIndex].count : 0
                  return <CardItem onItemSelected={this.onItemSelected}
                                   onIncrement={() => this.props.addedToCart(guid)}
                                   onDecrement={() => this.props.itemRemovedFromCart(guid)}
                                   isBuy={isBuy}
                                   count={count}
                                   countLast={countLast}
                                   key={guid}
                                   id={guid}
                                   title={product}
                                   maker={manufacturer}
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

            </Swiper>}

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: '0 0 15px'
          }}>
            <Link to='/articles/' className='PromoBlock__button'>
              все акционные товары
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({cart, itemsForPromoBlock1}) => {
  return {cart, itemsForPromoBlock1}
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PromoBlock))