import db from '../components/Firebase.jsx';
import {Bar, Line, Pie} from 'react-chartjs-2';
import React, { useState, useEffect, Component } from 'react';


export default function ObjectPage() {
    const [obj, setobj] = useState("");
    const [dataBar, setDataBar] = useState("");
    const [optionBar, setOptionBar] = useState("");
    const keys = []

    window.addEventListener('load', function(){
        document.getElementById('bar').style.display="none"
   
        const data = db.database().ref("objects");
        data.on('value', function (snapshot) {      
            for (var date in snapshot.val()) {
                if(snapshot.val().hasOwnProperty(date)){
                    keys.push(date)
                }
            }
        
        

            console.log('hi')
            console.log(keys.length)
            for(let i=0; i< keys.length; i++){
                let specificData = db.database().ref("objects/"+keys[i])
                specificData.on('value',function(snapshot){
                    console.log(snapshot.val())
                })
            }
        })
    })


    useEffect(() => {

        setDataBar({
            labels: ["aardbij", "banaan", "kers"],
            datasets: [{
                label: "fruit",
                data:[2, 5, 7],
                backgroundColor: [
                    "rgba(153,255,51,0.4)",
                    "rgba(153,0,51,0.4)",
                    "rgba(0,0,230,0.4)",
                ],
            }],
        })

        setOptionBar({
            legend: {
                position: 'right',
            }
        })
        
        
    }, [])

    const seeBar =()=>{
        document.getElementById('circle').style.display="none"
        document.getElementById('bar').style.display="block"
        document.getElementById('barbtn').style.borderBottom="3px solid rgb(6, 6, 92)"
        document.getElementById('circlebtn').style.borderBottom="1px solid rgb(6, 6, 92)"
        document.getElementById('barbtn').style.fontWeight="800"
        document.getElementById('circlebtn').style.fontWeight="100"
        
    }
    const seeCircle =()=>{
        document.getElementById('circle').style.display="block"
        document.getElementById('bar').style.display="none"
        document.getElementById('circlebtn').style.borderBottom="solid 3px rgb(6, 6, 92)"
        document.getElementById('barbtn').style.borderBottom="1px solid rgb(6, 6, 92)"
        document.getElementById('barbtn').style.fontWeight="100"
        document.getElementById('circlebtn').style.fontWeight="800"

    }


    
   

    return (
        <div className="page">
            <h1>Objects</h1>
            <p>Here you can see all objects that are detected in total!</p>
            <div className="select">
                <label id="circlebtn" onClick={seeCircle}>Circle</label>
                <label id="barbtn" onClick={seeBar}>Bar</label>
              
            </div>
            <div id="graphic" className="graphic">
                <Pie id="circle" width='100' height='100' data={dataBar} options={optionBar}/>
                <Bar style="visibility: hidden;"className="displaynone" id="bar" width='100' height='100' data={dataBar} options={optionBar}/>
            </div>
        </div>
    )
}