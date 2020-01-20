import React, { useState, useEffect, Component } from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
import db from '../../Firebase';

export default function MoodGraphOverview(){
    const [dataLine, setDataLine] = useState("");
    const [optionLine, setOptionLine] = useState("");
    let dateArray = "";
    let allMoodTypes = [];
    let numberArray=[];

    function getData(){
        db.database().ref("objects").on('value', function (snapshot) {
            let dates = snapshot.val();
            dateArray = Object.keys(dates)

            for(let i = 0; i<dateArray.length; i++){
                db.database().ref(`objects/${dateArray[i]}/person`).on('value', function (snapshot) {
                    let moodTypes = Object.keys(snapshot.val());
                    for(let j = 0; j< moodTypes.length; j++){
                        if((allMoodTypes.includes(moodTypes[j]) == false) && (moodTypes[j] !== "man")&& (moodTypes[j] !== "woman")&& (moodTypes[j] !== "totalPerson")){
                            allMoodTypes.push(moodTypes[j])
                        }
                    }
                })
            }
            allMoodTypes.map((moodamount,key)=>{
                let littleNumberArray = []

                for(let i = 0; i<dateArray.length; i++){
                    db.database().ref(`objects/${dateArray[i]}/person/${moodamount}`).on('value', function (snapshot) {
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
            makeGraphic()
        })
    }

    window.addEventListener('load', function(){
        document.getElementById('bar').style.display="none"
    })

    function makeGraphic() {
        let dataset = []

        for(let i = 0; i<allMoodTypes.length; i++){
            let red = Math.floor(Math.random() * 255) + 1  
            let green = Math.floor(Math.random() * 255) + 1  
            let blue = Math.floor(Math.random() * 255) + 1  

            let newdataset = {
                data: numberArray[i],
                label: allMoodTypes[i],
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

    useEffect(() => {
        getData()
    }, [])

    
  


    return(
        <Line id="overview" className="displaynone" width='100' height='100' data={dataLine} options={optionLine}/>
    )

}