#!/bin/bash
# 4-8 hours
COUNTER=14400
TIME=3
until [  $COUNTER -lt 1 ]; do
    echo '{"time":' $COUNTER ',"speed":3}'
    # curl the thing we want
    curl -sX POST localhost:5984/data -H "content-type: application/json" -d '{"time":"'$COUNTER'","speed":3}'
    let COUNTER-=1
    sleep $TIME
done
