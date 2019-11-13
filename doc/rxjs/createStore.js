
//数据存储
//数据处理
export default function createStore(reducer, initState) {
    const listeners = [];
    const dispatcher$ = new Rx.Subject();
    function callListeners() {
        listeners.forEach(listener => listener());
    }

    function subscribe(listener) {
        listeners.push(listener);
        return function unsubscribe() {
            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        };
    }

    function reduce(action) {
        state = currentReducer(state, action);
        return state;
    }


    return {
        state$,
        dispatcher$,
        getState: () => state,
        dispatch,
        subscribe,
        getReducer: () => currentReducer,
        replaceReducer
    };

}