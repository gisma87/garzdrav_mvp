import React from "react";
import './CardItem.scss'
import SvgCartIcon from "../../img/SVGcomponents/SvgCartIcon";
import CountButton from "../UI/CountButton/CountButton";
import SvgPillsIcon from "../../img/SVGcomponents/SvgPillsIcon";
import SvgCheck from "../UI/icons/SvgCheck";

type Props = {
    itemProps: {
        isBuy: boolean,
        count?: number,
        countLast: number,
        id: string | number,
        title: string,
        maker: string,
        img: any,
        minPrice: number | null,
        classStyle?: string,

        onIncrement(event?: React.MouseEvent): void,
        onDecrement(event?: React.MouseEvent): void
        promo: boolean,
    } | null,
    classStyle?: string,
    onItemSelected(id: string | number, event: React.MouseEvent): void
}

const CardItem: React.FC<Props> = props => {

    if (props.itemProps === null) {
        return null
    }

    const {
        promo = null,
        isBuy,
        id,
        title,
        maker,
        count = 0,
        img,
        minPrice,
        classStyle = '',
        countLast,
        onIncrement,
        onDecrement
    } = props.itemProps

    const isLastCount = !(countLast > count)

    return (
        <div className={'CardItem ' + classStyle}
             onClick={(event) => props.onItemSelected(id, event)}>
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
                    <div>
                        {
                            minPrice
                                ? <p className='CardItem__priceParagraph'>от <span className='CardItem__priceNumber'>{minPrice} ₽</span></p>
                                : <p className='CardItem__linkToProduct'
                                     onClick={(event) => props.onItemSelected(id, event)}>Подробнее...</p>
                        }
                    </div>

                    <div className='CardItem__button'>
                        {
                            promo
                                ? <>{
                                    isBuy
                                        ? <button className='CardItem__cart' onClick={onDecrement} style={{
                                            minHeight: 34,
                                            width: 78,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <SvgCheck style={{fontSize: 18, color: '#fff'}}/>
                                        </button>
                                        : <button className='CardItem__cart' onClick={onIncrement}>
                                            <SvgCartIcon style={{fontSize: 28, color: '#fff'}}/>
                                        </button>
                                }</>
                                : <>{
                                    isBuy
                                        ? <CountButton
                                            count={count}
                                            isLastCount={isLastCount}
                                            onIncrement={onIncrement}
                                            onDecrement={onDecrement}
                                        />
                                        : <button className='CardItem__cart' onClick={onIncrement}>
                                            <SvgCartIcon style={{fontSize: 28, color: '#fff'}}/>
                                        </button>
                                }</>
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CardItem