import React, {useEffect} from "react"
import {connect} from 'react-redux'
import './Company.scss'
import {setCatalog} from "../../actions";

const Company = (props) => {

  useEffect(() => {
    props.setCatalog()
  }, [])

  return (
    <div className='HowOrder wrapper'>
      <h1>О компании</h1>
      {props.catalog &&
      <ul>
        {props.catalog.child.map(item => {
          return (
            <li>{item.title}</li>
          )
        })}
      </ul>
      }
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCatalog: () => dispatch(setCatalog())
  }
}

const mapStateToProps = ({catalog}) => {
  return {
    catalog
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Company)