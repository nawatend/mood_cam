import React from 'react';
import Days from './../components/Dashboard/Days';
import Persons from './../components/Dashboard/Person';
import Objects from './../components/Dashboard/Objects';
import Happiness from './../components/Dashboard/Happiness';
import Obj from './../components/Graphs/ObjectGraph/ObjectGraphPie';
import Overview from './../components/Graphs/statisticGraph/OverviewGraph';
import Mood from './../components/Graphs/MoodGraph/MoodGraphPie';

export default function Home () {
    return (
        <div className="page">
        <h1>Dashboard</h1>
        <div className="dashboard">
            <div className="rowtop">
                <Days/>
                <Persons/>
                <Objects/>
                <Happiness/>
            </div>
            <div className="rowbottom">
                <div><Obj/></div>
                <div><Overview/></div>
                <div><Mood/></div>
            </div>
        </div>
        </div>
    )
}