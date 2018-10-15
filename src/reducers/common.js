import { APP_LOAD, CHANGE_SUBREDDIT } from "../constants/actionTypes";

const defaultState = {
    appName: "Subreddits | Meesho",
    appLoaded: false,
    data: null
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case APP_LOAD:
            return {
                ...state,
                appLoaded: true
            };
        case CHANGE_SUBREDDIT:
            return {
                ...state,
                data: action.payload
            };
        default:
            return state;
    }
};
