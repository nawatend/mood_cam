import db from './../Firebase';
import {Bar, Line, Pie} from 'react-chartjs-2';
import React, { useState, useEffect, Component } from 'react';

export default function Objects(){
    
    let dateArray = "";


    function makeData(){
        db.database().ref("objects").on('value', function (snapshot) {
            let allObjects = [];
            let amountObjects=0;
            let dates = snapshot.val();
            dateArray = Object.keys(dates)
            
            for(let i = 0; i<dateArray.length; i++){
                db.database().ref(`objects/${dateArray[i]}`).on('value', function (snapshot) {
                    let objectType = Object.keys(snapshot.val());
                    for(let j = 0; j< objectType.length; j++){
                        if((allObjects.includes(objectType[j]) == false) && (objectType[j] !== "person")){
                            allObjects.push(objectType[j])
                        }
                    }
                })  
            }
            allObjects.map((obj,key)=>{                
                for(let i = 0; i<dateArray.length; i++){
                    db.database().ref(`objects/${dateArray[i]}/${obj}`).on('value', function (snapshot) {
                        let number = snapshot.val()
                        amountObjects = amountObjects + number
                    })

                }
                document.getElementById('amountObject').innerHTML = amountObjects
            })
        })
    }

    useEffect(() => {
        makeData()
    }, [])

    return(
        <div>
            <h2 id="amountObject"></h2>
            <h3>Object Detected</h3>
        </div>
    )
}