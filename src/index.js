var Redux = require('redux');
var PouchDB = require('pouchdb');
var db = new PouchDB('hits');
var remoteCouch = 'http://localhost:5984/data';

var view = document.getElementById('app');

/*
 * Redux action creators
 *
 * Use string literals for action types, no constants for actions
 * Use like: dispatch(addhit(hit));
 */
function addHit (hit) {
  return {
    type: 'ADD_HIT',
    hit // ES6 shorthand
  };
}

var initialState = {
    hits: []
};

// Redux reducer
function counterApp (state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    }
    switch (action.type) {
        case 'ADD_HIT':
            return Object.assign({}, state, {
                hits: action.hit
            });
        default:
            return state;
    }
}

// Redux store
var store = Redux.createStore(counterApp);
store.subscribe(function reduxUIUpdate () {
    var row = document.createElement('li');
    row.innerHTML = JSON.stringify(store.getState());
    view.appendChild(row);
});



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
    store.dispatch(addHit(result));
}

// Init
sync();
fetchDocs();
