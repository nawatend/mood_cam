import React, { useState, useEffect, Component } from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
import db from '../components/Firebase';
import MoodGraphPie from '../components/Graphs/MoodGraph/MoodGraphPie';
import MoodGraphBar from '../components/Graphs/MoodGraph/MoodGraphBar';



export default function Mood () {

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
            <h1>Mood</h1>
            <p>Here you can select from day to day if there where any persons what there mood was</p>
            <div className="select">
                <label id="circlebtn" onClick={seeCircle}>Circle</label>
                <label id="barbtn" onClick={seeBar}>Bar</label>
            </div>
            
            <div class="graphic">
           <MoodGraphPie/>
           <MoodGraphBar/>
           </div>
        </div>
    )
}