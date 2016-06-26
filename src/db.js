var PouchDB = require('pouchdb');
var state = require('./state.js');
var db = new PouchDB('hits');
// TODO such bad, very hack....? YES document.url KILLED AN HOUR OF MY TIME
var remoteCouch = new PouchDB('http://localhost:8080' + 'api');
PouchDB.debug.enable('*');
// PouchDB stuff
db.changes({
    since: 'now',
    live: true
}).on('change', fetchDocs);

// Local data store methods
function sync () {
    console.log('syncing');
    var opts = {live: true};
    db.replicate.from(remoteCouch, opts, function syncErrorLogger (err) {
          console.log('syncing error ' + err);
    });
}
function fetchDocs() {
    db.allDocs({include_docs: false, descending: true}, function(err, doc) {
        if (err) {
          console.error(err);
          return err;
        }
        updateUI(doc.rows);
    });
}

// View stuff
// TODO, call only once instead of for every hit, then have redux process the state changes appropriately
function updateUI (data) {
    data.forEach(function(doc) {
        // fetch from pouch
        db.get(doc.id, sendToRedux);
    });
}

// TODO should this go in the redux module?
function sendToRedux (err, result) {
    if (err) {
        console.error(err);
    }
    //TODO this is just temp because safari sucks...
    state.store.dispatch(state.addCounter(result));
    state.store.dispatch(state.addHit(result));
}

// Init
sync();
fetchDocs();
