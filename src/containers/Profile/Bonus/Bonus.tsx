import React, {useRef} from "react";
import './Bonus.scss'
import BlockWrapper from "../../../components/BlockWrapper";
import {setActiveBonusCard} from "../../../actions";
import {connect} from "react-redux";
import ErrorBoundary from "../../../components/ErrorBoundary/ErrorBoundary";
import {scrollToElement} from "../../../utils/scrollToElement";
import {UserBonusCardType, UserDataType} from "../../../types";
import {RouteComponentProps} from "react-router-dom";
import {ThunkDispatch} from "redux-thunk";
import {StateType} from "../../../store";

type MapStatePropsType = {
    userData: UserDataType | null,
    activeBonusCard: UserBonusCardType | null
}

type MapDispatchPropsType = {
    setActiveBonusCard(bonusCard: UserBonusCardType): void
}

export type Props = RouteComponentProps & MapStatePropsType & MapDispatchPropsType;

const Bonus: React.FC<Props> = props => {

    const cardsElement = useRef<HTMLDivElement>(null);

    const noCard = {marginBottom: 0}

    const cards = props.userData ? [...props.userData.cards] : null;
    if (cards) cards.sort((a, b) => a.currentBalance < b.currentBalance ? 1 : -1);

    return (
        <ErrorBoundary>
            <div ref={cardsElement}>
                <BlockWrapper classStyle='Bonus'>
                    <h4>Бонусы: </h4>
                    {
                        (cards?.length && props.activeBonusCard)
                            ? <>
                                <BlockWrapper classStyle='Bonus__item'>
                                    <p className='Bonus__itemTitle' style={props.activeBonusCard ? noCard : {}}>Бонусная
                                        карта</p>
                                    <p className='Bonus__info'
                                       style={props.activeBonusCard ? noCard : {}}>№ {props.activeBonusCard.barcode}</p>
                                </BlockWrapper>
                                <BlockWrapper classStyle='Bonus__item'>
                                    <p className='Bonus__itemTitle' style={props.activeBonusCard ? noCard : {}}>Уровень
                                        карты</p>
                                    <div className='Bonus__itemContent'>
                                        <p className='Bonus__info'>{props.activeBonusCard.level}</p>
                                    </div>
                                </BlockWrapper>
                                <BlockWrapper classStyle='Bonus__item'>
                                    <p className='Bonus__itemTitle' style={props.activeBonusCard ? noCard : {}}>Текущий
                                        баланс</p>
                                    <div className='Bonus__itemContent'>
                                        <p className='Bonus__info Bonus__balance'>
                                            {props.activeBonusCard.currentBalance.toFixed(2)}
                                        </p>
                                    </div>
                                </BlockWrapper>
                                <BlockWrapper classStyle='Bonus__item'>
                                    <p className='Bonus__itemTitle' style={props.activeBonusCard ? noCard : {}}>
                                        Вместе с картой вы совершили покупок на общую сумму:
                                    </p>
                                    {
                                        props.activeBonusCard.saleBalance &&
                                        <p className='Bonus__info'> {props.activeBonusCard.saleBalance.toFixed(2)} ₽</p>
                                    }
                                </BlockWrapper>
                                <p className='Bonus__signature'>Подробную историю зачисления / списания бонусов можно
                                    посмотреть в
                                    истории ваших покупок</p>
                            </>
                            : <p>У вас пока нет бонусной карты</p>
                    }

                    {
                        (cards && cards.length > 1) &&
                        <div className='Bonus__cards'>
                          <h4>Выберите бонусную карту: </h4>
                          <ul className='Bonus__cardsContainer'>
                              {
                                  cards.map((card, index) => {
                                      return (<li key={index} className='Bonus__cardItem'>
                                          <button onClick={() => {
                                              props.setActiveBonusCard(card)
                                              if (cardsElement.current) {
                                                  scrollToElement({
                                                      element: cardsElement.current,
                                                      offset: -150,
                                                      smooth: true
                                                  })
                                              }
                                          }}
                                                  className='Bonus__btnSelectCard'><b>№ {card.barcode}</b> <span
                                              className="Bonus__balanceText">Баланс: {card.currentBalance.toFixed(2)} ₽</span>
                                          </button>
                                      </li>)
                                  })
                              }
                          </ul>
                        </div>
                    }

                </BlockWrapper>
            </div>
        </ErrorBoundary>
    )
}

const mapStateToProps = ({userData, activeBonusCard}: StateType): MapStatePropsType => {
    return {userData, activeBonusCard}
}

const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, {}, any>): MapDispatchPropsType => {
    return {
        setActiveBonusCard: (bonusCard: UserBonusCardType) => dispatch(setActiveBonusCard(bonusCard))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bonus)