var Redux = require('redux');
/*
 * Redux ================================================
 */
function logReduxState () {
  console.log('============= Redux state =============');
  console.log(JSON.stringify(store.getState()));
}
/*
 * Redux action creators
 *
 * Use string literals for action types, no constants for actions
 * Use like: dispatch(addhit(hit));
 */
// TODO consider Redux standard action: https://github.com/acdlite/flux-standard-action for later
function addHit (hit) {
  return {
    type: 'ADD_HIT',
    hit
  };
}

const initialState = {
    //TODO why does this need an empty object in it to work in the reducer?
    hits: []
};

// Redux reducer
function counterApp (state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    }
    switch (action.type) {
        case 'ADD_HIT':
            var collisions = state.hits.map(function (h) {
              //console.log('h', h);
              return h._id === action.hit._id;
            });
            var collided = collisions.reduce(function (prev, curr) {
              return prev || curr;
            }, "");
            if (collided) {
              return state;
            }
            return Object.assign({}, state, {
                 hits: state.hits.concat([action.hit])
            });
        default:
            return state;
    }
}

// Create Redux store
var store = Redux.createStore(counterApp, initialState);

// Expose module
exports.logger = logReduxState;
exports.addHit = addHit;
exports.store = store;
// Used in test
// TODO don't do this... maybe with actions module....
exports.reducer = counterApp;
