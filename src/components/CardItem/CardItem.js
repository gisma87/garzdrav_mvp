import React from "react";
import './CardItem.scss'
import SvgShoppingCartSolid from "../../img/SVGcomponents/SvgShoppingCartSolid";
// import img from '../../img/tov.jpg'

// const nameItem = 'Librederm Hyaluronic крем для тела увлажняющий 200 мл легкий'

const CardItem = ({id, title, maker, img, minPrice, classStyle = '', onItemSelected}) => {
  return (
    <div className={'CardItem ' + classStyle}
         onClick={(event) => onItemSelected(id, event)}>
      <div className='CardItem__imageContainer'>
        {img ? <img className='CardItem__image' src={img} alt=""/> : <i className="fas fa-pills"/>}
      </div>
      <div className='CardItem__textContainer'>
        <div className='CardItem__containerInfo'>
          <h3 className='CardItem__title'>{title}</h3>
          <h4 className='CardItem__maker'>{maker}</h4>
        </div>
        <div className='CardItem__price'>
          {/*<p className='CardItem__priceText'>Цена</p>*/}
          <p>от <span className='CardItem__priceNumber'>{minPrice}</span> р.</p>
          <button className='CardItem__cart buttonActive' onClick={() => {
            console.log('на меня нажали')
          }}>
            <SvgShoppingCartSolid/>
            {/*<span>в корзину</span>*/}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardItem