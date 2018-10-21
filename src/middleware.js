import NProgress from "nprogress";
import { ASYNC_START, ASYNC_END } from "./constants/actionTypes";

/**
 * Promise Middleware.
 * Request API and send response back.
 */
const promiseMiddleware = store => next => action => {
    if (isPromise(action.payload)) {
        store.dispatch({ type: ASYNC_START, subtype: action.type });

        NProgress.start();
        action.payload(action.key).then(
            res => {
                console.log("RESULT", res);
                action.payload = res;
                window.localStorage.setItem(action.key, JSON.stringify(res));
                store.dispatch({
                    type: ASYNC_END,
                    promise: action.payload
                });
                store.dispatch(action);
                NProgress.done();
            },
            error => {
                console.log("ERROR", error);
                action.error = true;
                action.payload = error.response.body;
                store.dispatch({
                    type: ASYNC_END,
                    promise: action.payload
                });
                store.dispatch(action);
                NProgress.done();
            }
        );
        return;
    }
    next(action);
};

/**
 * Local Storage Middleware.
 * Check for any data in local storage with respect to subreddit and if data exist, return the data.
 */
const localStorageMiddleware = store => next => action => {
    let data = window.localStorage.getItem(action.key);

    if (data !== null) {
        action.payload = JSON.parse(data);
    }
    next(action);
};

/**
 * Function to check whether given payload is fuction.
 * @return {Boolean}   [Return whether given value Function or not.]
 */
function isPromise(v) {
    return v && typeof v === "function";
}

export { promiseMiddleware, localStorageMiddleware };
