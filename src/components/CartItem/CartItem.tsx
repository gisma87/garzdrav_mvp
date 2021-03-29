import React, {useState} from "react";
import './CartItem.scss'
import SvgPillsIcon from "../../img/SVGcomponents/SvgPillsIcon";
import SvgAngleUpSolid from "../../img/SVGcomponents/SvgAngleUpSolid";
import SvgClose from "../UI/icons/SvgClose";
import CountButton from "../UI/CountButton/CountButton";
import RetailsListDropdown from "../UI/RetailsListDropdown/RetailsListDropdown";
import {ObjType} from "../../types";

type Props = {
    allItemRemovedFromCart(): void,
    itemRemovedFromCart(): void,
    addedToCart(): void,
    count: number,
    itemSelect?: () => void,
    item: { id: string, img: any, title: string, maker: string, minPrice: number, price: number },
    retails: {
        guid: string,
        countLast: number,
        priceRetail: number,
        brand: string,
        buildNumber: string,
        city: string,
        coordinates: (number | string)[]
        phone: string,
        street: string,
        title: string,
        weekDayTime: string,
        [key: string]: string | number | ObjType | (number | string | ObjType)[] | null
    }[]
}

const CartItem: React.FC<Props> = (props) => {
    const [showDescription, setShowDescription] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)

    const {
        allItemRemovedFromCart,
        itemRemovedFromCart,
        addedToCart,
        count,
        itemSelect = () => {
        }
    } = props;
    const {img, title, maker, minPrice} = props.item;

    const stopCount = props.retails.sort((a, b) => a.countLast < b.countLast ? 1 : -1)[0].countLast
    const isLastCount = !(stopCount > count)
    const listRetails = props.retails.filter(retail => retail.countLast >= count).sort((a, b) => a.priceRetail > b.priceRetail ? 1 : -1)

    return (
        <div className='CartItem'>

            <SvgClose className='CartItem__closeIcon' onClick={allItemRemovedFromCart}/>
            <div className='CartItem__container'>
                <div className='CartItem__imageContainer'>
                    {img
                        ? <img className='CartItem__image' src={img} alt='фото препарата'/>
                        : <SvgPillsIcon className='CartItem__image'/>
                    }
                </div>

                <div className='CartItem__descriptionContainer'>
                    <h3 onClick={itemSelect} className='CartItem__titleLink'>{title}</h3>
                    <p className='CartItem__maker'>{maker}</p>
                </div>

                <div className="CartItem__priceBlock">
                    {count > 1 && <p className='CartItem__priceOne'>от {minPrice} ₽/шт.</p>}
                    {isLastCount && <p className='CartItem__lastCount'>максимальное количество</p>}

                    <CountButton
                        count={count}
                        isLastCount={isLastCount}
                        onDecrement={itemRemovedFromCart}
                        onIncrement={() => {
                            if (!isLastCount) {
                                addedToCart()
                            }
                        }}
                    />

                    <p className='CartItem__price'>от {(minPrice * count).toFixed(2)} ₽</p>
                </div>
            </div>

            <div className='CartItem__description'>
                <p className='CartItem__caption'>Внешний вид товара может отличаться от изображения на сайте</p>

                <div className='CartItem__dropdownBtn' onClick={() => {
                    setShowDropdown(!showDropdown)
                    setShowDescription(!showDescription)
                }}>
                    <span>есть в аптеках</span>
                    <div className={'CartItem__iconContainer' + (showDescription ? ' CartItem__rotate' : '')}>
                        <SvgAngleUpSolid className='CartItem__arrowIcon'/>
                    </div>
                </div>
            </div>

            <RetailsListDropdown list={listRetails} active={showDropdown} count={count}/>

        </div>


    )
}

export default CartItem