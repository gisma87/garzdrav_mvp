import React, {useEffect, useRef, useState} from "react"
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
  const [timerDebounce] = useState(500)
  const [showDropDown, setShowDropDown] = useState(false)
  const [focusInput, setFocusInput] = useState(false)
  const [activeItemDropDown, setActiveItemDropDown] = useState(0)
  const [focusDropDown, setFocusDropDown] = useState(false)

  const dropdownItem = useRef(null)

  useEffect(() => {
    if (props.predictor) {
      setShowDropDown(true)
    }
  }, [props.predictor])
  useEffect(() => {
    const headerDesktop = document.querySelector('.HeaderDesktop');
    if (showDropDown) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '10px';
      if (headerDesktop) headerDesktop.style.paddingRight = '10px';
    }
    if (!showDropDown) {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
      if (headerDesktop) headerDesktop.style.paddingRight = '0';
    }
  }, [showDropDown])

  const task = useRef(0)


  function changeSearchValue(value) {
    if (value?.length) {
      task.current = task.current + 1
      apiService.yandexPredictor(value)
        .then(res => {
          props.setPredictor(res)
        })
        .finally(() => {
          if (task.current <= 0) {
            setTimeout(() => setShowDropDown(false), 500)
            task.current = 0
          } else {
            task.current = task.current - 1
          }
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

    if (props.predictor?.pos >= 0) {
      arrVal.push(checkText)
      const result = arrVal.join(' ');
      setValue(result)
    }
  }

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
    setShowDropDown(false)
    task.current = -1
    onTouched()

    props.getProductsFromSearchLimit({productName: value}) // запрос

    // requestFromSearchPanelThisTime = true, чтобы другие компоненты знали, что запрос пошёл именно с панели поиска
    props.onRequestFromSearchPanel()

    setValue('')
    props.history.push('/Cards/')
    window.scroll(0, 0)
  }

  function keyPress(event) {
    if (event.keyCode === 40) {
      dropdownItem.current.focus()
    }
    if (event.keyCode === 9) {
      if (props.predictor && props.predictor.text.length) {
        pastePredictorValue(props.predictor.text[0])
        setShowDropDown(false)
        setFocusInput(true)
      }
    }
  }

  function navigationDropDown(event) {
    const keyCode = event.keyCode;
    switch (keyCode) {
      case 9:
        if (props.predictor && props.predictor.text.length) {
          pastePredictorValue(props.predictor.text[activeItemDropDown])
          setShowDropDown(false)
          setActiveItemDropDown(0)
          setFocusInput(true)
        }
        break;

      case 13:
        if (props.predictor && props.predictor.text.length) {
          pastePredictorValue(props.predictor.text[activeItemDropDown])
          setShowDropDown(false)
          setActiveItemDropDown(0)
          setFocusInput(true)
        }
        break;

      case 40:
        if (props.predictor && props.predictor.text.length) {
          const len = props.predictor.text.length;
          if (activeItemDropDown < (len - 1)) {
            setActiveItemDropDown((prev) => prev + 1)
          } else {
            setActiveItemDropDown(0)
          }
        }
        break;

      case 38:
        if (props.predictor && props.predictor.text.length) {
          // const len = props.predictor.text.length;
          if (activeItemDropDown > 0) {
            setActiveItemDropDown((prev) => prev - 1)
          } else {
            // setActiveItemDropDown(len - 1)
            setFocusInput(true)
          }
        }
        break;
      default:
        return;
    }
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
                  keyPress={keyPress}
      />
      <ul tabIndex="0"
          onKeyDown={navigationDropDown}
          onFocus={() => setFocusDropDown(true)}
          onBlur={() => {
            setFocusDropDown(false)
            setShowDropDown(false)
          }}
          className={'SearchForm__dropdown' + (showDropDown ? ' SearchForm__dropdown_visible' : '')}
          ref={dropdownItem}>
        {
          props.predictor &&
          props.predictor?.text.map((item, index) => {
            return <li key={item + index}
                       tabIndex="-1"
                       className={'SearchForm__dropdownItem' + ((focusDropDown && (activeItemDropDown === index)) ? ' SearchForm__dropdownItem_focus' : '')}
                       style={(index === 0) && !focusDropDown ? {background: '#d9d9d9'} : {}}
                       onClick={() => {
                         pastePredictorValue(item)
                         setShowDropDown(false)
                         setFocusInput(true)
                       }}
            >{item}</li>
          })
        }
      </ul>
      {
        showDropDown &&
        <div className='SearchForm__backdrop' onClick={() => setShowDropDown(false)}/>
      }
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
