import db from './../Firebase';
import {Bar, Line, Pie} from 'react-chartjs-2';
import React, { useState, useEffect, Component } from 'react';

export default function Days(){


    function makeData(){
        db.database().ref("objects").on('value', function(snapshot) {
            let dateArray = "";
            let allMoodTypes = [];
            let somdata = 0;
            let dates = snapshot.val()
            let totalHappiness = 0;
            dateArray = Object.keys(dates)

            for(let i = 0; i<dateArray.length; i++){
                db.database().ref(`objects/${dateArray[i]}/person`).on('value', function (snapshot) {
                    let moodType = Object.keys(snapshot.val());
                    for(let j = 0; j< moodType.length; j++){
                        if((allMoodTypes.includes(moodType[j]) == false) && (moodType[j] !== "man")&& (moodType[j] !== "woman")&&(moodType[j] !== "totalPerson")){
                            allMoodTypes.push(moodType[j])
                        }
                    }
                })
                db.database().ref(`objects/${dateArray[i]}/person/happy`).on('value', function(snapshot){
                    totalHappiness = totalHappiness + snapshot.val()
                })
            }

            allMoodTypes.map((obj,key)=>{
                let amount=0;
                
                for(let i = 0; i<dateArray.length; i++){
                    db.database().ref(`objects/${dateArray[i]}/person/${obj}`).on('value', function (snapshot) {
                        let number = snapshot.val()
                        amount = amount + number
                    })
                }
                somdata = somdata + amount
            })
            document.getElementById('amountHappiness').innerHTML = ((totalHappiness/somdata)*100).toFixed(2) + ' %'
        })
    }

    useEffect(() => {
        makeData()
    }, [])

    return(
        <div>
        <h2 id="amountHappiness"></h2>
        <h3>happiness</h3>
        </div>
    )
}