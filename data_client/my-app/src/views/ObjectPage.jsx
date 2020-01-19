import db from '../components/Firebase.jsx';
import {Bar, Line, Pie} from 'react-chartjs-2';
import React, { useState, useEffect, Component } from 'react';


export default function ObjectPage() {
    const [obj, setobj] = useState("");
    const [dataBar, setDataBar] = useState("");
    const [optionBar, setOptionBar] = useState("");
    const [date, setDate] = useState("")
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





    window.addEventListener('load', function(){
        document.getElementById('bar').style.display="none"
    })
    
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
                <Bar className="displaynone" id="bar" width='100' height='100' data={dataBar} options={optionBar}/>
            </div>
        </div>
    )
}