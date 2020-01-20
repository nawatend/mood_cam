import db from './../Firebase';
import {Bar, Line, Pie} from 'react-chartjs-2';
import React, { useState, useEffect, Component } from 'react';

export default function Person(){
    let dateArray="";

    function makeData(){

        db.database().ref("objects").on('value', function (snapshot) {
            let amountPersons=0;

            let dates = snapshot.val();
            dateArray = Object.keys(dates)
            
            for(let i = 0; i<dateArray.length; i++){
                db.database().ref(`objects/${dateArray[i]}/person/totalPerson`).on('value',function(snapshot){
                    amountPersons = amountPersons + snapshot.val()
                })   
                document.getElementById('amount').innerHTML = amountPersons
            }
        })
    }

    useEffect(() => {
        makeData()
    }, [])

    return(
        <div>
            <h2 id="amount"></h2>
            <h3>Persons detected</h3>
        </div>
    )
}