import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIcons } from './../../actions/iconsActions';
import IconItem from './../IconItem/IconItem';

import './Icons.css';

class Icons extends Component {
    componentWillMount() {
        this.props.getIcons();
    }

    render() {
        let iconItems;
        if (this.props.activeIcons) {
            iconItems = this.props.activeIcons.map(icon => {
                return <IconItem key={icon.name} icon={icon} />
            });
        }
        return (
            <div className="icons container--wide">
                <h3>Icons</h3>
                <div className="row">{iconItems}</div>
            </div>
        );
    }
}

Icons.propTypes = {
    getIcons: PropTypes.func.isRequired,
    activeIcons: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    activeIcons: state.iconsReducer.activeIcons,
});
const mapActionsToProps = {
    getIcons,
}

export default connect(mapStateToProps, mapActionsToProps)(Icons);
// export default connect(state => ({
//     activeIcons: state.iconsReducer.activeIcons
// }), { getIcons })(Icons);
