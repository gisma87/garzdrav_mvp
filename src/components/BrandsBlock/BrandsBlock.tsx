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
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const brands = [
    {img: brand1, title: 'вольтарен'},
    {img: brand2, title: 'солгар'},
    {img: brand3, title: 'мелаксен'},
    {img: brand4, title: 'виагра'},
    {img: brand5, title: 'аквалор'},
    {img: brand6, title: 'линаква'},
    {img: brand7, title: 'детримакс'},
    {img: brand8, title: 'септолете'}
]


type MapDispatchPropsType = {
    getProductsFromSearchLimit(data: { productName: string }): void
}

const BrandsBlock: React.FC<MapDispatchPropsType> = props => {

    const history = useHistory()

    // автопоиск по слову
    const goToCardsPage = (wordSearch: string) => {
        props.getProductsFromSearchLimit({productName: wordSearch})
        history.push('/Cards/')
    }

    return (
        <ErrorBoundary>
            <div className='BrandsBlock wrapper'>
                <h3 className='BrandsBlock__title'>Бренды</h3>
                <div className='BrandsBlock__content'>
                    {
                        brands.map((brand, index) => <div key={index} className='BrandsBlock__item'
                                                          onClick={() => goToCardsPage(brand.title)}>
                            <img className='BrandsBlock__img' src={brand.img} alt="brand"/>
                        </div>)
                    }
                </div>
            </div>
        </ErrorBoundary>
    )
}


const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, {}, any>) => {
    return {
        getProductsFromSearchLimit: (data: { productName: string }) => dispatch(getProductsFromSearchLimit(data))
    }
}

export default connect(null, mapDispatchToProps)(BrandsBlock)