var PouchDB = require('pouchdb');
var db = new PouchDB('hits');
var remoteCouch = 'http://localhost:5984/data';

var view = document.getElementById('app');

function sync () {
    console.log('syncing');
    var opts = {live: true};
    //db.replicate.to(remoteCouch, opts, syncError);
    db.replicate.from(remoteCouch, opts, syncError);
}

db.changes({
  since: 'now',
  live: true
}).on('change', showTodos);

function showTodos() {
  db.allDocs({include_docs: false, descending: true}, function(err, doc) {
      updateUI(doc.rows);
    });
}

function updateUI (data) {
    data.forEach(function(doc) {
        // fetch from pouch
        db.get(doc.id, appendToDOM);
    });
}

function appendToDOM (err, result) {
    if (err) {
        console.error(err);
    }
    var docRow = document.createElement('li');
    docRow.innerHTML = JSON.stringify(result);
    app.appendChild(docRow);
}


function syncError (err) {
    console.log('syncing error ' + err);
}

sync();
showTodos();
