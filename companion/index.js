import * as messaging from "messaging";
import { outbox } from "file-transfer";
import { settingsStorage } from "settings";

/////////////////// STARTUP SEQUENCE //////////////////
console.log("Companion Started");

function getIDs() {
  let IDs = []
  try {
    IDs = [JSON.parse(settingsStorage.getItem("regionInput")).selected, JSON.parse(settingsStorage.getItem("stationInput")).name]
  } catch (e) { IDs = [0, 9414290] }
  return IDs
}

// MAKE THE URL TO GO FETCH
function urlMaker(stationID, dataBase) {
  var today = new Date();
  if (dataBase == 'NOAA') {
    var url = "https://tidesandcurrents.noaa.gov/api/datagetter?begin_date=" + today.getFullYear().toString() + zeroPad(today.getMonth()+1) + zeroPad(today.getDate()) + '&range=196&station=' + stationID + '&product=predictions&datum=mllw&units=english&time_zone=lst_ldt&application=web_services&format=json&interval=hilo'
  } else if (dataBase == 'UKHO') {
    var url = "https://admiraltyapi.azure-api.net/uktidalapi/api/V1/Stations/" + stationID + "/TidalEvents"
  }
  return url 
}

function fetchTides() {
var keyHead = new Headers();
    keyHead.append("Ocp-Apim-Subscription-Key", "638e199a78db49faa9b743ed6ecc2bc1");
    let initObject = {
      headers: keyHead
    };
    fetch(urlMaker('0515', 'UKHO'), initObject)
    .then(function (response) {
      console.log(response.status)
        response.json()
        .then(function(data) {
          // build tide array
          var tides = []
          for (let i = 0; i < data.length; i++) {
            // console.log(data[i].DateTime)
            // year, month, day, hour, minute
            let u = data[i].DateTime.slice(0,16)
            // add L for low tide or H for high tide
            if (data[i].EventType == 'LowWater') {
              tides.push(u + 'L');
            } else if (data[i].EventType == 'HighWater') {
              tides.push(u + 'H');
            } else if (data[i].DateTime == "string") {
              tides.push(u + 'DT');
            } else if (data[i].Height == 0.0) {
              tides.push(u + 'Hm')
            };
          };
          if (requested == true) { // send via messaging if the app requested it
            returnTideData(tides);
          } else {
            sendTides(tides);
          }
        }); 
      })
    .catch(function (err) {
      settingsStorage.setItem("error", 1);
      console.log("Error fetching tides: " + err);
    });
  }

//////////////////// FILE TRANSFER BIT //////////////
function sendTides(data) {
  var single = JSON.stringify(data);
  let uint = new Uint8Array(single.length);
  for(var i=0,j=single.length;i<j;++i){
    uint[i]=single.charCodeAt(i);
  }
  outbox.enqueue("tides.txt", uint);
}

//////////////////// MESSAGING BIT //////////////////
// Listen for messages from the device, and activate a tide fetch
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "tides") {
    // The device requested tide data
    fetchTides(getIDs()[0],getIDs()[1], true)
  }
}

// Send tide array to the device
function returnTideData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}