import React, {useState} from "react"
import SvgRedo from "../../img/SVGcomponents/SvgRedo";
import {repeatOrder} from "../../actions";


const ButtonRepeatOrder = props => {

  const [animationRotate, setAnimation] = useState(false)

  function thisOrderRepeat() {
    const arrayProducts = []
    props.item.items.forEach(el => {
      arrayProducts.push({
        idProduct: el.product,
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

const mapStateToProps = () => {
}

const mapDispatchToProps = (dispatch) => {
  return {
    repeatOrder: (arrayProducts) => dispatch(repeatOrder(arrayProducts)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ButtonRepeatOrder)