import NProgress from "nprogress";
import { ASYNC_START, ASYNC_END } from "./constants/actionTypes";

const promiseMiddleware = store => next => action => {
    if (isPromise(action.payload)) {
        store.dispatch({ type: ASYNC_START, subtype: action.type });

        const data = window[action.key];
        if (!data) {
            NProgress.start();
            action.payload(action.key).then(
                res => {
                    console.log("RESULT", res);
                    action.payload = res;
                    window[action.key] = res;
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
        } else {
            action.payload = data;
            store.dispatch(action);
        }

        return;
    }

    next(action);
};

function isPromise(v) {
    return v && typeof v === "function";
}

export { promiseMiddleware };
