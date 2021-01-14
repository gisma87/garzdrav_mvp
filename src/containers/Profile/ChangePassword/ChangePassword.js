import React, {useState} from "react";
import BlockWrapper from "../../../components/BlockWrapper";
import apiService from "../../../service/ApiService";

const ChangePassword = (props) => {

  const [valueForm, setValueForm] = useState({
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: ''
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
      <h4>Изменить пароль</h4>
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
          <label htmlFor="oldPassword">
            <p className='ProfileSetting__itemTitle'>Старый пароль</p>
            <div className='ProfileSetting__itemContent'>
              <input type="password"
                     id="oldPassword"
                     name="oldPassword"
                     placeholder=''
                     className='ProfileSetting__info ChangeData__input'
                     value={valueForm.oldPassword}
                     onChange={onChangeHandler}
              />
            </div>
          </label>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <label htmlFor="newPassword">
            <p className='ProfileSetting__itemTitle'>Новый пароль</p>
            <div className='ProfileSetting__itemContent'>
              <input type="password"
                     id="newPassword"
                     name="newPassword"
                     className='ProfileSetting__info ChangeData__input'
                     value={valueForm.newPassword}
                     onChange={onChangeHandler}
              />
            </div>
          </label>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <label htmlFor="repeatNewPassword" className='ChangeData__label'>
            <p className='ProfileSetting__itemTitle ProfileSetting__itemTitle_listItem'>Повторите новый пароль</p>
            <div className='ProfileSetting__itemContent'>
              <input type="password"
                     id="repeatNewPassword"
                     name="repeatNewPassword"
                     className='ProfileSetting__info ChangeData__input'
                     value={valueForm.repeatNewPassword}
                     onChange={onChangeHandler}
              />
            </div>
          </label>

        </BlockWrapper>

        <nav className='ProfileSetting__changeBtnContainer'>
          <button type='submit' className='ProfileSetting__submit'>Сохранить изменения
          </button>
        </nav>

      </form>
    </BlockWrapper>
  );
}

export default ChangePassword