import React from 'react';
import db from './../components/Firebase.jsx';

export default function Object() {
    let data = db.database().ref("objects/16-01-2020");
    data.on('value', function (snapshot) {
        console.log(snapshot.val())

    })
    return (
        <div>
            <h1>Object page</h1>
            <p>Here you can see all objects that are detected in total!</p>
        </div>
    )
}