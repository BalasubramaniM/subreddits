import NProgress from "nprogress";
import { ASYNC_START, ASYNC_END } from "./constants/actionTypes";

const promiseMiddleware = store => next => action => {
    if (isPromise(action.payload)) {
        NProgress.start();
        store.dispatch({ type: ASYNC_START, subtype: action.type });

        action.payload.then(
            res => {
                console.log("RESULT", res);
                action.payload = res;
                store.dispatch({ type: ASYNC_END, promise: action.payload });
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

function isPromise(v) {
    return v && typeof v.then === "function";
}

export { promiseMiddleware };
