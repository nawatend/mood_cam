import React, { useState, useEffect, Component } from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
import db from '../../Firebase';

export default function ObjPrsGraph(){

    const [dataBar, setDataBar] = useState("");
    const [optionBar, setOptionBar] = useState("");
    let dateArray = "";
    let allObjects = [];
    let amountObjects=0;
    let amountPersons=0;


    
    function makeGraphic(){
        setDataBar({
            labels: ["total Objects", "total Persons"],
            datasets: [{
                label: "Objects",
                data: [amountObjects, amountPersons],
                backgroundColor: [
                    'rgba(96, 46, 103,1)',
                    'rgba(243, 205, 0, 1)'
                ]     
            }],
        })

        setOptionBar({
            legend: {
                position: 'right',
            }
        })
    }
    
    function makeData(){
        db.database().ref("objects").on('value', function (snapshot) {
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
                db.database().ref(`objects/${dateArray[i]}/person/totalPerson`).on('value',function(snapshot){
                    amountPersons = amountPersons + snapshot.val()
                })   
            }
            allObjects.map((obj,key)=>{                
                for(let i = 0; i<dateArray.length; i++){
                    db.database().ref(`objects/${dateArray[i]}/${obj}`).on('value', function (snapshot) {
                        let number = snapshot.val()
                        amountObjects = amountObjects + number
                    })

                }
            })
            makeGraphic();

        })
    }
    
    useEffect(() => {
        makeData()
    }, [])


    console.log(db)
    return(
        <Pie id="objprs" width='100' height='100' data={dataBar} options={optionBar}/>
    )
}
