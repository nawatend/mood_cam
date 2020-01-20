import React, { useState, useEffect, Component } from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
import db from '../../Firebase';
import DatePicker from "react-datepicker";


export default function MoodGraph(){
    const [dataBar, setDataBar] = useState("");
    const [optionBar, setOptionBar] = useState("");
    let dateArray = "";
    let allMoodTypes = [];
    let somdata = [];
    const [startDate, setStartDate] = useState(new Date());


    function getData(){
        db.database().ref("objects").on('value', function(snapshot) {
            let dates = snapshot.val()
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
                
            }

            allMoodTypes.map((obj,key)=>{
                console.log(obj)
                let amount=0;
                
                for(let i = 0; i<dateArray.length; i++){
                    db.database().ref(`objects/${dateArray[i]}/person/${obj}`).on('value', function (snapshot) {
                        let number = snapshot.val()
                        amount = amount + number
                    })
                }
                somdata.push(amount)
            })
            console.log(somdata)
            makeGraphic()
        })
    }

    window.addEventListener('load', function(){
        document.getElementById('bar').style.display="none"
    })

    function makeGraphic() {
        setDataBar({
            labels: allMoodTypes,
            datasets: [{
                label: "Mood",
                data: somdata,
                backgroundColor: [
                    'rgba(132, 16, 16, 0.4)',
                    'rgba(233, 229, 200, 0.4)',
                    'rgba(181, 225, 198, 0.4)',
                    'rgba(255, 255, 255, 0.4)',
                    'rgba(24, 49, 108, 0.4)',
                    'rgba(255, 122, 23, 0.4)',
                ]     
            }],
        })

        setOptionBar({
            legend: {
                position: 'right',
            }
        })
    }

    useEffect(() => {
        getData()
    }, [])

    
  


    return(
        <div>
        <Bar id="bar" className="displaynone" id="bar" width='100' height='100' data={dataBar} options={optionBar}/>
        </div>
    )

}