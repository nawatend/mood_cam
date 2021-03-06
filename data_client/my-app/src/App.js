import React from 'react';
import Home from './views/Home';
import ObjectPage from './views/ObjectPage';
import Statistic from './views/Statistic';
import Mood from './views/Mood';
import Dashboard from './views/Dashboard';
import './App.css';
import './css/graphic.css';
import './css/page.css';
import './css/dashboard.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
   <div>
     <div className="navigation">
       <a className="homeNav"  href="/"></a>
       <a href="/dashboard">Dashboard</a>
       <a href="/object">Object page</a>
       <a href="/statistics">Statistics page</a>
       <a href="/mood">Mood page</a>
     </div>
     <div className="pagebody">
      <Router>
        <Route path="/" component={Home} exact/>
        <Route path="/dashboard" component={Dashboard} exact/>
        <Route path="/object" component={ObjectPage} exact/>
        <Route path="/statistics" component={Statistic} exact/>
        <Route path="/mood" component={Mood} exact/>
      </Router>
     </div>
   </div>
  );
}

export default App;
