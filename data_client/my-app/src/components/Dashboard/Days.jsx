import db from './../Firebase';
import {Bar, Line, Pie} from 'react-chartjs-2';
import React, { useState, useEffect, Component } from 'react';

export default function Days(){
    const [amountDays, setAmountDays] = useState("");


    function makeData(){
        db.database().ref("objects").on('value', function(snapshot) {
            let dates = snapshot.val()
            let dateArray = Object.keys(dates)
            setAmountDays(dateArray.length)
        })
    }

    useEffect(() => {
        makeData()
    }, [])

    return(
        <div>
        <h2 className="number">{amountDays}</h2>
        <h3 className="description">Days with data</h3>
        </div>
    )
}