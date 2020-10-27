import React from "react";
import './CardItem.scss'
import SvgShoppingCartSolid from "../../img/SVGcomponents/SvgShoppingCartSolid";
import SvgCheck from "../UI/icons/SvgCheck";

const CardItem = ({active, id, title, maker, img, minPrice, classStyle = '', onItemSelected, updateToCart}) => {

  // const [active, setActive] = useState(false);

  // const setCount = () => {
  //   if (localStorage.getItem('count')>=0) {
  //     const x = localStorage.getItem('count')
  //     !active ? localStorage.setItem('count', +x + 1) : (x > 0 ? localStorage.setItem('count', +x - 1) : localStorage.setItem('count', 0))
  //     console.log(x)
  //   } else {
  //     localStorage.setItem('count', 0);
  //   }
  //   setActive(state => !state)
  //
  // }

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
          <p>от <span className='CardItem__priceNumber'>{minPrice}</span> р.</p>
          <button className={'CardItem__cart buttonActive ' + (active ? 'CardItem__cart_visible' : '')}
                  onClick={() => {
                    // setActive(state => !state)
                    updateToCart()
                  }}>
            {active ? <SvgCheck style={{color: 'green'}}/> : <SvgShoppingCartSolid/>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardItem