import React from "react";
import './CardItemMobile.scss'
import notPhoto from "../../img/notPhoto.svg";
import CountButton from "../UI/CountButton/CountButton";
import SvgCartIcon from "../../img/SVGcomponents/SvgCartIcon";

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
    } | null,
    classStyle?: string,
    onItemSelected(id: string | number, event: React.MouseEvent): void
}

const CardItemMobile: React.FC<Props> = (props) => {

    if (props.itemProps === null) {
        return null
    }

    const {
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
        <div className={'CardItemMobile ' + classStyle}>
            <div className='CardItemMobile__imageContainer'>
                {img
                    ? <img className='CardItemMobile__image' src={img} alt="фото лекарства"
                           onClick={(event) => props.onItemSelected(id, event)}/>
                    : <img className='CardItem__image' src={notPhoto} alt="notPhoto"/>}
                <div className='CardItemMobile__price'>
                    <p className='CardItemMobile__priceText'>от <span className='CardItemMobile__priceNumber'>{minPrice}</span> р.</p>
                    {/*<button className='CardItemMobile__cart buttonActive' onClick={updateToCart}>*/}
                    {/*    {active ? <SvgCheck className='CardItemMobile__check_active'/> : 'Купить'}*/}
                    {/*</button>*/}
                    {
                        isBuy
                            ? <CountButton
                                count={count}
                                isLastCount={isLastCount}
                                onIncrement={onIncrement}
                                onDecrement={onDecrement}
                            />
                            : <button className='CardItemMobile__cart' onClick={onIncrement}>
                                <SvgCartIcon style={{fontSize: 28, color: '#fff'}}/>
                            </button>
                    }
                </div>
            </div>
            <div className='CardItemMobile__textContainer'>
                <div className='CardItemMobile__containerInfo'>
                    <h3 className='CardItemMobile__title'
                        onClick={(event) => props.onItemSelected(id, event)}
                    >{title}</h3>
                    <h4 className='CardItemMobile__maker'>{maker}</h4>
                </div>
            </div>
        </div>
    )
}

export default CardItemMobile