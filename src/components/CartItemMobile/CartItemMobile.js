import React, {useState} from "react";
import './CartItemMobile.scss'
import SvgPillsIcon from "../../img/SVGcomponents/SvgPillsIcon";
import SvgAngleUpSolid from "../../img/SVGcomponents/SvgAngleUpSolid";
import SvgClose from "../UI/icons/SvgClose";
import CountButton from "../UI/CountButton/CountButton";
import RetailsListDropdown from "../UI/RetailsListDropdown/RetailsListDropdown";

const CartItemMobile = (props) => {
  const [showDescription, setShowDescription] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const {
    allItemRemovedFromCart,
    itemRemovedFromCart,
    addedToCart,
    count,
  } = props;
  const {img, title, maker, minPrice} = props.item;

  const stopCount = props.retails.sort((a, b) => a.countLast < b.countLast ? 1 : -1)[0].countLast
  const isLastCount = !(stopCount > count)
  const listRetails = props.retails.filter(retail => retail.countLast >= count)

  return (
    <div className='CartItemMobile'>

      <SvgClose className='CartItemMobile__closeIcon' onClick={allItemRemovedFromCart}/>
      <div className='CartItemMobile__container-img-price'>
        <div className='CartItemMobile__imageContainer'>
          {img
            ? <img className='CartItemMobile__image' src={img} alt='фото препарата'/>
            : <SvgPillsIcon className='CartItemMobile__image'/>
          }
        </div>

        <div className="CartItemMobile__priceBlock">
          <p className='CartItemMobile__price'>от {(minPrice * count).toFixed(2)} ₽
            {count > 1 && <span className='CartItemMobile__priceOne'>от {minPrice} ₽/шт.</span>}
          </p>

        </div>
      </div>
      <p className='CartItemMobile__caption'>Внешний вид товара может отличаться</p>

      <div className='CartItemMobile__descriptionContainer'>
        <h3>{title}</h3>
        <p className='CartItemMobile__maker'>{maker}</p>
      </div>

      <div className='CartItemMobile__buttonContainer'>
        <div className='CartItemMobile__dropdownBtn' onClick={() => {
          setShowDropdown(!showDropdown)
          setShowDescription(!showDescription)
        }}>
          <span>есть в аптеках</span>
          <div className={'CartItemMobile__iconContainer' + (showDescription ? ' CartItemMobile__rotate' : '')}>
            <SvgAngleUpSolid className='CartItemMobile__arrowIcon'/>
          </div>
        </div>

        <CountButton
          count={count}
          isLastCount={isLastCount}
          onDecrement={itemRemovedFromCart}
          onIncrement={() => {
            console.log('count: ', count, ' countLast: ', props.item.countLast, ' isLastCount: ', isLastCount)
            if (!isLastCount) {
              addedToCart()
            }
          }}
        />
      </div>

      <RetailsListDropdown list={listRetails} active={showDropdown} count={count}/>
    </div>


  )
}

export default CartItemMobile