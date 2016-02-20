var test = require('tape');
var freeze = require('deep-freeze');
var reducer = require('../src/state').reducer;
var addHit = require('../src/state').addHit;

test('verify test setup', function(t) {
  t.plan(1);
  const a = 1;
  t.equal(a, 1);
});

test('Initial add hit', function(t) {
  t.plan(1);
  const stateBefore = {hits: []};
  const stateAfter = {
    hits: [{yo: 'potle'}]
  };
  freeze(stateBefore);
  t.deepEqual(reducer(stateBefore, {type: 'ADD_HIT', hit: {yo: 'potle'}}), stateAfter);
});

test('don\'t add duplicate hit', function(t) {
  t.plan(1);
  const stateBefore = {
    hits: [{_id: 'potle'}]
  };
  const stateAfter = {
    hits: [{_id: 'potle'}]
  };
  freeze(stateBefore);
  t.deepEqual(reducer(stateBefore, {type: 'ADD_HIT', hit: {_id: 'potle'}}), stateAfter);
});

test('don\'t add anything for bad action type', function(t) {
  t.plan(1);
  const stateBefore = {
    hits: [{_id: 'potle'}]
  };
  const stateAfter = {
    hits: [{_id: 'potle'}]
  };
  freeze(stateBefore);
  t.deepEqual(reducer(stateBefore, {type: 'BAZ', hit: {_id: 'potle'}}), stateAfter);
});
