import React, {useState} from "react";
import './ChangeData.scss'
import BlockWrapper from "../../../components/BlockWrapper";
import apiService from "../../../service/ApiService";
import {loadingTrue, logout, setToken} from "../../../actions";

const ChangeData = (props) => {

  const [valueForm, setValueForm] = useState({
    phone: '',
    email: '',
    birthDate: '',
    lastName: '',
    firstName: '',
    middleName: '',
    gender: ''
  })

  function isEmpty(obj) {
    for (let key in obj) {
      return false;
    }
    return true;
  }

  function onChangeHandler(e) {
    const name = e.target.name;
    const value = e.target.value;
    setValueForm({...valueForm, [name]: value})
  }

  function getDataProfile(event) {
    event.preventDefault()
    const data = {
      gender: props.userData.gender,
      birthDate: props.userData.birthDate,
      email: props.userData.email,
      lastName: props.userData.lastName,
      firstName: props.userData.firstName,
      middleName: props.userData.middleName
    }

    if (valueForm.gender !== '') data.gender = valueForm.gender === 'male';
    if (valueForm.birthDate !== '') data.birthDate = valueForm.birthDate;
    if (valueForm.email !== '') data.email = valueForm.email;
    if (valueForm.lastName !== '') data.lastName = valueForm.lastName;
    if (valueForm.firstName !== '') data.firstName = valueForm.firstName;
    if (valueForm.middleName !== '') data.middleName = valueForm.middleName;

    return data
  }

  return (
    <BlockWrapper classStyle='ProfileSetting ChangeData'>
      <h4>Изменить данные</h4>
      <form onSubmit={(event) => {
        event.preventDefault()
        props.loadingTrue('refreshToken in ChangeData')
        apiService.refreshToken(props.TOKEN)
          .then(response => {
            props.setToken(response)
            apiService.changeDataProfile(getDataProfile(event), response.accessToken)
              .then(res => {
                props.setUserData(res)
              })
              .catch(err => console.log(err))
            props.returnPage()
          })
          .catch(e => {
            console.log(e)
            props.logout()
          })
      }}>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <label htmlFor="phone">
            <p className='ProfileSetting__itemTitle'>Телефон</p>
            <div className='ProfileSetting__itemContent'>
              <input type="tel"
                     id="phone"
                     name="phone"
                     placeholder={`+7${props.userData.phone}`}
                     className='ProfileSetting__info ChangeData__input'
                     value={valueForm.phone}
                     onChange={onChangeHandler}
              />
            </div>
          </label>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <label htmlFor="email">
            <p className='ProfileSetting__itemTitle'>E-mail</p>
            <div className='ProfileSetting__itemContent'>
              <input type="email"
                     id="email"
                     name="email"
                     placeholder={props.userData.email}
                     className='ProfileSetting__info ChangeData__input'
                     value={valueForm.email}
                     onChange={onChangeHandler}
              />
            </div>
          </label>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <label htmlFor="lastName" className='ChangeData__label'>
            <p className='ProfileSetting__itemTitle ProfileSetting__itemTitle_listItem'>Фамилия</p>
            <div className='ProfileSetting__itemContent'>
              <input type="text"
                     id="lastName"
                     name="lastName"
                     placeholder={props.userData.lastName ? props.userData.lastName : ''}
                     className='ProfileSetting__info ChangeData__input'
                     value={valueForm.lastName}
                     onChange={onChangeHandler}
              />
            </div>
          </label>
          <label htmlFor="firstName" className='ChangeData__label'>
            <p className='ProfileSetting__itemTitle ProfileSetting__itemTitle_listItem'>Имя</p>
            <div className='ProfileSetting__itemContent'>
              <input type="text"
                     id="firstName"
                     name="firstName"
                     placeholder={props.userData.firstName ? props.userData.firstName : ''}
                     className='ProfileSetting__info ChangeData__input'
                     value={valueForm.firstName}
                     onChange={onChangeHandler}
              />
            </div>
          </label>
          <label htmlFor="middleName" className='ChangeData__label'>
            <p className='ProfileSetting__itemTitle ProfileSetting__itemTitle_listItem'>Отчество</p>
            <div className='ProfileSetting__itemContent'>
              <input type="text"
                     id="middleName"
                     name="middleName"
                     placeholder={props.userData.middleName ? props.userData.middleName : ''}
                     className='ProfileSetting__info ChangeData__input'
                     value={valueForm.middleName}
                     onChange={onChangeHandler}
              />
            </div>
          </label>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <label htmlFor="birthDate">
            <p className='ProfileSetting__itemTitle'>Дата рождения</p>
            <div className='ProfileSetting__itemContent'>
              <input type="date"
                     id="birthDate"
                     name="birthDate"
                     placeholder={props.userData.birthDate?.match(/\d{4}-\d\d-\d\d/g)}
                     className='ProfileSetting__info ChangeData__input'
                     value={valueForm.birthDate}
                     onChange={onChangeHandler}
              />
            </div>
          </label>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Пол</p>
          <div className='ProfileSetting__itemContainer'>
            <div>
              <input type="radio"
                     className='ProfileSetting__inputRadio'
                     id="genderChoice1"
                     name="gender"
                     value="male"
                     onChange={onChangeHandler}
                     checked={valueForm.gender === 'male'}
              />
              <label htmlFor="genderChoice1">Мужской</label>
            </div>

            <div>
              <input type="radio" id="genderChoice2"
                     className='ProfileSetting__inputRadio'
                     name="gender" value="female"
                     onChange={onChangeHandler}
                     checked={valueForm.gender === 'female'}
              />
              <label htmlFor="genderChoice2">Женский</label>
            </div>
          </div>

        </BlockWrapper>
        <nav className='ProfileSetting__changeBtnContainer'>
          <button type='submit' className='ProfileSetting__submit'>Сохранить изменения
          </button>
        </nav>

      </form>
    </BlockWrapper>
  );
}

export default ChangeData