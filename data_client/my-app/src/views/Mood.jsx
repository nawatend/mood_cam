import React, { useState, useEffect, Component } from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
import db from '../components/Firebase';
import MoodGraphPie from '../components/Graphs/MoodGraph/MoodGraphPie';
import MoodGraphBar from '../components/Graphs/MoodGraph/MoodGraphBar';
import MoodGraphOverview from '../components/Graphs/MoodGraph/MoodGraphOverview';

export default function Mood () {

    window.addEventListener('load', function(){
        document.getElementById('overview').style.display="none";
        document.getElementById('bar').style.display="none"
    })

    const unseeCircle =()=>{
        document.getElementById('circle').style.display="none"
        document.getElementById('circleBtn').style.borderBottom="1px solid rgb(6, 6, 92)"
        document.getElementById('circleBtn').style.fontWeight="100"
    }
    const unseeBar =()=>{
        document.getElementById('bar').style.display="none"
        document.getElementById('barBtn').style.borderBottom="1px solid rgb(6, 6, 92)"
        document.getElementById('barBtn').style.fontWeight="100"
    }
    const unseeOverview =()=>{
        document.getElementById('overview').style.display="none"
        document.getElementById('overviewBtn').style.borderBottom="1px solid rgb(6, 6, 92)"
        document.getElementById('overviewBtn').style.fontWeight="100"
    }
    
    const seeCircle =()=>{
        document.getElementById('circle').style.display="block"
        document.getElementById('circleBtn').style.borderBottom="3px solid rgb(6, 6, 92)"
        document.getElementById('circleBtn').style.fontWeight="800"
        unseeBar()
        unseeOverview()
    }
    const seeBar =()=>{
        document.getElementById('bar').style.display="block"
        document.getElementById('barBtn').style.borderBottom="3px solid rgb(6, 6, 92)"
        document.getElementById('barBtn').style.fontWeight="800"
        unseeCircle()
        unseeOverview()
    }
    const seeOverview =()=>{
        document.getElementById('overview').style.display="block"
        document.getElementById('overviewBtn').style.borderBottom="3px solid rgb(6, 6, 92)"
        document.getElementById('overviewBtn').style.fontWeight="800"
        unseeCircle()
        unseeBar()
    }


    return (
        <div className="page">
            <h1>Mood</h1>
            <p>Here you can select from day to day if there where any persons what there mood was</p>
            <div className="select">
                <label id="circleBtn" onClick={seeCircle}>Circle</label>
                <label id="barBtn" onClick={seeBar}>Bar</label>
                <label id="overviewBtn" onClick={seeOverview}>Overview</label>
            </div>     
            <div class="graphic">
           <MoodGraphPie/>
           <MoodGraphBar/>
           <MoodGraphOverview/>
           </div>
        </div>
    )
}