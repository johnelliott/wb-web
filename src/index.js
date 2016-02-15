var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');
var PouchDB = require('pouchdb');
var db = new PouchDB('hits');
var remoteCouch = 'http://localhost:5984/data';

var view = document.getElementById('app');

/*
 * React ================================================
 */
const render = () => {
    ReactDOM.render(
        <Counter hits={store.getState()} />,
        document.getElementById('root')
    );
};

/*
 * React components
 */

/* Counter
 * props: value <number>
 */
const Counter = ({ hits }) => (
    <div>
        <p className="subtitle">Counter component</p>
        <p>Hits: {hits.hits}</p>
    </div>
);

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
function addHit () {
  return {
    type: 'ADD_HIT'
  };
}

var initialState = {
    //TODO why does this need an empty object in it to work in the reducer?
    hits: 0
};

// Redux reducer
function counterApp (state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    }
    switch (action.type) {
        case 'ADD_HIT':
            var newState = {
                hits: state.hits + 1
            };
            logReduxState();
            return newState;
        default:
            return state;
    }
    //logReduxState();
}

// Create Redux store
var store = Redux.createStore(counterApp, initialState);

// PouchDB stuff
db.changes({
    since: 'now',
    live: true
}).on('change', fetchDocs);

// Local data store methods
function sync () {
    console.log('syncing');
    var opts = {live: true};
    //db.replicate.to(remoteCouch, opts, syncError);
    db.replicate.from(remoteCouch, opts, syncError);
}
function fetchDocs() {
    db.allDocs({include_docs: false, descending: true}, function(err, doc) {
        updateUI(doc.rows);
    });
}
//TODO kill this function and change to console.error or something
function syncError (err) {
    console.log('syncing error ' + err);
}

// View stuff
function updateUI (data) {
    data.forEach(function(doc) {
        // fetch from pouch
        db.get(doc.id, sendToRedux);
    });
}

function sendToRedux (err, result) {
    if (err) {
        console.error(err);
    }
    store.dispatch(addHit());
}


// Subscribe to events and update DOM
store.subscribe(render);
// Do an inital render
render();

// Init
sync();
fetchDocs();
