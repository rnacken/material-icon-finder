import React, { Component } from 'react';
import { connect } from 'react-redux';

import { deselectIcon } from './../../actions/iconsActions.js';
import Searchbar from './../Searchbar/Searchbar.jsx';
import Icons from './../Icons/Icons.jsx';
import IconPanel from './../IconPanel/IconPanel.jsx';

import utils from './../../utils';

import './App.css';

class App extends Component {
  headerHeight = 0;
  headerFixed = false;

  updateHeaderHeightDebounce = utils.debounce(this.updateHeaderHeight, 200);

  constructor() {
    super();
    this.state = {
      appStyles: {
        marginTop: `${this.headerHeight}px`
      },
      headerStyles: {
        position: 'absolute',
        top: 0
      }
    }
  }

  componentDidMount() {
    this.updateHeaderHeight();
    window.onresize = () => {
      this.updateHeaderHeightDebounce();
    }
    window.onscroll = () => {
      this.checkFixedSearchbar();
    }

  }

  checkFixedSearchbar() {
    const marginOffset = 80;
    if (window.scrollY >= this.headerHeight - marginOffset) {
      this.headerFixed = true;
      this.setState({
        appStyles: {
          marginTop: `${this.headerHeight}px`
        },
        headerStyles: {
          position: 'fixed',
          top: `-${this.headerHeight - marginOffset}px`
        }
      })
    } else {
      this.headerFixed = false;
      this.setState({
        appStyles: {
          marginTop: `${this.headerHeight}px`
        },
        headerStyles: {
          position: 'absolute',
          top: 0
        }
      });
    }
  }

  updateHeaderHeight() {
    this.headerHeight = this.refs.headerRef.getBoundingClientRect().height;
    this.checkFixedSearchbar();
  }

  onDeselectIcon() {
    this.props.onDeselectIcon();
  }

  render() {
    let appClassName = 'app ';
    appClassName += (this.props.selectedIcon)? 'show-panel' : '';
    return (
      <div style={this.state.appStyles} className={appClassName}>
      <header ref="headerRef" style={this.state.headerStyles} className="app__header teal">
      <div className="container">
      <h1 className="white-text">Material Icon finder</h1>
      <p className="flow-text white-text">
      Find material icons based on crowd-sourced tags.<br />
      Found your icon? Help others by adding some meaningful tags to it.
      </p>
      <div>
      <Searchbar />
      </div>
      </div>
      </header>
      <div>
      <Icons />
      </div>
      <div className="panel-background" onClick={this.onDeselectIcon.bind(this)}></div>
      <IconPanel />
      </div>
    );
  }
}


const mapStateToProps = state => ({
  icons: state.iconsReducer.icons,
  activeIcons: state.iconsReducer.activeIcons,
  selectedIcon: state.iconsReducer.selectedIcon,
});
const mapActionsToProps = {
  onDeselectIcon: deselectIcon,
};

export default connect(
  mapStateToProps, mapActionsToProps)(App);
