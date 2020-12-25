import React, {useRef, useState} from "react";
import './CartItem.scss'
import notPhoto from "../../img/notPhoto.svg";
import SvgPillsIcon from "../../img/SVGcomponents/SvgPillsIcon";
import SvgAngleUpSolid from "../../img/SVGcomponents/SvgAngleUpSolid";

const CartItem = (props) => {
  const [showDescription, setShowDescription] = useState(false)
  const [styleContent, setStyleContent] = useState({})
  const content = useRef(null)
  const contentWrapper = useRef(null)

  const {
    allItemRemovedFromCart,
    itemRemovedFromCart,
    addedToCart,
    addedToFavorits,
    count,
    isFavorite,
    classStyle = ''
  } = props;
  const {img, title, maker, sum, minPrice, countLast} = props.item;
  const isLastCount = !(countLast > count)

  function animate() {
    content.current?.clientHeight
      ? setStyleContent({height: 0})
      : setStyleContent({height: `${contentWrapper.current?.clientHeight}px`})
  }

  return (
    <div className='CartItem'>
      <div className='CartItem__container'>
        <div className='CartItem__imageContainer'>
          {img
            ? <img className='CartItem__image' src={img} alt='фото препарата'/>
            : <SvgPillsIcon className='CartItem__image'/>
          }
        </div>

        <div className='CartItem__descriptionContainer'>
          <h3>{title}</h3>
          <p className='CartItem__maker'>{maker}</p>
          <div className='CartItem__buttonToDescription'>
            <button
              onClick={() => {
                addedToFavorits()
              }}
            >{isFavorite ? 'Удалить из избранного' : 'В избранное'}
            </button>
            <button onClick={allItemRemovedFromCart}>Удалить
            </button>
          </div>
        </div>

        <div className='CartItem__itemPrice'>
          <p className='CartItem__price'>{sum ? sum.toFixed(2) : `от ${minPrice}`} ₽</p>
          <div className='CartItem__countButtons'>
            <button className='CartItem__countButtonMinus CartItem__countButton'
                    onClick={itemRemovedFromCart}
            >-
            </button>
            <input className='CartItem__countInput' type="text" value={count} readOnly
                   style={sum && isLastCount ? {fontWeight: 'bold'} : {}}/>
            <button className='CartItem__countButtonPlus CartItem__countButton'
                    style={sum && isLastCount ? {background: 'rgba(144, 0, 32, .3'} : {}}
                    onClick={() => {
                      console.log('count: ', count, ' countLast: ', props.item.countLast, ' isLastCount: ', isLastCount)
                      if (!isLastCount) {
                        addedToCart()
                      }
                    }}
            >+
            </button>
          </div>
        </div>
      </div>

      <div className='CartItem__description'>
        {sum
          ? <p className='CartItem__caption'>Внешний вид товара может отличаться от изображения на сайте</p>
          : <p className='CartItem__caption' style={{color: 'red'}}>В выбранной аптеке нет данного препарата</p>
        }
        <div className='CartItem__dropdownBtn' onClick={() => {
          animate()
          setShowDescription(!showDescription)
        }}>
          <span>есть в аптеках</span>
          <div className={'CartItem__iconContainer' + (showDescription ? ' CartItem__rotate' : '')}>
            <SvgAngleUpSolid className='CartItem__arrowIcon'/>
          </div>
        </div>
      </div>


      <div ref={content}
           style={styleContent}
           className={'CartItem__dropdown' + (!showDescription ? ' CartItem__contentDisabled' : '')}>
        <div ref={contentWrapper} className='CartItem__contentDropdown'>
          {
            props.retails.map((item) => {
              return (
                <div className='CartItem__dropdownItem' key={item.guid}>
                  <p className='CartItem__titleDropdownItem'>ул. {item.street} {item.buildNumber}</p>
                  <div className='CartItem__dropdownPriceContainer'>
                    <p className='CartItem__dropdownCount'><span>{count}</span> шт:</p>
                    <p className='CartItem__dropdownPrice'>{(item.priceRetail * count).toFixed(2)} ₽</p>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default CartItem