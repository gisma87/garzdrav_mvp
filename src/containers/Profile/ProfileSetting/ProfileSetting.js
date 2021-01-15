import React, {useState} from "react";
import './ProfileSetting.scss'
import BlockWrapper from "../../../components/BlockWrapper";
import SvgCheck from "../../../components/UI/icons/SvgCheck";
import ChangeData from "../ChangeData/ChangeData";
import ChangePassword from "../ChangePassword/ChangePassword";
import Alert from "../../../components/UI/Alert/Alert";

const ProfileSetting = (props) => {

  const [alertShow, setAlertShow] = useState(false)
  const [statusAlert, setStatusAlert] = useState('')

  if (props.changeSetting === 'setting') {
    return <>
      <BlockWrapper classStyle='ProfileSetting'>
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
                {props.userData.lastName && props.userData.lastName + ' '}
                {props.userData.firstName && props.userData.firstName + ' '}
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
            <p className='ProfileSetting__btnChangeData' onClick={() => props.setChangeSetting('data')}>Изменить
              данные</p>
            <p className='ProfileSetting__btnChangeData' onClick={() => props.setChangeSetting('password')}>Изменить
              пароль</p>
          </nav>
        </form>
      </BlockWrapper>
      <Alert show={alertShow} onClose={() => setAlertShow(false)} title='Информируем: '>
        {
          statusAlert === 'executed' &&
          <p>Пароль успешно изменён</p>
        }
        {
          statusAlert === 'failure' &&
          <p>Произошла ошибка. Попробуйте повторить позже</p>
        }
        {
          statusAlert === 'shortMessage' &&
          <p>Пароль должен быть больше 8 символов</p>
        }
        {
          statusAlert === 'Unauthorized' &&
          <p>Неверный старый пароль</p>
        }
      </Alert>
    </>
  }

  if (props.changeSetting === 'data') {
    return <ChangeData {...props} returnPage={() => props.setChangeSetting('setting')}/>
  }

  if (props.changeSetting === 'password') {
    return <ChangePassword
      setStatusAlert={setStatusAlert}
      setAlertShow={() => setAlertShow(true)}
      returnPage={() => props.setChangeSetting('setting')}
    />
  }
}

export default ProfileSetting