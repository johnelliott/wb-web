#!/bin/bash
# 4-8 hours
COUNTER=14400
TIME=3
until [  $COUNTER -lt 1 ]; do
    let SPEED=$[($RANDOM % 100) +1 ]
    echo $RANDOM % 10
    echo '{"time":' $COUNTER ',"speed":' $SPEED'}'
    # curl the thing we want
    curl -sX POST localhost:5984/data -H "content-type: application/json" -d '{"time":"'$COUNTER'","speed":'$SPEED'}'
    let COUNTER-=1
    sleep $TIME
done
