import React, {useState} from "react";
import './ChangeData.scss'
import BlockWrapper from "../../../components/BlockWrapper";
import SvgCheck from "../../../components/UI/icons/SvgCheck";


const ChangeData = (props) => {

  const [valueForm, setValueForm] = useState({})

  function onChangeHandler(e) {
    const name = e.target.name;
    console.log('name: ', name)
    const value = e.target.value;
    setValueForm({...valueForm, [name]: value})
  }

  return (
    <BlockWrapper classStyle='ProfileSetting ChangeData'>
      <h4>Изменить данные</h4>
      <form>
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
          <label htmlFor="name">
            <p className='ProfileSetting__itemTitle'>Имя</p>
            <div className='ProfileSetting__itemContent'>
              <input type="text"
                     id="name"
                     name="name"
                     placeholder={`
                       ${props.userData.lastName ? props.userData.lastName : ''} 
                       ${props.userData.lastName ? props.userData.lastName : ''} 
                       ${props.userData.lastName ? props.userData.lastName : ''} 
                       `}
                     className='ProfileSetting__info ChangeData__input'
                     value={valueForm.name}
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
          <button type='submit' className='ProfileSetting__submit'>Сохранить изменения</button>
        </nav>

      </form>
    </BlockWrapper>
  );
}

export default ChangeData