import React from 'react';
import db from './../components/Firebase.jsx';
import {Bar, Line, Pie} from 'react-chartjs-2'

export default function Object() {
    let data = db.database().ref("objects");
    data.on('value', function (snapshot) {
        let date = snapshot.val();
        console.log(date)
    })


    const dataBar = {
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
    } ;

    const optionBar = {
            legend: {
                position: 'right',
            }
    }


    const seeBar =()=>{
        document.getElementById('circle').style.display="none"
        document.getElementById('bar').style.display="block"
    }
    const seeCircle =()=>{
        document.getElementById('circle').style.display="block"
        document.getElementById('bar').style.display="none"
    }
    
   

    return (
        <div class="page">
            <h1>Object</h1>
            <p>Here you can see all objects that are detected in total!</p>
            <div>
                <button onClick={seeCircle}>Circle</button>
                <button onClick={seeBar}>Bar</button>
            </div>
            <div className="graphic">
                <Pie id="circle" width="100" height="100" data={dataBar} options={optionBar}/>
                <Bar id="bar" width="100" height="100" data={dataBar} options={optionBar}/>
            </div>
        </div>
    )
}