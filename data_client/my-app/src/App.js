import React from 'react';
import Home from './views/Home';
import ObjectP from './views/Object';
import Statistic from './views/Statistic';
import Mood from './views/Mood';
import './App.css';

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
       <a href="/">Home</a>
       <a href="/object">Object page</a>
       <a href="/statistics">Statistic page</a>
       <a href="/mood">Mood page</a>
     </div>
     <Router>
       <Route path="/" component={Home} exact/>
       <Route path="/object" component={ObjectP} exact/>
       <Route path="/statistics" component={Statistic} exact/>
       <Route path="/mood" component={Mood} exact/>
     </Router>
   </div>
  );
}

export default App;
