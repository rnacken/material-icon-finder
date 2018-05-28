/* global gtag */
import { GET_ICONS, SELECT_ICON, DESELECT_ICON, UPDATE_ACTIVE_ICONS, UPDATE_SEARCH_HISTORY } from './types';
import { database } from '../firebase';

//const iconsList = require('./../assets/data/material-icons-list.json');

export const getIcons = () => (dispatch) => {
  database.on('value', (data) => {
    fetch('https://raw.githubusercontent.com/google/material-design-icons/master/iconfont/codepoints')
    .then(resp => resp.text())
    .then(iconListText => {
      const iconsList = iconListText.split(/\r\n|\n|\r/); // split on newline

      const allIcons = iconsList.map((icon, i) => {
        const iconProps = icon.split(' ');

        const firebaseIcons = data.val();
        const iconWithTags = [];
        if (firebaseIcons && Object.keys(firebaseIcons).length) {
          Object.keys(firebaseIcons).map((iconKey) => {
            if (firebaseIcons[iconKey].name === iconProps[0]) {
              firebaseIcons[iconKey].firebaseKey = iconKey;
              iconWithTags.push(firebaseIcons[iconKey]);
            }
            return iconKey;
          });
        }
        return {
          firebaseKey: (iconWithTags.length) ? iconWithTags[0].firebaseKey : null,
          name: iconProps[0],
          htmlCode: iconProps[1],
          tags: (iconWithTags.length) ? iconWithTags[0].tags : [],
        };
      });
      dispatch({
        type: GET_ICONS,
        payload: allIcons,
      });
    });
  });
};

export const selectIcon = selectedIcon => (dispatch) => {
  // send ga event
  gtag('event', 'Icon', {
    event_category: 'click',
    event_label: selectedIcon.name,
  });
  dispatch({
    type: SELECT_ICON,
    payload: selectedIcon,
  });
};

export const deselectIcon = () => (dispatch) => {
  dispatch({
    type: DESELECT_ICON,
    payload: null,
  });
};

export const updateActiveIcons = activeIcons => (dispatch) => {
  dispatch({
    type: UPDATE_ACTIVE_ICONS,
    payload: activeIcons,
  });
};

export const updateSearchHistory = searchHistory => (dispatch) => {
  // send ga event
  gtag('event', 'search', {
    search_term: searchHistory[0] || '',
  });
  dispatch({
    type: UPDATE_SEARCH_HISTORY,
    payload: searchHistory,
  });
};

export const addIconTag = (icon, tag) => (dispatch) => {
  tag = tag.toLowerCase().trim();
  if (Object.keys(icon.tags).filter(tagKey => icon.tags[tagKey].toLowerCase().trim() === tag).length === 0) {
    if (icon.firebaseKey) {
      database.child(`${icon.firebaseKey}/tags`).push(tag);
    } else {
      // create new icon item in database
      icon.firebaseKey = database.push({
        name: icon.name,
      }).key;
      database.child(`${icon.firebaseKey}/tags`).push(tag);
    }
  } else {
    // tag already on icon
  }
};

export const deleteTag = (icon, tagKey) => (dispatch) => {
  database.child(`${icon.firebaseKey}/tags/${tagKey}`).remove();
};
