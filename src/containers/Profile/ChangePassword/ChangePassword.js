import React, {useState} from "react";
import './ChangePassword.scss'
import BlockWrapper from "../../../components/BlockWrapper";
import apiService from "../../../service/ApiService";

const ChangePassword = (props) => {

  const [valueForm, setValueForm] = useState({
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: '',
    errorMessage: false
  })

  function onChangeHandler(e) {
    const name = e.target.name;
    const value = e.target.value;
    setValueForm({...valueForm, [name]: value, errorMessage: false})
  }

  function changePassword() {
    if (valueForm.repeatNewPassword !== valueForm.newPassword) {
      setValueForm({...valueForm, errorMessage: true})
    } else {
      props.loadingTrue('changePasswordProfile')
      const objectPassword = {"oldPassword": valueForm.oldPassword, "newPassword": valueForm.newPassword}
      apiService.changePasswordProfile(objectPassword, props.TOKEN.accessToken)
        .then(response => {
          props.setUserData(response)
          props.returnPage()
        })
        .catch(err => {
          console.log(err)
          apiService.refreshToken(props.TOKEN)
            .then(res => {
              props.setToken(res)
              apiService.changeDataProfile(objectPassword, res.accessToken)
                .then(response => {
                  props.setUserData(response)
                  props.returnPage()
                })
                .catch(e => console.log('Произошла ошибка запроса. Попробуйте повторить позже'))
            })
            .catch(e => {
              console.log(e)
              props.logout()
            })
        })
    }
  }

  return (
    <BlockWrapper classStyle='ProfileSetting ChangeData'>
      <h4>Изменить пароль</h4>
      <form noValidate onSubmit={(event) => {
        event.preventDefault()
        changePassword()
        // apiService.changePasswordProfile(objectPassword, props.TOKEN.accessToken)
        //   .then((response) => {
        //     console.log(response)
        //     console.log(response.data);
        //     console.log(response.status);
        //     console.log(response.statusText);
        //     console.log(response.headers);
        //     console.log(response.config);
        //   })
        //   .catch(function (error) {
        //     if (error.response) {
        //       // The request was made and the server responded with a status code
        //       // that falls out of the range of 2xx
        //       console.log(error.response.data);
        //       console.log(error.response.status);
        //       console.log(error.response.headers);
        //     } else if (error.request) {
        //       // The request was made but no response was received
        //       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        //       // http.ClientRequest in node.js
        //       console.log(error.request);
        //     } else {
        //       // Something happened in setting up the request that triggered an Error
        //       console.log(error.message);
        //     }
        //     console.log(error);
        //     console.log(error.config);
        //     console.log(error.message);
        //     console.log(error.code);
        //     console.log(error.request);
        //     console.log(error.response);
        //   });
      }}
      >
        <BlockWrapper classStyle='ChangePassword__item'>

          <label className="ChangePassword__element">
            <input name="oldPassword"
                   id="oldPassword"
                   type="password"
                   className="ChangePassword__input"
                   required
                   value={valueForm.oldPassword}
                   onChange={onChangeHandler}
            />
            <p className="ChangePassword__label">Старый пароль</p>
            <span className="ChangePassword__errorMessage">Неверный логин</span>
          </label>
          <label className="ChangePassword__element">
            <input name="newPassword"
                   id="newPassword"
                   type="password"
                   className="ChangePassword__input"
                   required
                   value={valueForm.newPassword}
                   onChange={onChangeHandler}
            />
            <p className="ChangePassword__label">Новый пароль</p>
            <span className="ChangePassword__errorMessage">ошибка</span>
          </label>
          <label className="ChangePassword__element">
            <input name="repeatNewPassword"
                   id="repeatNewPassword"
                   type="password"
                   className={'ChangePassword__input' + (valueForm.errorMessage ? ' ChangePassword__input_error' : '')}
                   required
                   value={valueForm.repeatNewPassword}
                   onChange={onChangeHandler}
            />
            <p className="ChangePassword__label">Повторите новый пароль</p>
            <span
              className={'ChangePassword__errorMessage' + (valueForm.errorMessage ? ' ChangePassword__errorMessage_visible' : '')}>пароли не совпадают</span>
          </label>
        </BlockWrapper>

        <nav className='ProfileSetting__changeBtnContainer'>
          <button type='submit' className='ProfileSetting__submit'>Сохранить изменения
          </button>
        </nav>
      </form>
    </BlockWrapper>
  )
}

export default ChangePassword