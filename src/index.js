var React = require('react');
var ReactDOM = require('react-dom');
var CounterList = require('./counter.js').CounterList;
var db = require('./db.js');
var state = require('./state.js');
//var freeze = require('deep-freeze');

/*
 * React ================================================
 */
const render = () => {
    state.logger();
    ReactDOM.render(
        <CounterList className="android-card-container mdl-grid" data={state.store.getState()} />,
        document.getElementById('root')
    );
};

// Subscribe to events and update DOM
state.store.subscribe(render);
// Do an inital render
render();
