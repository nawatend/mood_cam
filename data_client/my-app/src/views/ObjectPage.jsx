import db from '../components/Firebase.jsx';
import {Bar, Line, Pie} from 'react-chartjs-2';
import React, { useState, useEffect, Component } from 'react';
import ObjectGraphBar from './../components/Graphs/ObjectGraph/ObjectGraphBar';
import ObjectGraphPie from './../components/Graphs/ObjectGraph/ObjectGraphPie';


export default function ObjectPage() {
    
    
    const seeBar =()=>{
        document.getElementById('circle').style.display="none"
        document.getElementById('bar').style.display="block"
        document.getElementById('barbtn').style.borderBottom="3px solid rgb(6, 6, 92)"
        document.getElementById('circlebtn').style.borderBottom="1px solid rgb(6, 6, 92)"
        document.getElementById('barbtn').style.fontWeight="800"
        document.getElementById('circlebtn').style.fontWeight="100"
        
    }
    const seeCircle =()=>{
        document.getElementById('circle').style.display="block";
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
                <ObjectGraphPie/>
                <ObjectGraphBar id="bar"/>
            </div>
        </div>
    )
}