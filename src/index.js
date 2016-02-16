var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');
var PouchDB = require('pouchdb');
var db = new PouchDB('hits');
var Sparkline = require('sparklines');
var remoteCouch = 'http://localhost:5984/data';
var freeze = require('deep-freeze');

/*
 * React ================================================
 */
const render = () => {
    logReduxState();
    ReactDOM.render(
        <Counter data={store.getState()} />,
        document.getElementById('root')
    );
};

/*
 * React components
 */

/* Counter
 * props: value <number>
 */
const Counter = ({ data }) => (
    <div>
        <p className="subtitle">Counter component</p>
        <p>Hits count: {data.hits.length}</p>
        <p>Line: <Line data={data.hits} /></p>
    </div>
);
/*
 * Sparkline
 * TODO make this work as part of react rendering instead of outside..
 */
const Line = React.createClass({
   draw: function(props) {
    var lineData = props.data.map(function(point) {
      return point.speed;
    });
    //console.log('lineData ' + lineData);
    var node = ReactDOM.findDOMNode(this);
    var line = new Sparkline(node, {width: 200, height: 50});
    //console.log('line', line);
    line.draw(lineData);
  },
  componentDidMount: function() {
    this.draw(this.props);
  },
  shouldComponentUpdate: function () {
    return false;
  },
  componentWillReceiveProps: function(nextProps) {
    //console.log('i will get props', nextProps);
    if (this.props.data !== nextProps.data) {
      this.draw(nextProps);
    }
  },
  render: function() {
    return ( <span></span> );
  }
});
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
            //            console.log('action hit', action.hit);
            //            // guard against initial state
            //            if (!state.hits.length) {
            //              return Object.assign({}, state, {
            //                hits: state.hits.concat([action.hit])
            //              });
            //            }
            //            var newHit = false;
            //            var updatedHits = state.hits.map(function(hit) {
            //              console.log(' hit', hit);
            //              if (hit._id === action.hit._id) {
            //                return hit;
            //              }
            //              console.log(action.hit);
            //              return action.hit;
            //            });
            //            console.log('updatedHits', updatedHits);
            return Object.assign({}, state, {
              hits: state.hits.concat([action.hit])
            });
        default:
            return state;
    }
}


// TESTS

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
// TODO, call only once instead of for every hit, then have redux process the state changes appropriately
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


// Subscribe to events and update DOM
store.subscribe(render);
// Do an inital render
render();

// Init
sync();
fetchDocs();
