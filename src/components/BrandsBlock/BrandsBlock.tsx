import React from "react";
import './BrandsBlock.scss'
import brand1 from '../../img/brands/1.png'
import brand2 from '../../img/brands/2.png'
import brand3 from '../../img/brands/3.png'
import brand4 from '../../img/brands/4.png'
import brand5 from '../../img/brands/5.png'
import brand6 from '../../img/brands/6.png'
import brand7 from '../../img/brands/7.png'
import brand8 from '../../img/brands/8.png'
import {connect} from "react-redux";
import {getProductsFromSearchLimit} from "../../actions";
import {ThunkDispatch} from "redux-thunk";
import {StateType} from "../../store";
import {useHistory} from "react-router-dom";

const brands = [brand1, brand2, brand3, brand4, brand5, brand6, brand7, brand8]

type MapDispatchPropsType = {
    getProductsFromSearchLimit(data: { productName: string }): void
}

const BrandsBlock: React.FC<MapDispatchPropsType> = props => {

    const history = useHistory()

    // автопоиск по слову // eslint-disable-next-line
    const goToCardsPage = (wordSearch: string) => {
        props.getProductsFromSearchLimit({productName: wordSearch})
        history.push('/Cards/')
    }

    return (
        <div className='BrandsBlock wrapper'>
            <h3 className='BrandsBlock__title'>Бренды</h3>
            <div className='BrandsBlock__content'>
                {
                    brands.map((brand, index) => <div key={index} className='BrandsBlock__item'>
                        <img className='BrandsBlock__img' src={brand} alt="brand"/>
                    </div>)
                }
            </div>
        </div>
    )
}


const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, {}, any>) => {
    return {
        getProductsFromSearchLimit: (data: { productName: string }) => dispatch(getProductsFromSearchLimit(data))
    }
}

export default connect(null, mapDispatchToProps)(BrandsBlock)