import * as firebase from 'firebase';


var firebaseConfig = {
    apiKey: "AIzaSyB2nIdFcxQZoHq7SDVu6ZFXoGoha4rd7sc",
    authDomain: "mood-cam-13358.firebaseapp.com",
    databaseURL: "https://mood-cam-13358.firebaseio.com",
    projectId: "mood-cam-13358",
    storageBucket: "mood-cam-13358.appspot.com",
    messagingSenderId: "729945962881",
    appId: "1:729945962881:web:fa069f87b7c1037fd85080",
    measurementId: "G-EMYRPZF0D4"
  };

firebase.initializeApp(firebaseConfig)
const db = firebase

export default db