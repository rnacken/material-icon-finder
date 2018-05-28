import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { deselectIcon, addIconTag, deleteTag } from './../../actions/iconsActions';
import IconDetails from './IconDetails/IconDetails.jsx';
import MaterializeCss from 'materialize-css';

import './IconPanel.css';

class IconPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingAllTags: false,
      newTag: '',
      addedTags: [],
    };
  }

  componentWillReceiveProps() {
    if (!this.props.selectedIcon) {
      // selected new icon, reset showingAllTags
      this.setState({ showingAllTags: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // scroll to top on update, unless newTag or showingallTags is updated
    let tagsDiff = 0;
    if (prevProps.selectedIcon && this.props.selectedIcon) {
      tagsDiff = Object.keys(this.props.selectedIcon.tags).length - Object.keys(prevProps.selectedIcon.tags).length;
    }
    if (prevState.newTag === this.state.newTag
            && prevState.showingAllTags === this.state.showingAllTags
            && tagsDiff === 0) {
      const node = ReactDOM.findDOMNode(this);
      node.scrollTop = 0;
    }
  }

  componentDidMount() {
    // Bind ESC key handler.
    window.onkeydown = this.listenForClose.bind(this);
  }

  listenForClose(e) {
    e = e || window.event;
    if (this.props.selectedIcon && (e.key === 'Escape' || e.keyCode === 27)) {
      this.props.deselectIcon();
    }
  }

  deselectIcon() {
    this.props.deselectIcon();
  }

  onNewTagChange(e) {
    const newTagValue = e.target.value;
    this.setState({ newTag: newTagValue });
  }

  submitNewTag(e) {
    e.preventDefault();
    const tag = this.state.newTag.toLowerCase().trim();
    if (!Object.keys(this.props.selectedIcon.tags).find(key => this.props.selectedIcon.tags[key] === tag)) {
      this.props.addIconTag(this.props.selectedIcon, tag);
      const newAddedTags = this.state.addedTags;
      newAddedTags.push({
        icon: this.props.selectedIcon,
        tag,
      });
      this.setState({
        newTag: '',
        addedTags: newAddedTags,
      });
    } else {
      // tag already exists
      const toastHTML = '<span>This tag already exists</span>';
      MaterializeCss.toast({ html: toastHTML });
    }
    this.refs.newTagRef.focus();
  }

  /**
     * Put suggestedTag into input field
     * @param {string} suggestedTag
     */
  addTagSuggestion(suggestedTag) {
    this.setState({ newTag: suggestedTag });
    this.refs.newTagRef.focus();
  }

  deleteTag(tagKey) {
    this.props.deleteTag(this.props.selectedIcon, tagKey);
  }

  showAllTags() {
    this.setState({ showingAllTags: true });
  }

  getTagSuggestions() {
    let tagSuggestions = this.props.searchHistory.reduce((total, suggestedTag) => {
      const tagExistsOnIcon = Object.keys(this.props.selectedIcon.tags).find(iconTagKey =>
        this.props.selectedIcon.tags[iconTagKey].toLowerCase().trim() === suggestedTag.toLowerCase().trim());
      if (!tagExistsOnIcon) {
        total.push(suggestedTag.toLowerCase().trim());
      }
      return total;
    }, []);
    tagSuggestions = tagSuggestions || [];
    const header = (tagSuggestions && tagSuggestions.length > 0) ? <h6>Suggestions:</h6> : null;
    const list = tagSuggestions.map(suggestedTag =>
      <span className="chip suggested-tag" key={suggestedTag} onClick={this.addTagSuggestion.bind(this, suggestedTag)}>{suggestedTag}</span>);
    return {
      header,
      list,
    };
  }

  getIconTags() {
    const iconTags = Object.keys(this.props.selectedIcon.tags).reverse().map((tagKey, i) => {
      if (this.state.showingAllTags || i < 10) {
        // check if user added this tag
        const tagAddedByUser = (this.state.addedTags.find(tagObj => (this.props.selectedIcon.name === tagObj.icon.name
                        && this.props.selectedIcon.tags[tagKey] === tagObj.tag)));
        const deleteBtn = (tagAddedByUser) ? <i className="icon-tag__close-btn material-icons" onClick={this.deleteTag.bind(this, tagKey)}>close</i> : null;
        let classNames = 'chip icon-tag lime';
        classNames += (tagAddedByUser) ? ' darken-1' : '';
        return (<div className={classNames} key={tagKey}>{this.props.selectedIcon.tags[tagKey]}{deleteBtn}</div>);
      }
      return null;
    });
    if (!this.state.showingAllTags && Object.keys(this.props.selectedIcon.tags).length > 10) {
      iconTags.push(<div className="chip icon-tag icon-tag--show-all lime lighten-2" onClick={this.showAllTags.bind(this)} key="more-icons-btn">{Object.keys(this.props.selectedIcon.tags).length - 10}&nbsp;more...</div>);
    }
    return iconTags;
  }

  render() {
    // only display panel when there is a selected icon
    if (this.props.selectedIcon) {
      const iconTags = this.getIconTags();
      const tagSuggestions = this.getTagSuggestions();
      return (
        <div className="icon-panel" ref="iconPanel">
          <section className="icon-panel__header teal">
            <i className="icon-panel__header__close-btn material-icons white-text" onClick={this.deselectIcon.bind(this)}>close</i>
            <IconDetails selectedIcon={this.props.selectedIcon} />
          </section>
          <section className="icon-panel__section">
            <h6>Tags</h6>
            <div className="icon-tags">{iconTags}</div>
          </section>
          <div className="icon-panel__section-divider" />
          <section className="icon-panel__section">
            <h6>Add extra tags for this icon</h6>
            <form action="" onSubmit={this.submitNewTag.bind(this)}>
              <div className="icon-panel__input-fieldset">
                <div className="input-field icon-panel__new-tag">
                  <i className="material-icons prefix">label</i>
                  <input
                    className="icon-panel__new-tag__input"
                    id="new-tag-input"
                    ref="newTagRef"
                    type="text"
                    value={this.state.newTag}
                    onChange={e => this.onNewTagChange(e)}
                  />
                  <label htmlFor="new-tag-input">New tag</label>
                </div>
                <button className="icon-panel__add-btn btn btn-primary" type="submit">Add</button>
              </div>
            </form>
            {tagSuggestions.header}
            {tagSuggestions.list}
          </section>
          <div className="icon-panel__section-divider" />
          <section className="icon-panel__section icon-panel__section--instructions">
            <h6>How to use</h6>
            <p className="text-grey">Follow the <a rel="noopener noreferrer" href="http://google.github.io/material-design-icons/" target="_blank">instructions</a> to embed the icon font in your site and learn how to style your icons using CSS.</p>
            <p className="text-grey">In HTML:</p>
            <code className="grey-text">
                            &lt;i class="material-icons"&gt;{this.props.selectedIcon.name}&lt;/i&gt;<br />
            </code>
            <p className="text-grey">In CSS:</p>
            <code className="grey-text">
                            your-icon:after {'{'}<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;position: absolute;<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;top: 0; left: 0;<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;font-family: "Material Icons";<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;content: &quot;\{this.props.selectedIcon.htmlCode}&quot;;<br />
              {'}'}<br />
            </code>
          </section>
        </div>
      );
    }
    return (<div className="icon-panel" ref="iconPanel" />);
  }
}


const mapStateToProps = state => ({
  selectedIcon: state.iconsReducer.selectedIcon,
  searchHistory: state.iconsReducer.searchHistory,
});
const mapActionsToProps = {
  deselectIcon,
  addIconTag,
  deleteTag,
};

export default connect(mapStateToProps, mapActionsToProps)(IconPanel);
