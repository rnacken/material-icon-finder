import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateActiveIcons, updateSearchHistory } from './../../actions/iconsActions';
import utils from './../../utils';

import './Searchbar.css';

class Searchbar extends Component {

    saveQueryDebounce = utils.debounce(this.saveQuery, 500);

    constructor(props) {
        super(props);
        this.state = {
            query: ''
        };
    }

    updateResult(e) {
        e.persist();
        const query = e.target.value;
        // save query (debounced) on callback
        this.setState({query}, this.saveQueryDebounce(query));

        // get new active icons
        let activeIcons = this.props.icons.filter(icon => {
            let allTags = JSON.parse(JSON.stringify(icon.tags));    // clone obj
            allTags['icon-name'] = icon.name;    // add name of icon as well
            const matchedTags = Object.keys(allTags).filter(tagKey => utils.matchTag(query, allTags[tagKey]));
            return matchedTags.length > 0;
        })
        this.props.updateActiveIcons(activeIcons);
    }

    saveQuery() {
        const query = this.state.query;
        if (query && query !== ''){
            let searchHistory = this.props.searchHistory;
            searchHistory = searchHistory.filter(q => query.toLowerCase() !== q.toLowerCase()); // filter out doubles
            if (query.indexOf(searchHistory[0]) > -1) {
                // if first history item is actually part of current query
                searchHistory.shift();
            }
            searchHistory.unshift(query);
            this.props.updateSearchHistory(searchHistory);
        }
    }

    /**
     * Empty query, reset focus
     */
    resetSearchbar() {
        this.setState({query: ''});
        this.refs.query.focus();
    }

    render() {
        return (
            <div className="searchbar">
            <input className="searchbar__input browser-default" autoFocus type="text" value={this.state.query} ref="query" placeholder="Search icon tags" onChange={e => this.updateResult(e)} />
            <i className="searchbar__reset-btn material-icons" onClick={this.resetSearchbar.bind(this)}>close</i>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    icons: state.iconsReducer.icons,
    searchHistory: state.iconsReducer.searchHistory,
})
const mapActionsToProps = {
    updateActiveIcons,
    updateSearchHistory,
};

export default connect(mapStateToProps, mapActionsToProps)(Searchbar);
