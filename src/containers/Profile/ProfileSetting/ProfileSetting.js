import React, {useState} from "react";
import './ProfileSetting.scss'
import BlockWrapper from "../../../components/BlockWrapper";
import SvgCheck from "../../../components/UI/icons/SvgCheck";
import ChangeData from "../ChangeData/ChangeData";


const ProfileSetting = (props) => {
  const [changeData, setChangeData] = useState(false)

  return (
    changeData
      ? <ChangeData {...props}/>
      : <BlockWrapper classStyle='ProfileSetting'>
        <h4>Настройки профиля</h4>
        <form>
          <BlockWrapper classStyle='ProfileSetting__item'>
            <p className='ProfileSetting__itemTitle'>Телефон</p>
            <div className='ProfileSetting__itemContent'>
              <p className='ProfileSetting__info'>+7{props.userData.phone}</p>
              <div className='ProfileSetting__check'><SvgCheck style={{color: 'green'}}/></div>
            </div>
          </BlockWrapper>
          <BlockWrapper classStyle='ProfileSetting__item'>
            <p className='ProfileSetting__itemTitle'>E-mail</p>
            <div className='ProfileSetting__itemContent'>
              <p className='ProfileSetting__info'>{props.userData.email}</p>
              {
                props.userData.isConfirmed &&
                <div className='ProfileSetting__check'><SvgCheck style={{color: 'green'}}/></div>
              }
            </div>
          </BlockWrapper>
          <BlockWrapper classStyle='ProfileSetting__item'>
            <p className='ProfileSetting__itemTitle'>Имя</p>
            <div className='ProfileSetting__itemContent'>
              <p className='ProfileSetting__info'>
                {props.userData.lastName && props.userData.lastName}
                {props.userData.firstName && props.userData.firstName}
                {props.userData.middleName && props.userData.middleName}
              </p>
            </div>
          </BlockWrapper>
          <BlockWrapper classStyle='ProfileSetting__item'>
            <p className='ProfileSetting__itemTitle'>Дата рождения</p>
            <div className='ProfileSetting__itemContent'>
              <p className='ProfileSetting__info'>{props.userData.birthDate?.match(/\d{4}-\d\d-\d\d/g)}</p>
            </div>
          </BlockWrapper>
          <BlockWrapper classStyle='ProfileSetting__item'>
            <p className='ProfileSetting__itemTitle'>Пол</p>

            <div className='ProfileSetting__itemContainer'>
              {
                props.userData.gender !== null
                && <>
                  <div>
                    <input type="radio"
                           className='ProfileSetting__inputRadio'
                           readOnly
                           id="genderChoice1"
                           name="gender"
                           value="male"
                           checked={props.userData.gender}
                    />
                    <label htmlFor="genderChoice1">Мужской</label>
                  </div>

                  <div>
                    <input type="radio" id="genderChoice2"
                           className='ProfileSetting__inputRadio'
                           name="gender" value="female"
                           readOnly
                           checked={!props.userData.gender}
                    />
                    <label htmlFor="genderChoice2">Женский</label>
                  </div>
                </>
              }
            </div>


          </BlockWrapper>
          <nav className='ProfileSetting__changeBtnContainer'>
            <p className='ProfileSetting__btnChangeData' onClick={() => setChangeData(true)}>Изменить данные</p>
            <p className='ProfileSetting__btnChangeData'>Изменить пароль</p>
          </nav>
        </form>
      </BlockWrapper>
  )
}

export default ProfileSetting