var React = require('react');
var ReactDOM = require('react-dom');
var state = require('./state.js');
var PouchDB = require('pouchdb');
var db = new PouchDB('hits');
var Sparkline = require('sparklines');
var remoteCouch = 'http://localhost:5984/data';
//var freeze = require('deep-freeze');

/*
 * React ================================================
 */
const render = () => {
    //state.logger();
    ReactDOM.render(
        <Counter data={state.store.getState()} />,
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
        <p className="subtitle">Counter 1</p>
        <p>The speed <em>(mph)</em> of {data.hits.length} vehicles <Line data={data.hits} /> averages {
          data.hits.map(function(h) {
            return h.speed;
          })
          .reduce(function(a, b) {
            return a + b;
          },0) / data.hits.length
        }.</p>
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
    var line = new Sparkline(node, {width: 100, height: 20});
    console.log('line', line);
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

// PouchDB stuff
db.changes({
    since: 'now',
    live: true
}).on('change', fetchDocs);

// Local data store methods
function sync () {
    console.log('syncing');
    var opts = {live: true};
    //db.replicate.to(remoteCouch, opts, syncErrorLogger);
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
    if (!result.hit) {
      state.store.dispatch(state.addHit(result));
    }
}


// Subscribe to events and update DOM
state.store.subscribe(render);
// Do an inital render
render();

// Init
sync();
fetchDocs();
