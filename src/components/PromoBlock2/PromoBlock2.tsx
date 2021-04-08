import React from "react";
import './PromoBlock2.scss'
import baner from '../../img/baners/MiniDoctorEnergy_Banner_1210x250.jpg'
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import {useHistory} from "react-router-dom";
import {ThunkDispatch} from "redux-thunk";
import {StateType} from "../../store";
import {getProductsFromSearchLimit} from "../../actions";
import {connect} from "react-redux";

type MapDispatchPropsType = {
    getProductsFromSearchLimit(data: { productName: string }): void
}

const banerObj = {img: baner, title: 'мини доктор'}

const PromoBlock2: React.FC<MapDispatchPropsType> = props => {

    const history = useHistory()

    // автопоиск по слову
    const goToCardsPage = (wordSearch: string) => {
        props.getProductsFromSearchLimit({productName: wordSearch})
        history.push('/Cards/')
    }

    return (
        <ErrorBoundary>
            <div className='PromoBlock2'>
                {/*<div className={'PromoBlock2__wrapper' + classStyle} style={style}></div>*/}
                <img className='PromoBlock2__baner' src={banerObj.img} alt="baner"
                     onClick={() => goToCardsPage(banerObj.title)}/>
            </div>
        </ErrorBoundary>
    )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, {}, any>) => {
    return {
        getProductsFromSearchLimit: (data: { productName: string }) => dispatch(getProductsFromSearchLimit(data))
    }
}

export default connect(null, mapDispatchToProps)(PromoBlock2)