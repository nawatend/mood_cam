import React, { useState, useEffect, Component } from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
import db from '../../Firebase';

export default function MoodGraph(props){
    const [dataBar, setDataBar] = useState("");
    const [optionBar, setOptionBar] = useState("");
    let dateArray = "";
    let allMoodTypes = [];
    let somdata = [];

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
                let amount=0;
                
                for(let i = 0; i<dateArray.length; i++){
                    db.database().ref(`objects/${dateArray[i]}/person/${obj}`).on('value', function (snapshot) {
                        let number = snapshot.val()
                        amount = amount + number
                    })
                }
                somdata.push(amount)
            })
            makeGraphic()
        })
    }


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

    // if(props.datum && (dateArray !== [props.datum])){
    //     dateArray = [props.datum]
    //     console.log(dateArray);
    //     getData();

    // }


    useEffect(() => {
        getData()
    }, [])

    return(
        <Pie id="circle" width='100' height='100' data={dataBar} options={optionBar}/>
    )

}