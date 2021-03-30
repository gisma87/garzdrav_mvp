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
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addedToCart, allItemRemovedFromCart, itemRemovedFromCart, setActivePromoGroup} from "../../actions";
import ButtonSectionForSlider from "./ButtonSectionForSlider/ButtonSectionForSlider";

const arrButtonPromoGroup = ['все акционные товары', 'все сезонные товары', 'все популярные товары']
const arrNameGroup = ['Акционные товары', 'Сезонные товары', 'Популярные товары']

class PromoBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {activeButton: 0}
    this.data = () => [this.props.itemsForPromoBlock1, this.props.seasonItemsForPromoBlock2, this.props.popularItemsForPromoBlock3]
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    localStorage.setItem('cart', JSON.stringify(this.props.cart));
  }

  onItemSelected = (itemId, event) => {
    if (!event.target.closest('.CardItem__button')) this.props.history.push(`Card/${itemId}`);
  }

  onButtonSelected = (num) => {
    const data = this.data()
    if (num < data.length && data[num]?.length > 0) {
      this.setState({activeButton: num})
    }
    // this.props.history.push('/articles/')
  }

  render() {
    SwiperCore.use([Navigation, Pagination, Autoplay])

    if (this.props.itemsForPromoBlock1.length) {
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
              items={[{title: 'Акции'}, {title: 'Сезонное предложение'}, {title: 'Популярные товары'}]}
              onButtonSelected={this.onButtonSelected}
            />
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
                this.data()?.[this.state.activeButton].map((item) => {
                  const {guid, product, manufacturer, img, minPrice, countLast} = item;
                  const itemIndex = this.props.cart.findIndex((item) => item.itemId === guid);
                  const isBuy = itemIndex >= 0;
                  const count = isBuy ? this.props.cart[itemIndex].count : 0
                  return <CardItem key={guid}
                                   itemProps={
                                     {
                                       onIncrement: () => this.props.addedToCart(guid),
                                       onDecrement: () => this.props.itemRemovedFromCart(guid),
                                       isBuy,
                                       count,
                                       countLast,
                                       id: guid,
                                       title: product,
                                       maker: manufacturer,
                                       img,
                                       minPrice
                                     }
                                   }
                                   onItemSelected={this.onItemSelected}
                  />
                }).map((item, index) => {
                  return (
                    <SwiperSlide tag="li" key={index} style={{listStyleType: 'none'}}>
                      {item}
                    </SwiperSlide>
                  )
                })
              }

            </Swiper>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              padding: '0 0 15px'
            }}>
              {/*<Link to='/articles/' className='PromoBlock__button'>*/}
              {/*  все акционные товары*/}
              {/*</Link>*/}
              {
                <button onClick={() => {
                  this.props.setActivePromoGroup({
                    name: arrNameGroup[this.state.activeButton],
                    arrPromo: this.data()?.[this.state.activeButton]
                  })
                  this.props.history.push('/articles/')
                }}
                        className='PromoBlock__button'>{arrButtonPromoGroup[this.state.activeButton]}</button>
              }
            </div>
          </div>
        </div>
      )
    } else {
      return <div style={{padding: 50}}/>
    }
  }
}

const mapStateToProps = ({cart, itemsForPromoBlock1, seasonItemsForPromoBlock2, popularItemsForPromoBlock3}) => {
  return {cart, itemsForPromoBlock1, seasonItemsForPromoBlock2, popularItemsForPromoBlock3}
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item)),
    setActivePromoGroup: (promo) => dispatch(setActivePromoGroup(promo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PromoBlock))