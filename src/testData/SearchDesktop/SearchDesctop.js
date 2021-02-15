import React from "react"
import {withRouter} from 'react-router-dom'
import './SearchDesktop.scss'
// import Burger from "../UI/Burger/Burger";
// import DropDownMenu from "../DropDownMenu/DropDownMenu";
import ButtonTopScroll from "../../components/UI/ButtonTopScroll";
import SearchPanel from "../../components/SearchPanel";

class SearchDesktop extends React.Component {

  state = {
    isActive: false,
    value: '',
    lastScrollY: 0
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    this.setState({lastScrollY: window.scrollY})
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({value: ''})
    // window.location.pathname = '/Cards/'
    this.props.history.push('/Cards/')
    window.scroll(0, 0)
  }

  handleInputChange = (e) => {
    const input = e.target
    const id = e.target.id
    const value = input.value;

    this.setState({value})
  }

  render() {
    return (
      <div className={'SearchDesktop ' + (this.state.lastScrollY > 90 ? 'SearchDesktop--active' : '')}>
        {/*<div className='wrapper'>*/}
        {/*<DropDownMenu title={*/}
        {/*  <button type="button" className='SearchDesktop__navbarToggle'*/}
        {/*          onClick={() => this.setState({isActive: !this.state.isActive})}>*/}
        {/*    <Burger isActive={this.state.isActive}/>*/}
        {/*    каталог*/}
        {/*  </button>*/}
        {/*}/>*/}

        {/*<form className='SearchDesktop__search' onSubmit={this.handleSubmit}>*/}
        {/*  <input*/}
        {/* id="searchPanel"*/}
        {/* type="text"*/}
        {/*    placeholder="поиск по названию, действующему веществу, производителю"*/}
        {/*    onChange={this.handleInputChange}*/}
        {/*    value={this.state.value}*/}
        {/*  />*/}
        {/*  <button><i className='SearchDesktop__iconSearch'/></button>*/}
        {/*</form>*/}
        {/*</div>*/}

        <SearchPanel/>
        {this.state.lastScrollY > 400 && <ButtonTopScroll/>}
      </div>
    )
  }
}

export default withRouter(SearchDesktop)