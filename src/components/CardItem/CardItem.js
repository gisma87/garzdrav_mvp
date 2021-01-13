import React from "react";
import './CardItem.scss'
import SvgCartIcon from "../../img/SVGcomponents/SvgCartIcon";
import CountButton from "../UI/CountButton/CountButton";
import SvgPillsIcon from "../../img/SVGcomponents/SvgPillsIcon";

const CardItem = props => {

  const {
    isBuy,
    id,
    title,
    maker,
    count = 0,
    img,
    minPrice,
    classStyle = '',
    onItemSelected,
  } = props
  console.log('props: ', props)
  return (
    <div className={'CardItem ' + classStyle}
         onClick={(event) => onItemSelected(id, event)}>
      <div className='CardItem__imageContainer'>
        {
          img
            ? <img className='CardItem__image' src={img} alt="icon"/>
            : <SvgPillsIcon className='CardItem__notImage'/>
        }
      </div>
      <div className='CardItem__textContainer'>
        <div className='CardItem__containerInfo'>
          <h3 className='CardItem__title'>{title}</h3>
          <h4 className='CardItem__maker'>{maker}</h4>
        </div>
        <div className='CardItem__price'>
          <p>от <span className='CardItem__priceNumber'>{minPrice} ₽</span></p>


          <div className='CardItem__button'>
            {
              isBuy
                ? <CountButton
                  count={count}
                  onIncrement={props.onIncrement}
                  onDecrement={props.onDecrement}
                />
                : <button className='CardItem__cart' onClick={props.onIncrement}>
                  <SvgCartIcon style={{fontSize: 28, color: '#fff'}}/>
                </button>
            }
          </div>

        </div>
      </div>
    </div>
  )
}

export default CardItem