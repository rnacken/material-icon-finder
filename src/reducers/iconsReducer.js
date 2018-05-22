import {
    GET_ICONS,
    SELECT_ICON,
    DESELECT_ICON,
    UPDATE_ACTIVE_ICONS,
    UPDATE_SEARCH_HISTORY
} from '../actions/types';

const initialState = {
    icons: [],
    activeIcons: [],
    selectedIcon: null,
    searchHistory: [],
};

export default function(state = initialState, { type, payload }) {
    switch (type) {
        case GET_ICONS:
            const updatedSelectedIcon = (state.selectedIcon && state.selectedIcon.name)?
                payload.filter(icon => icon.name === state.selectedIcon.name)[0] : null;

            return {
                ...state,
                icons: payload,
                activeIcons: payload,
                selectedIcon: updatedSelectedIcon
            };
        case SELECT_ICON:
            return {
                ...state,
                selectedIcon: payload,
            };
        case DESELECT_ICON:
            return {
                ...state,
                selectedIcon: null,
            };
        case UPDATE_ACTIVE_ICONS:
            return {
                ...state,
                activeIcons: payload,
            }
        case UPDATE_SEARCH_HISTORY:
            return {
                ...state,
                searchHistory: payload,
            }
        default:
            return state;

    }
}
