#!/bin/sh

while read -r line
do
  pid="$line"
  kill $pid
done < "draco.pids.temp"

echo "DrACO has been effectively shutdown". 
