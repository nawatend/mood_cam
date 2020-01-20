import React, { useState, useEffect, Component } from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
import db from '../../Firebase';

export default function OverviewGraph(){
    const [dataLine, setDataLine] = useState("");
    const [optionLine, setOptionLine] = useState("");

    let dateArray = "";
    let allObjects = [];
    let numberArray = [];




    function makeGraph(){
        let dataset = []

        for(let i = 0; i<allObjects.length; i++){
            let red = Math.floor(Math.random() * 255) + 1  
            let green = Math.floor(Math.random() * 255) + 1  
            let blue = Math.floor(Math.random() * 255) + 1  

            let newdataset = {
                data: numberArray[i],
                label: allObjects[i],
                borderColor: 
                `rgba(${red}, ${green}, ${blue})`,
                fill: false,
            }
            dataset.push(newdataset)
        }
        setDataLine({
            labels: dateArray,
            datasets: dataset
        })

        setOptionLine({
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
                let littleNumberArray = []

                for(let i = 0; i<dateArray.length; i++){
                    db.database().ref(`objects/${dateArray[i]}/${obj}`).on('value', function (snapshot) {
                        let number = snapshot.val()
                        if(number == null){
                            littleNumberArray.push(0)
                        }else {
                            littleNumberArray.push(number)
                        }
                    })
                }
                numberArray.push(littleNumberArray)

                console.log(numberArray)
            })
            makeGraph()
        })
    }
    
    useEffect(() => {
        makeData()
    }, [])

    return(
        <Line id="overview" width='100' height='100' data={dataLine} options={optionLine}/>
    )
}