var React = require('react');
var ReactDOM = require('react-dom');
var PouchDB = require('pouchdb');
var Line = require('./line.js');

/* Counters container
 * props: value <number>
 */
exports.CounterList = ({ data }) => {
    return (
      <div className="android-card-container mdl-grid">
        {data.map(counter => {
          if (counter.hits) {
            return <Counter className="demo-card-square mdl-card mdl-shadow--2dp" key={counter.serialNumber} data={counter} />;
          }
          // if there are no hits just render the blank counter
          return <p className="demo-card-square mdl-card mdl-shadow--2dp" key={counter.serialNumber}>Counter {counter.serialNumber}</p>;
        })}
      </div>
    );
};

/* Counter
 * props: value <number>
 */
const Counter = ({ data }) => (
    <div className="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp">
      <p class="mdl-card__media">
        <Line data={data.hits} />
      </p>

      <h4 className="mdl-card__title">Counter {data.serialNumber}</h4>

      <p class="mdl-card__supporting-text">
        The speed <em>(mph)</em> of {data.hits.length} vehicles averages {
          Math.round(data.hits.map(function(h) {
            return h.speed;
          })
          .reduce(function(a, b) {
            return a + b;
          },0) / data.hits.length)
        }.
      </p>

    </div>
);
