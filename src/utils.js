import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

function xhrFetch(url, options = {}) {
  return fetch(url, options);
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate, ...args) {
  let timeout;
  return function () {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// match tag
function matchTag(query, tag) {
  // needs to be 2 strings
  if (typeof query === 'string' && typeof tag === 'string') {
    const queryClean = query.replace(/[\W_]+/g, '').toLowerCase();
    const tagClean = tag.replace(/[\W_]+/g, '').toLowerCase();
    return tagClean.indexOf(queryClean) > -1;
  }
  return false;
}

// update an object in an array
function updateObjectInArray(array, action) {
  return array.map((item, index) => {
    if (index !== action.index) {
      // This isn't the item we care about - keep it as-is
      return item;
    }

    // Otherwise, this is the one we want - return an updated value
    return {
      ...item,
      ...action.item,
    };
  });
}

export default {
  xhrFetch,
  debounce,
  matchTag,
  updateObjectInArray,
};
