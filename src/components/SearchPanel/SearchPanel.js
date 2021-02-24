import React, {useEffect, useState} from "react"
import {withRouter} from 'react-router-dom'
import {
  getProductsFromSearchLimit,
  onRequestFromSearchPanel, setPredictor
} from "../../actions";
import {connect} from "react-redux";
import SearchForm from "../UI/SearchForm/SearchForm";
import apiService from "../../service/ApiService";

const SearchPanel = (props) => {

  const [value, setValue] = useState('')
  const [previousCall, setpreviousCall] = useState(null)
  const [lastCallTimer, setlastCallTimer] = useState(null)
  const [timerDebounce] = useState(2000)
  const [text, setText] = useState('')
  const [showDropDown, setShowDropDown] = useState(false)
  const [focusInput, setFocusInput] = useState(false)

  useEffect(() => {
    if (props.predictor) {
      setShowDropDown(true)
    }
  }, [props.predictor])


  function changeSearchValue(value) {
    if (value?.length) {
      apiService.yandexPredictor(value)
        .then(res => {
          props.setPredictor(res)
        })
    }
  }

  const changeValue = (value) => {
    const lastCall = Date.now();
    if (previousCall && ((lastCall - previousCall) <= timerDebounce)) {
      if (lastCallTimer) clearTimeout(lastCallTimer);
    }

    setpreviousCall(lastCall);
    const timer = setTimeout(() => changeSearchValue(value), timerDebounce);
    setlastCallTimer(timer)
  }

  function pastePredictorValue(checkText) {
    const arrVal = value.split(' ')
    if (props.predictor?.pos < 0) {
      arrVal.pop();
      arrVal.push(checkText)
      const result = arrVal.join(' ').trim();
      setValue(result)
    }
  }


  // const changeValue = debounce(changeSearchValue, 2000)

  const {
    isMobile = false,
    onTouched = () => {
    }
  } = props;

  const handleInputChange = (e) => {
    const input = e.target
    const value = input.value;
    setValue(value)
    changeValue(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onTouched()

    props.getProductsFromSearchLimit({productName: value}) // запрос

    // requestFromSearchPanelThisTime = true, чтобы другие компоненты знали, что запрос пошёл именно с панели поиска
    props.onRequestFromSearchPanel()

    setValue('')
    props.history.push('/Cards/')
    window.scroll(0, 0)
  }

  return (
    <div style={{position: 'relative', width: '100%'}}>
      <SearchForm onSubmit={handleSubmit}
                  idInput="searchPanel"
                  isMobile={isMobile}
                  placeholder={window.innerWidth > 1000 ? "Поиск по названию, действующему веществу, производителю" : "Поиск по названию"}
                  onChange={handleInputChange}
                  value={value}
                  focus={focusInput}
                  setFocus={setFocusInput}
      />
      <ul className={'SearchForm__dropdown' + (showDropDown ? ' SearchForm__dropdown_visible' : '')}>
        {
          props.predictor &&
          props.predictor?.text.map((item, index) => {
            return <li key={item + index}
                       className='SearchForm__dropdownItem'
                       onClick={() => {
                         setText(item);
                         pastePredictorValue(item)
                         setShowDropDown(false)
                         setFocusInput(true)
                       }}
            >{item}</li>
          })
        }
      </ul>
    </div>

  )
}


const mapStateToProps = ({productsFromSearch, isCity, predictor}) => {
  return {productsFromSearch, isCity, predictor}
}

const mapDispatchToProps = (dispatch) => {
  return {
    getProductsFromSearchLimit: (options) => dispatch(getProductsFromSearchLimit(options)),
    onRequestFromSearchPanel: () => dispatch(onRequestFromSearchPanel()),
    setPredictor: (value) => dispatch(setPredictor(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchPanel))
