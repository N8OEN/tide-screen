////////////////////// SETUP ////////////////////
// import all the crap I need
import * as messaging from "messaging";
import clock from "clock";
import document from "document";
import { inbox } from "file-transfer";
import * as fs from "fs";
import { me as device } from "device";

let myLabel = document.getElementById("myLabel");
let dayed = document.getElementById("dayed");
let side = document.getElementById('side');
// make a global variable for tide predictions (EW)
let globalTides;

////////////////// CLOCKY BITs /////////////////////////////
// Update the clock every minute
clock.granularity = "minutes";

// function for the clocky bit
function updateClock(today) {
  // AM/PM
  side.text = today.getHours() >= 12 ? 'PM' : 'AM';
  // hours and minutes
  myLabel.text = `${today.getHours() % 12 || 12}:${zeroPad(today.getMinutes())}`;
  // day of the week and date
  dayed.text = `${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][today.getDay()]} ${zeroPad(today.getDate())}`;
};

// Ask for new data every 24 hours
setInterval(fetchTides, 24*60*60*1000)

console.log("App Started");

// Event occurs when new file(s) are received
inbox.onnewfile = () => {
  console.log("New file!");
  // sniffFiles()
  let fileName;
  do {
    // If there is a file, move it from staging into the application folder
    fileName = inbox.nextFile();
    if (fileName == 'tides.txt') {
      let data = fs.readFileSync(fileName, "utf-8");
      fs.writeFileSync(fileName, data, "utf-8");
    }
  } while (fileName);
  // sniffFiles()
  // parseFiles()
};


////////////////// MESSAGING BIT (ASK FOR TIDES) ////////////////
// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Fetch weather when the connection opens
  fetchTides();
}

// gimme my tides!
function fetchTides() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'tides'
    });
  }
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
    var today = new Date()
    fs.writeFileSync("msgTides.txt", JSON.stringify(evt.data), "utf-8");
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

// do something with them
function processTideData(data) {
  console.log("The tide array is: " + data);
  fs.writeFileSync("tides.txt", JSON.stringify(data), "utf-8");
}