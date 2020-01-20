import db from '../components/Firebase.jsx';
import {Bar, Line, Pie} from 'react-chartjs-2';
import React, { useState, useEffect, Component } from 'react';
import ObjectGraphBar from './../components/Graphs/ObjectGraph/ObjectGraphBar';
import ObjectGraphPie from './../components/Graphs/ObjectGraph/ObjectGraphPie';
import ObjectOverview from './../components/Graphs/ObjectGraph/OverviewGraph';


export default function ObjectPage() {

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
            <h1>Objects</h1>
            <p>Here you can see all objects that are detected in total!</p>
            <div className="select">
                <label id="circleBtn" onClick={seeCircle}>Circle</label>
                <label id="barBtn" onClick={seeBar}>Bar</label>
                <label id="overviewBtn" onClick={seeOverview}>Overview</label>
            </div>
            <div id="graphic" className="graphic">
                <ObjectGraphPie/>
                <ObjectGraphBar id="bar"/>
                <ObjectOverview/>
            </div>
        </div>
    )
}