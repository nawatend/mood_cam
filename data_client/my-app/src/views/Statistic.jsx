import React, { useState, useEffect, Component } from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
import db from '../components/Firebase.jsx';
import GenderGraph from '../components/Graphs/statisticGraph/GenderGraph';
import ObjPrsGraph from '../components/Graphs/statisticGraph/ObjPrsGraph';
import OverviewGraph from '../components/Graphs/statisticGraph/OverviewGraph';


export default function Statistic () {
   


    window.addEventListener('load', function(){
        document.getElementById('overview').style.display="none";
        document.getElementById('objprs').style.display="none"
    })

    const unseeGender =()=>{
        document.getElementById('gender').style.display="none"
        document.getElementById('genderBtn').style.borderBottom="1px solid rgb(6, 6, 92)"
        document.getElementById('genderBtn').style.fontWeight="100"
    }
    const unseeObjPrs =()=>{
        document.getElementById('objprs').style.display="none"
        document.getElementById('objPrsBtn').style.borderBottom="1px solid rgb(6, 6, 92)"
        document.getElementById('objPrsBtn').style.fontWeight="100"
    }
    const unseeOverview =()=>{
        document.getElementById('overview').style.display="none"
        document.getElementById('overviewBtn').style.borderBottom="1px solid rgb(6, 6, 92)"
        document.getElementById('overviewBtn').style.fontWeight="100"
    }
    
    const seeGender =()=>{
        document.getElementById('gender').style.display="block"
        document.getElementById('genderBtn').style.borderBottom="3px solid rgb(6, 6, 92)"
        document.getElementById('genderBtn').style.fontWeight="800"
        unseeObjPrs()
        unseeOverview()
    }
    const seeObjPrs =()=>{
        document.getElementById('objprs').style.display="block"
        document.getElementById('objPrsBtn').style.borderBottom="3px solid rgb(6, 6, 92)"
        document.getElementById('objPrsBtn').style.fontWeight="800"
        unseeGender()
        unseeOverview()
    }
    const seeOverview =()=>{
        document.getElementById('overview').style.display="block"
        document.getElementById('overviewBtn').style.borderBottom="3px solid rgb(6, 6, 92)"
        document.getElementById('overviewBtn').style.fontWeight="800"
        unseeGender()
        unseeObjPrs()
    }



    return (
        <div className="page">
            <h1>statistics</h1>
            <p>Here you can see al the statistics in order what you want to see</p>
            <div className="select">
                <label id="genderBtn" onClick={seeGender}>Gender</label>
                <label id="objPrsBtn" onClick={seeObjPrs}>Object vs Person</label>
                <label id="overviewBtn" onClick={seeOverview}>Overview</label>
            </div>
            <div id="graphic" className="graphic">
                <GenderGraph />
                <ObjPrsGraph />
                <OverviewGraph />
            </div>
        </div>
    )
}