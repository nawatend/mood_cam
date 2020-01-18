import firebase from 'firebase'

let firebaseConfig = {
    apiKey: "AIzaSyB2nIdFcxQZoHq7SDVu6ZFXoGoha4rd7sc",
    authDomain: "mood-cam-13358.firebaseapp.com",
    databaseURL: "https://mood-cam-13358.firebaseio.com",
    projectId: "mood-cam-13358",
    storageBucket: "mood-cam-13358.appspot.com",
    messagingSenderId: "729945962881",
    appId: "1:729945962881:web:4469910e41ef69cad85080",
    measurementId: "G-3P3VE3831P"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);



export default firebaseApp