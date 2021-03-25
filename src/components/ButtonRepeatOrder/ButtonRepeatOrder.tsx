import React, {useState} from "react"
import './ButtonRepeatOrder.scss'
import SvgRedo from "../../img/SVGcomponents/SvgRedo";
import {repeatOrder} from "../../actions";
import {connect} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {StateType} from "../../store";

type Props = {
    repeatOrder(arrayProducts: { idProduct: string, count: number }[]): void,
    item: { items: { productGuid: string, quantity: number }[] }
}


const ButtonRepeatOrder: React.FC<Props> = props => {

    const [animationRotate, setAnimation] = useState(false)

    function thisOrderRepeat() {
        const arrayProducts: { idProduct: string, count: number }[] = []
        props.item.items.forEach(el => {
            arrayProducts.push({
                idProduct: el.productGuid,
                count: el.quantity
            })
        })
        props.repeatOrder(arrayProducts)
    }


    return (
        <button className='ButtonRepeatOrder'
                onClick={() => {
                    thisOrderRepeat()
                    setAnimation(true)
                    setTimeout(() => setAnimation(false), 1000)
                }}
        >Повторить
            <div
                className={'ButtonRepeatOrder__imgRepeatContainer' + (animationRotate ? ' ButtonRepeatOrder__animationRotate' : '')}>
                <SvgRedo className='ButtonRepeatOrder__imgRepeat'/></div>
        </button>
    )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, {}, any>) => {
    return {
        repeatOrder: (arrayProducts: { idProduct: string, count: number }[]) => dispatch(repeatOrder(arrayProducts))
    }
}


export default connect(null, mapDispatchToProps)(ButtonRepeatOrder)