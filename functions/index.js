// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

// Import the Dialogflow module and response creation dependencies from the
// Actions on Google client library.
const { dialogflow, Permission, Suggestions } = require("actions-on-google");

const axios = require("axios");

const express = require("express");

// Import the firebase-functions package for deployment.
const functions = require("firebase-functions");

// Instantiate the Dialogflow client.
// const app = dialogflow({ debug: true });

const app = express();
// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'
app.intent("favorite color", (conv, { color }) => {
  const luckyNumber = color.length;
  const audioSound =
    "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg";
  if (conv.data.userName) {
    // If we collected user name previously, address them by name and use SSML
    // to embed an audio snippet in the response.
    conv.close(
      `<speak>${conv.data.userName}, your lucky number is ` +
        `${luckyNumber}.<audio src="${audioSound}"></audio></speak>`
    );
  } else {
    conv.close(
      `<speak>Your lucky is not number is ${luckyNumber}.` +
        `<audio src="${audioSound}"></audio></speak>`
    );
  }
});

app.intent("Default Welcome Intent", (conv) => {
  conv.ask(
    "Would you like to rate your pain level today?Hear your pain rating from yesterday? Hear a pain report? Or set up reminders?"
  );
  conv.ask(
    new Suggestions("rate my pain", "hear my pain rating", "pain report")
  );
});

//Hande the DialogFlow intent named 'Rate Pain Level - custom'.
app.intent("Rate Pain Level - custom", (conv, { number }) => {
  if (number < 1 || number > 10) {
    conv.ask("Please enter number greater than 1 and less than 10");
    conv.ask(new Suggestions("1", "5", "9"));
  } else {
    conv.ask(
      `Your pain is rated as number ${number} - to input your goals say todays goals, to hear a pain report say listen to pain report or say stop`
    );
    axios
      .post("https://painmonitoring.herokuapp.com/save", {
        painlevel: number,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});

//Handlethe DialogFlow intent named 'Exit conversation'.
app.intent("Exit conversation", (conv) => {
  conv.close("Okay, talk to you next time!");
});

// Handle the Dialogflow intent named 'Default Welcome Intent'.
// app.intent('Default Welcome Intent', (conv) => {
//   conv.ask(new Permission({
//     context: 'Hi there, to get to know you better',
//     permissions: 'NAME'
//   }));
// });

//Handle the DialogFLow intent named 'Rate Pain Level'.
app.intent("Rate Pain Level", (conv) => {
  conv.ask(
    "Rate your pain between 1 and 10 with 10 being the highest and 1 being the lowest. or say i dont feel any pain today"
  );
  conv.ask(new Suggestions("1", "5", "9"));
});

app.intent("Listen to report", (conv) => {
  conv.ask(
    "Your average pain level last week was $number, your average pain level last month was 2. You are improving!!! "
  );
  conv.ask(
    "To listen to your pain rating from yesterday say, 'listen to rating', to record pain say 'rate my pain'. To exit say 'google stop'"
  );
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

// exports.app = functions.https.onRequest(app);
