import React, {useState} from "react";
import './ChangePassword.scss'
import BlockWrapper from "../../../components/BlockWrapper";
import apiService from "../../../service/ApiService";
import {connect} from "react-redux";
import {loadingFalse, loadingTrue, logout, setToken} from "../../../actions";

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

    function showAlertAndReturnPageProfileSetting(statusText) {
      props.loadingFalse('changePasswordProfile')
      props.setStatusAlert(statusText)
      props.setAlertShow()
      props.returnPage()
    }

    function errResponse(status) {
      if (status === 400) {
        showAlertAndReturnPageProfileSetting('shortMessage')
      }
      if (status === 401) {
        showAlertAndReturnPageProfileSetting('Unauthorized')
      }
    }

    if (valueForm.repeatNewPassword !== valueForm.newPassword) {
      setValueForm({...valueForm, errorMessage: true})
    } else {
      props.loadingTrue('changePasswordProfile')
      const objectPassword = {"oldPassword": valueForm.oldPassword, "newPassword": valueForm.newPassword}
      apiService.changePasswordProfile(objectPassword, props.TOKEN.accessToken)
        .then(response => {
          props.loadingFalse('changePasswordProfile')
          props.setStatusAlert('executed')
          props.setAlertShow()
          props.returnPage()
        })
        .catch(err => {
          console.log(err)
          if (err.response) {
            errResponse(err.response.status)
          } else if (err.request) {
            apiService.refreshToken(props.TOKEN)
              .then(resToken => {
                console.log('props.TOKEN до замены: ', props.TOKEN.accessToken.slice(-10))
                console.log('refresh_TOKEN: ', resToken.accessToken.slice(-10))
                props.setToken(resToken)
                apiService.changePasswordProfile(objectPassword, resToken.accessToken)
                  .then(response => {
                    showAlertAndReturnPageProfileSetting('executed')
                  })
                  .catch(e => {
                    if (err.response) {
                      errResponse(err.response.status)
                    } else {
                      showAlertAndReturnPageProfileSetting('failure')
                    }
                  })
              })
              .catch(e => {
                props.loadingFalse('changePasswordProfile')
                console.log(e)
                console.log('LOGOUT')
                props.logout()
              })
          } else {
            console.log(err)
          }
        })
    }
  }

  return (
    <BlockWrapper classStyle='ProfileSetting ChangeData'>
      <h4>Изменить пароль</h4>
      <form noValidate onSubmit={(event) => {
        event.preventDefault()
        changePassword()
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

const mapStateToProps = ({TOKEN}) => {
  return {TOKEN}
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    loadingFalse: (info) => dispatch(loadingFalse(info)),
    loadingTrue: (info) => dispatch(loadingTrue(info)),
    setToken: (newToken) => dispatch(setToken(newToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)