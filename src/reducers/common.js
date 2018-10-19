import {
    APP_LOAD,
    CHANGE_SUBREDDIT,
    CHANGE_PAGE
} from "../constants/actionTypes";

// Array of Subreddits
const subredditsOptions = [
    {
        value: 0,
        label: "alternativeart"
    },
    {
        value: 1,
        label: "pics"
    },
    {
        value: 2,
        label: "gifs"
    },
    {
        value: 3,
        label: "adviceanimals"
    },
    {
        value: 4,
        label: "cats"
    },
    {
        value: 5,
        label: "images"
    },
    {
        value: 6,
        label: "photoshopbattles"
    },
    {
        value: 7,
        label: "hmmm"
    },
    {
        value: 8,
        label: "all"
    },
    {
        value: 9,
        label: "aww"
    }
];

const defaultState = {
    appName: "Subreddits | Meesho",
    appLoaded: false,
    data: null,
    subreddits: subredditsOptions
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case APP_LOAD:
            return {
                ...state,
                appLoaded: true,
                pageIndex: 0
            };
        case CHANGE_SUBREDDIT:
            return {
                ...state,
                pageIndex: 0,
                data: action.payload
            };
        case CHANGE_PAGE:
            return {
                ...state,
                pageIndex: action.pageIndex
            };
        default:
            return state;
    }
};
