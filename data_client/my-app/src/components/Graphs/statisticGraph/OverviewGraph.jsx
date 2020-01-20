import React, { useState, useEffect, Component } from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
import db from './../../Firebase';

export default function OverviewGraph(){

    console.log(db)
    return(
        <Bar id="overview" width='100' height='100'/>
    )
}
