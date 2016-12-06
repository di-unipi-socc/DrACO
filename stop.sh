#!/bin/sh

# Checking if script is being run as root
if [ $(id -u) -ne 0 ]; then
  echo
  echo "***********************************"
  echo "* This script must be run as root *"
  echo "***********************************"
  echo
  echo "Please issue 'sudo $0'"
  echo
  exit 0
fi

while read -r line
do
  pid="$line"
  echo "Killing process $pid.." 
  kill $pid 1>log/stop.log 2>log/stop-error.log
  echo "-> DONE"
done < "draco.pids.temp"

# Printing result message
echo "******************************"
echo "*  DrACO has been shutdown   *"
echo "******************************"
