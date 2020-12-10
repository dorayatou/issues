const createStore = (reducer) => {
    let state;
    let listeners = [];
    const getState = () => state;
    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
    };
    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        }
    };
    dispatch({});
    return { getState, dispatch, subscribe }
}

function reducer(state, action) {
    return Object.assign({}, state, { thingToChange });
    // return { ...state, ...newState };
}

let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
    console.log('dispatching', action);
    next(action);
    console.log('next state', store.getState());
}