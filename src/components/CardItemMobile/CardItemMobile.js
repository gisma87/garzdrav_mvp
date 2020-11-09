import React from "react";
import './CardItemMobile.scss'
import SvgShoppingCartSolid from "../../img/SVGcomponents/SvgShoppingCartSolid";
import SvgCheck from "../UI/icons/SvgCheck";

const CardItemMobile = ({active, id, title, maker, img, minPrice, classStyle = '', onItemSelected, updateToCart}) => {

  return (
    <div className={'CardItemMobile ' + classStyle}>
      <div className='CardItemMobile__imageContainer'>
        {img ? <img className='CardItemMobile__image' src={img} alt=""
                    onClick={(event) => onItemSelected(id, event)}
        /> : <i className="fas fa-pills"/>}
        <div className='CardItemMobile__price'>
          <p>от <span className='CardItemMobile__priceNumber'>{minPrice}</span> р.</p>
          <button className='CardItemMobile__cart buttonActive'
                  onClick={() => {
                    updateToCart()
                  }}>
            {active ? <SvgCheck style={{color: 'green'}}/> : 'Купить'}
          </button>
        </div>
      </div>
      <div className='CardItemMobile__textContainer'>
        <div className='CardItemMobile__containerInfo'>
          <h3 className='CardItemMobile__title'
              onClick={(event) => onItemSelected(id, event)}
          >{title}</h3>
          <h4 className='CardItemMobile__maker'>{maker}</h4>
        </div>
      </div>
    </div>
  )
}

export default CardItemMobile