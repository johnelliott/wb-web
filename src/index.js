var React = require('react');
var ReactDOM = require('react-dom');
var state = require('./state.js');
var PouchDB = require('pouchdb');
var db = new PouchDB('hits');
var Line = require('./line.js');
// TODO such bad, very hack....?
var remoteCouch = new PouchDB(document.URL + 'api');
PouchDB.debug.enable('*');
window.PouchDB = PouchDB;
//var freeze = require('deep-freeze');

/*
 * React ================================================
 */
const render = () => {
    state.logger();
    ReactDOM.render(
        <CounterList data={state.store.getState()} />,
        document.getElementById('root')
    );
};

/*
 * React components
 */

/* Counters container
 * props: value <number>
 */
const CounterList = ({ data }) => {
    return (
      <div>
        {data.map(counter => {
          if (counter.hits) {
            return <Counter key={counter.serialNumber} data={counter} />;
          }
          // if there are no hits just render the blank counter
          return <p key={counter.serialNumber} className="subtitle">Counter {counter.serialNumber}</p>;
        })}
      </div>
    );
};

/* Counter
 * props: value <number>
 */
const Counter = ({ data }) => (
    <div>
        <p className="subtitle">Counter {data.serialNumber}</p>
        <p>The speed <em>(mph)</em> of {data.hits.length} vehicles <Line data={data.hits} /> averages {
          Math.round(data.hits.map(function(h) {
            return h.speed;
          })
          .reduce(function(a, b) {
            return a + b;
          },0) / data.hits.length)
        }.</p>
    </div>
);

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


// Subscribe to events and update DOM
state.store.subscribe(render);
// Do an inital render
render();

// Init
sync();
fetchDocs();
