import React, {useEffect} from "react"
import {connect} from 'react-redux'
import './Company.scss'
import {setCatalog} from "../../actions";
import DropDownMenu from "../../components/DropDownMenu/DropDownMenu";

const Categories = props => {
  let i = 0
  return (
    <ul className='Categories'>
      {
        props.child.map((item, id) => {

          return (
            <div key={Math.random() + id}>
              {
                !item.child.length
                  ? <li key={Math.random() + id} className='Categories__itemTitle'>{++i} {item.title}</li>
                  : <li key={Math.random() + id} className='Categories__containerItems'>
                    <p className='Categories__categoryTitle'>{++i} {item.title}</p>
                    <Categories child={item.child}/>
                  </li>
              }
            </div>
          )
        })
      }
    </ul>
  )
}

const Company = (props) => {

  useEffect(() => {
    props.setCatalog()
    // eslint-disable-next-line
  }, [])


  return (
    <div className='HowOrder wrapper Catalog'>
      <h1>О компании</h1>
      {props.catalog && <DropDownMenu title='Каталог' data={props.catalog.child[1].child}/>}
      {props.catalog &&
      <ul className='Catalog__list'>
        {
          props.catalog.child.map((item, id) => {
            return (
              <div key={Math.random() + id}>
                {
                  !item.child.length
                    ? <li className='Catalog__itemTitle'>{item.title}</li>
                    : <div className='Catalog__containerItems'>
                      <p className='Catalog__categoryTitle'>{item.title}</p>
                      <Categories child={item.child}/>
                    </div>
                }
              </div>
            )
          })
        }
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