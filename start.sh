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

# Creating logging folder
mkdir -p log

# Setting mongodb
echo "Updating mongodb"
mongoimport --db DrACO_DB --collection offerings --drop --file data/offerings.json 1>/dev/null 2>log/mongoimport.log 
echo "-> DONE!"
echo ""

# Building REST API
echo "Building REST API"
cd discoverer
mvn clean install -l ../log/rest-api-mvn.log
cd ..
echo "-> DONE!"
echo ""

# Starting REST API 
echo "Starting REST API.."
java -jar discoverer/target/discoverer-0.8.0-SNAPSHOT.jar server discoverer/discovererconf.yml 1>log/rest-api.log 2>log/rest-api-error.log &
REST_API_PID=$!
echo "-> DONE! (PID=$REST_API_PID)"
echo ""
echo $REST_API_PID >> draco.pids.temp

# Configuring nodejs server
echo "Configuring nodejs server"
cd discoverer-gui
npm install 1>../log/npm-install.log 2>../log/npm-install-error.log
cd ..
echo "-> DONE!"
echo ""

# Starting nodejs server
echo "Starting gui on nodejs server"
nodejs discoverer-gui/index.js 1>log/gui.log 2>log/gui-error.log &
NODEJS_PID=$!
echo "-> DONE! (PID=$NODEJS_PID)"
echo ""
echo $NODEJS_PID >> draco.pids.temp

# Printing result message
echo "******************************"
echo "*  DrACO is up and running!  *"
echo "******************************"
