import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectIcon } from './../../actions/iconsActions';

import './IconItem.css';

class IconItem extends Component {

    onSelectIcon(selectedIcon) {
        this.props.onSelectIcon(selectedIcon);
    }

    render() {
        return (
            <div className="icon-item col s4 m3 l2"
            onClick={this.onSelectIcon.bind(this, this.props.icon)}
            title={this.props.icon.name}>
                <i className="icon-item__icon material-icons">{this.props.icon.name}</i>
                <p className="icon-item__name grey-text">{this.props.icon.name}</p>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    icons: state.icons
});

const mapActionsToProps = {
    onSelectIcon: selectIcon
}

export default connect(mapStateToProps, mapActionsToProps)(IconItem);
