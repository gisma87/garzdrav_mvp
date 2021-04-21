import React, {useState} from "react";
import './AskQuestion.scss'
import {Link} from "react-router-dom";
import Alert from "../../components/UI/Alert/Alert";

const AskQuestion = () => {

    const [message, setMessage] = useState<{ [key: string]: string }>({})
    const [check, setCheck] = useState<boolean>(false)
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [checkboxLabel, setCheckboxLabel] = useState(false)

    const setStatusText = (target: HTMLFormElement) => {
        setMessage({
            ...message,
            [target.name]: target.value
        })
    }

    const submitForm = async () => {
        let formData = new FormData();
        Object.keys(message).forEach(item => {
            console.log(item, message[item])
            formData.append(item, message[item]);
        })

        const response = await fetch('../../sendmail.php', {
            method: 'POST',
            body: formData
        })
        if (response.ok) {
            setAlertMessage('Ваше сообщение успешно отправлено и будет рассмотрено в ближайшее время.')
            setAlertShow(true)
        } else {
            setAlertMessage('При отправке произошла ошибка. Попробуйте перезагрузить страницу и повторить отправку позже.')
            setAlertShow(true)
        }
    }

    return (
        <div className='AskQuestion wrapper'>

            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                if (check) {
                    submitForm()
                    setCheckboxLabel(false)
                    e.currentTarget.reset()
                } else {
                    setCheckboxLabel(true)
                }
            }}
                  onChange={
                      (e: React.FormEvent<HTMLFormElement>) => {
                          const target = e.target as HTMLFormElement;
                          if (target.id !== 'AskQuestion__checkbox') setStatusText(target);
                      }
                  }
            >
                <fieldset className='AskQuestion__container'>
                    <legend>Задать вопрос</legend>
                    <label htmlFor='AskQuestion-name' className='AskQuestion__label'>
                        <p className='AskQuestion__labelTitle'>ФИО</p>
                        <input type="text"
                               id='AskQuestion-name'
                               name='name'
                               className='AskQuestion__input'
                               placeholder='Представьтесь'
                               required
                               minLength={2}
                               maxLength={100}
                        />
                    </label>
                    <label htmlFor='AskQuestion-contact' className='AskQuestion__label'>
                        <p className='AskQuestion__labelTitle'>Ваши контактные данные</p>
                        <input type="text"
                               id='AskQuestion-contact'
                               name='contact'
                               className='AskQuestion__input'
                               placeholder='Телефон и/или email'
                               required
                               minLength={2}
                               maxLength={100}
                        />
                    </label>
                    <label htmlFor='AskQuestion-text' className='AskQuestion__label'>
                        <p className='AskQuestion__labelTitle'>Ваш вопрос</p>
                        <textarea
                            id='AskQuestion-text'
                            name='text'
                            className='AskQuestion__input AskQuestion__textarea'
                            placeholder='Текст сообщения'
                            required
                            minLength={5}

                        />
                    </label>
                    <div className='AskQuestion__checkboxContainer'>
                        <input type="checkbox"
                               style={(checkboxLabel && !check) ? {borderColor: 'red'} : {}}
                               name='checkIagree'
                               className='AskQuestion__checkbox'
                               id='AskQuestion__checkbox'
                               checked={check}
                               onChange={(e) => setCheck(e.target.checked)}
                        />
                        <label htmlFor="AskQuestion__checkbox"
                               style={(checkboxLabel && !check) ? {borderBottom: '1px solid red'} : {}}
                        >Я даю согласие на обработку персональных данных</label>
                    </div>
                    <button className='AskQuestion__buttonBuy'>Отправить</button>
                </fieldset>
            </form>
            <p className='AskQuestion__faq'>Вы также можете посмотреть раздел: <Link to='/faq/'>
                Часто Задаваемые Вопросы</Link></p>
            <Alert show={alertShow} onClose={() => setAlertShow(false)} title='Информируем: '>
                <p>{alertMessage}</p>
            </Alert>
        </div>
    )
}

export default AskQuestion