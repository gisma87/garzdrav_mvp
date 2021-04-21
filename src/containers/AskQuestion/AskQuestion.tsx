import React, {useState} from "react";
import './AskQuestion.scss'
import {Link} from "react-router-dom";

const AskQuestion = () => {

    const [message, setMessage] = useState<{ [key: string]: string }>({})
    const [check, setCheck] = useState<boolean>(false)

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

        const response = await fetch('sendmail.php', {
            method: 'POST',
            body: formData
        })
        if(response.ok) {
            alert('получилось')
        } else {
            alert('провал')
        }
    }

    return (
        <div className='AskQuestion wrapper'>

            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                if (check) {
                    submitForm()
                    console.log(message);
                    e.currentTarget.reset()
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
                               name='checkIagree'
                               className='AskQuestion__checkbox'
                               id='AskQuestion__checkbox'
                               checked={check}
                               onChange={(e) => setCheck(e.target.checked)}
                        />
                        <label htmlFor="AskQuestion__checkbox">Я даю согласие на обработку персональных данных</label>
                    </div>
                    <button className='AskQuestion__buttonBuy'>Отправить</button>
                </fieldset>
            </form>
            <p className='AskQuestion__faq'>Вы также можете посмотреть раздел: <Link to='/faq/'>
                Часто Задаваемые Вопросы</Link></p>
        </div>
    )
}

export default AskQuestion