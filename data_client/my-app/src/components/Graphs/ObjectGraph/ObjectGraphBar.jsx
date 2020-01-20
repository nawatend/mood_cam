import db from './../../Firebase';
import {Bar, Line, Pie} from 'react-chartjs-2';
import React, { useState, useEffect, Component } from 'react';

export default function ObjectGraphBar(){
    const [dataBar, setDataBar] = useState("");
    const [optionBar, setOptionBar] = useState("");
    let randomColor = [];
    let dateArray = "";
    let allObjects = [];
    let somdata = []

    function RandomColor(){
        for(let i=0; i<somdata.length; i++){
            let red = Math.floor(Math.random() * 255) + 1  
            let green = Math.floor(Math.random() * 255) + 1  
            let blue = Math.floor(Math.random() * 255) + 1  
            randomColor.push(`rgba(${red},${green},${blue},0.9)`)
        }
        console.log(randomColor);
        makeGraphic()

    }
    
    function makeGraphic(){
        setDataBar({
            labels: allObjects,
            datasets: [{
                label: "Objects",
                data: somdata,
                backgroundColor: randomColor     
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
                
            }
            allObjects.map((obj,key)=>{
                console.log(obj)
                let amount=0;
                
                for(let i = 0; i<dateArray.length; i++){
                    db.database().ref(`objects/${dateArray[i]}/${obj}`).on('value', function (snapshot) {
                        let number = snapshot.val()
                        amount = amount + number
                    })
                }
                somdata.push(amount)
            })
            RandomColor();

        })
    }
    
    useEffect(() => {
        makeData()
    }, [])

    window.addEventListener('load', function(){
        document.getElementById('bar').style.display="none"
    })


    return(
        <Bar id="bar" width='100' height='100' data={dataBar} options={optionBar}/>
    )
}