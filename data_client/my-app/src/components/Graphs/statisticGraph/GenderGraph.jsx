import React, { useState, useEffect, Component } from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
import db from './../../Firebase';

export default function GenderGraph(){
    const [dataGender, setDataGender] = useState("");
    const [optionGender, setOptionGender] = useState("");
    let menAmount = 0
    let womanAmount = 0
    let dateArray = "";

    function makeGraphic () {
        setDataGender({
            labels: ['men', 'woman'],
            datasets: [{
                label: "Gender",
                data: [menAmount, womanAmount],
                backgroundColor: [
                    'rgba(24, 49, 108, 1)',
                    'rgba(219, 39, 72, 1)',
                ],     
            }],
        })

        setOptionGender({
            legend: {
                position: 'right',
            }
        })
    }

    function makeData (){
        db.database().ref("objects").on('value', function (snapshot) {
            let dates = snapshot.val();
            dateArray = Object.keys(dates)
            
            for(let i = 0; i<dateArray.length; i++){
                db.database().ref(`objects/${dateArray[i]}/person/man`).on('value', function (snapshot) {
                    let amount = snapshot.val()
                    menAmount = menAmount + amount
                })
                db.database().ref(`objects/${dateArray[i]}/person/woman`).on('value', function (snapshot) {
                    let amount = snapshot.val()
                    womanAmount = womanAmount + amount
                })
                
            }
            makeGraphic()

        })
    }

    useEffect(() => {
        makeData()
    }, [])

    return(
        <Pie id="gender" width='100' height='100' data={dataGender} options={optionGender}/>  
    )
}